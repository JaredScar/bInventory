local QBCore = exports['qb-core']:GetCoreObject()

-- Server-side inventory management
local PlayerInventories = {}
local ContainerInventories = {}
local TrunkInventories = {}
local GloveboxInventories = {}
local StashInventories = {}

-- Initialize player inventory
RegisterNetEvent('QBCore:Server:OnPlayerLoaded', function()
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if Player then
        PlayerInventories[src] = {
            items = Player.PlayerData.items or {},
            maxWeight = Config.MaxWeight,
            maxSlots = Config.MaxSlots
        }
    end
end)

RegisterNetEvent('QBCore:Server:OnPlayerUnload', function()
    local src = source
    PlayerInventories[src] = nil
end)

-- Use item
RegisterNetEvent('binventory:server:useItem', function(itemName, slot, amount)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local item = Player.Functions.GetItemBySlot(slot)
    if not item or item.name ~= itemName then
        TriggerClientEvent('binventory:client:itemUsed', src, itemName, false)
        return
    end
    
    if item.amount < amount then
        TriggerClientEvent('binventory:client:itemUsed', src, itemName, false)
        return
    end
    
    -- Check if item is useable
    local qbItem = QBCore.Shared.Items[itemName]
    if not qbItem or not qbItem.useable then
        TriggerClientEvent('binventory:client:itemUsed', src, itemName, false)
        return
    end
    
    -- Use item
    local success = Player.Functions.RemoveItem(itemName, amount, slot)
    if success then
        -- Trigger item use event
        TriggerEvent('binventory:server:itemUsed', src, itemName, amount, item.info)
        TriggerClientEvent('binventory:client:itemUsed', src, itemName, true)
        
        -- Update inventory
        UpdatePlayerInventory(src)
    else
        TriggerClientEvent('binventory:client:itemUsed', src, itemName, false)
    end
end)

-- Drop item
RegisterNetEvent('binventory:server:dropItem', function(itemName, slot, amount)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local item = Player.Functions.GetItemBySlot(slot)
    if not item or item.name ~= itemName then
        TriggerClientEvent('binventory:client:itemDropped', src, itemName, false)
        return
    end
    
    if item.amount < amount then
        TriggerClientEvent('binventory:client:itemDropped', src, itemName, false)
        return
    end
    
    -- Drop item
    local success = Player.Functions.RemoveItem(itemName, amount, slot)
    if success then
        -- Create ground item
        local playerCoords = GetEntityCoords(GetPlayerPed(src))
        CreateGroundItem(itemName, amount, playerCoords, item.info)
        
        TriggerClientEvent('binventory:client:itemDropped', src, itemName, true)
        
        -- Update inventory
        UpdatePlayerInventory(src)
    else
        TriggerClientEvent('binventory:client:itemDropped', src, itemName, false)
    end
end)

-- Transfer item
RegisterNetEvent('binventory:server:transferItem', function(itemName, fromSlot, toSlot, fromSource, toSource, amount)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    if fromSource == 'player' and toSource == 'player' then
        -- Moving within player inventory
        local success = Player.Functions.MoveItem(fromSlot, toSlot, amount)
        if success then
            TriggerClientEvent('binventory:client:itemTransferred', src, itemName, true)
            UpdatePlayerInventory(src)
        else
            TriggerClientEvent('binventory:client:itemTransferred', src, itemName, false)
        end
    elseif fromSource == 'player' and toSource == 'container' then
        -- Moving from player to container
        local item = Player.Functions.GetItemBySlot(fromSlot)
        if not item or item.name ~= itemName then
            TriggerClientEvent('binventory:client:itemTransferred', src, itemName, false)
            return
        end
        
        if item.amount < amount then
            TriggerClientEvent('binventory:client:itemTransferred', src, itemName, false)
            return
        end
        
        -- Check if container can accept item
        local containerId = GetCurrentContainer(src)
        if not containerId then
            TriggerClientEvent('binventory:client:itemTransferred', src, itemName, false)
            return
        end
        
        local canAdd, reason = CanAddItemToContainer(containerId, itemName, amount)
        if not canAdd then
            TriggerClientEvent('binventory:client:itemTransferred', src, itemName, false)
            return
        end
        
        -- Transfer item
        local success = Player.Functions.RemoveItem(itemName, amount, fromSlot)
        if success then
            AddItemToContainer(containerId, itemName, amount, toSlot, item.info)
            TriggerClientEvent('binventory:client:itemTransferred', src, itemName, true)
            UpdatePlayerInventory(src)
            UpdateContainerInventory(src, containerId)
        else
            TriggerClientEvent('binventory:client:itemTransferred', src, itemName, false)
        end
    elseif fromSource == 'container' and toSource == 'player' then
        -- Moving from container to player
        local containerId = GetCurrentContainer(src)
        if not containerId then
            TriggerClientEvent('binventory:client:itemTransferred', src, itemName, false)
            return
        end
        
        local item = GetItemFromContainer(containerId, fromSlot)
        if not item or item.name ~= itemName then
            TriggerClientEvent('binventory:client:itemTransferred', src, itemName, false)
            return
        end
        
        if item.amount < amount then
            TriggerClientEvent('binventory:client:itemTransferred', src, itemName, false)
            return
        end
        
        -- Check if player can accept item
        local canAdd, reason = Player.Functions.CanCarryItem(itemName, amount)
        if not canAdd then
            TriggerClientEvent('binventory:client:itemTransferred', src, itemName, false)
            return
        end
        
        -- Transfer item
        local success = RemoveItemFromContainer(containerId, fromSlot, amount)
        if success then
            Player.Functions.AddItem(itemName, amount, toSlot, item.info)
            TriggerClientEvent('binventory:client:itemTransferred', src, itemName, true)
            UpdatePlayerInventory(src)
            UpdateContainerInventory(src, containerId)
        else
            TriggerClientEvent('binventory:client:itemTransferred', src, itemName, false)
        end
    end
end)

-- Split item
RegisterNetEvent('binventory:server:splitItem', function(itemName, slot, amount, newAmount)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local item = Player.Functions.GetItemBySlot(slot)
    if not item or item.name ~= itemName then return end
    
    if item.amount < (amount + newAmount) then return end
    
    -- Find empty slot for new stack
    local emptySlot = Player.Functions.GetFirstSlotByItem(nil)
    if not emptySlot then return end
    
    -- Split item
    local success = Player.Functions.RemoveItem(itemName, newAmount, slot)
    if success then
        Player.Functions.AddItem(itemName, newAmount, emptySlot, item.info)
        UpdatePlayerInventory(src)
    end
end)

-- Combine items
RegisterNetEvent('binventory:server:combineItems', function(item1, item2, slot1, slot2)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local item1Data = Player.Functions.GetItemBySlot(slot1)
    local item2Data = Player.Functions.GetItemBySlot(slot2)
    
    if not item1Data or not item2Data then return end
    if item1Data.name ~= item1 or item2Data.name ~= item2 then return end
    
    -- Check if items can be combined
    local qbItem1 = QBCore.Shared.Items[item1]
    local qbItem2 = QBCore.Shared.Items[item2]
    
    if not qbItem1 or not qbItem2 then return end
    if not qbItem1.combinable or not qbItem2.combinable then return end
    
    -- Combine items
    local combineData = qbItem1.combinable
    if combineData.accept[item2] then
        local success = Player.Functions.RemoveItem(item1, 1, slot1)
        if success then
            Player.Functions.RemoveItem(item2, 1, slot2)
            Player.Functions.AddItem(combineData.reward, 1, slot1, combineData.rewardinfo)
            UpdatePlayerInventory(src)
        end
    end
end)

-- Get trunk items
RegisterNetEvent('binventory:server:getTrunkItems', function(plate, trunkData)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local trunkId = 'trunk_' .. plate
    if not TrunkInventories[trunkId] then
        TrunkInventories[trunkId] = {
            items = {},
            maxWeight = Config.Containers.trunk.maxWeight,
            maxSlots = Config.Containers.trunk.maxSlots
        }
    end
    
    SetCurrentContainer(src, trunkId)
    TriggerClientEvent('binventory:client:openInventory', src, trunkData)
end)

-- Get glovebox items
RegisterNetEvent('binventory:server:getGloveboxItems', function(plate, gloveboxData)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local gloveboxId = 'glovebox_' .. plate
    if not GloveboxInventories[gloveboxId] then
        GloveboxInventories[gloveboxId] = {
            items = {},
            maxWeight = Config.Containers.glovebox.maxWeight,
            maxSlots = Config.Containers.glovebox.maxSlots
        }
    end
    
    SetCurrentContainer(src, gloveboxId)
    TriggerClientEvent('binventory:client:openInventory', src, gloveboxData)
end)

-- Get stash items
RegisterNetEvent('binventory:server:getStashItems', function(stashId, stashData)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local stashIdentifier = 'stash_' .. stashId
    if not StashInventories[stashIdentifier] then
        StashInventories[stashIdentifier] = {
            items = {},
            maxWeight = Config.Containers.stash.maxWeight,
            maxSlots = Config.Containers.stash.maxSlots
        }
    end
    
    SetCurrentContainer(src, stashIdentifier)
    TriggerClientEvent('binventory:client:openInventory', src, stashData)
end)

-- Pickup ground item
RegisterNetEvent('binventory:server:pickupItem', function(itemName, coords)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    -- Find ground item
    local groundItem = GetGroundItem(itemName, coords)
    if not groundItem then return end
    
    -- Check if player can carry item
    local canAdd, reason = Player.Functions.CanCarryItem(itemName, groundItem.amount)
    if not canAdd then
        TriggerClientEvent('QBCore:Notify', src, Lang:t('error.not_enough_space'), 'error')
        return
    end
    
    -- Add item to player
    local success = Player.Functions.AddItem(itemName, groundItem.amount, nil, groundItem.info)
    if success then
        RemoveGroundItem(itemName, coords)
        TriggerClientEvent('QBCore:Notify', src, Lang:t('success.item_received', {item = itemName}), 'success')
        UpdatePlayerInventory(src)
    end
end)

-- Update player inventory
function UpdatePlayerInventory(src)
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local playerItems = {}
    for slot, item in pairs(Player.PlayerData.items) do
        if item then
            local itemData = {
                id = item.name,
                name = item.label or item.name,
                image = GetItemImage(item.name),
                quantity = item.amount or 1,
                weight = GetItemWeight(item.name),
                slot = slot,
                category = GetItemCategory(item.name),
                description = GetItemDescription(item.name),
                durability = item.info and item.info.quality or 100,
                illegal = IsItemIllegal(item.name),
                info = item.info
            }
            table.insert(playerItems, itemData)
        end
    end
    
    TriggerClientEvent('binventory:client:updateInventory', src, playerItems, {})
end

-- Update container inventory
function UpdateContainerInventory(src, containerId)
    local containerItems = {}
    local container = GetContainer(containerId)
    
    if container then
        for slot, item in pairs(container.items) do
            if item then
                local itemData = {
                    id = item.name,
                    name = item.label or item.name,
                    image = GetItemImage(item.name),
                    quantity = item.amount or 1,
                    weight = GetItemWeight(item.name),
                    slot = slot,
                    category = GetItemCategory(item.name),
                    description = GetItemDescription(item.name),
                    durability = item.info and item.info.quality or 100,
                    illegal = IsItemIllegal(item.name),
                    info = item.info
                }
                table.insert(containerItems, itemData)
            end
        end
    end
    
    TriggerClientEvent('binventory:client:updateInventory', src, {}, containerItems)
end

-- Container management functions
function GetContainer(containerId)
    if string.find(containerId, 'trunk_') then
        return TrunkInventories[containerId]
    elseif string.find(containerId, 'glovebox_') then
        return GloveboxInventories[containerId]
    elseif string.find(containerId, 'stash_') then
        return StashInventories[containerId]
    end
    return nil
end

function CanAddItemToContainer(containerId, itemName, amount)
    local container = GetContainer(containerId)
    if not container then return false, "container_not_found" end
    
    local currentWeight = CalculateContainerWeight(container.items)
    local itemWeight = GetItemWeight(itemName)
    local totalWeight = currentWeight + (itemWeight * amount)
    
    if totalWeight > container.maxWeight then
        return false, "weight_limit"
    end
    
    local currentSlots = CalculateContainerSlots(container.items)
    if currentSlots >= container.maxSlots then
        return false, "slot_limit"
    end
    
    return true, "success"
end

function AddItemToContainer(containerId, itemName, amount, slot, info)
    local container = GetContainer(containerId)
    if not container then return false end
    
    container.items[slot] = {
        name = itemName,
        label = GetItemLabel(itemName),
        amount = amount,
        info = info
    }
    
    return true
end

function RemoveItemFromContainer(containerId, slot, amount)
    local container = GetContainer(containerId)
    if not container then return false end
    
    local item = container.items[slot]
    if not item then return false end
    
    if item.amount <= amount then
        container.items[slot] = nil
    else
        item.amount = item.amount - amount
    end
    
    return true
end

function GetItemFromContainer(containerId, slot)
    local container = GetContainer(containerId)
    if not container then return nil end
    
    return container.items[slot]
end

function CalculateContainerWeight(items)
    local totalWeight = 0
    for _, item in pairs(items) do
        if item and item.amount then
            totalWeight = totalWeight + (GetItemWeight(item.name) * item.amount)
        end
    end
    return totalWeight
end

function CalculateContainerSlots(items)
    local slots = 0
    for _, item in pairs(items) do
        if item then
            slots = slots + 1
        end
    end
    return slots
end

-- Ground item management
local GroundItems = {}

function CreateGroundItem(itemName, amount, coords, info)
    local itemId = GenerateItemId()
    GroundItems[itemId] = {
        name = itemName,
        amount = amount,
        coords = coords,
        info = info,
        created = os.time()
    }
end

function GetGroundItem(itemName, coords)
    for id, item in pairs(GroundItems) do
        if item.name == itemName and #(item.coords - coords) < 1.0 then
            return item
        end
    end
    return nil
end

function RemoveGroundItem(itemName, coords)
    for id, item in pairs(GroundItems) do
        if item.name == itemName and #(item.coords - coords) < 1.0 then
            GroundItems[id] = nil
            return true
        end
    end
    return false
end

function GenerateItemId()
    return os.time() .. math.random(1000, 9999)
end

-- Current container tracking
local CurrentContainers = {}

function SetCurrentContainer(src, containerId)
    CurrentContainers[src] = containerId
end

function GetCurrentContainer(src)
    return CurrentContainers[src]
end

function ClearCurrentContainer(src)
    CurrentContainers[src] = nil
end

-- Item use events
RegisterNetEvent('binventory:server:itemUsed', function(src, itemName, amount, info)
    if itemName == 'phone' then
        TriggerClientEvent('binventory:client:usePhone', src)
    elseif itemName == 'bandage' then
        TriggerClientEvent('binventory:client:useBandage', src)
    elseif itemName == 'water' then
        TriggerClientEvent('binventory:client:useWater', src)
    elseif itemName == 'lockpick' then
        TriggerClientEvent('binventory:client:useLockpick', src)
    elseif string.find(itemName, 'weapon_') then
        TriggerClientEvent('binventory:client:equipWeapon', src, itemName)
    end
end)

-- Utility functions (server-side versions)
function GetItemImage(itemName)
    if Config.ItemImages[itemName] then
        return Config.ItemImages[itemName]
    end
    
    local item = QBCore.Shared.Items[itemName]
    if item and item.image then
        return item.image
    end
    
    return 'https://via.placeholder.com/32x32?text=' .. itemName
end

function GetItemWeight(itemName)
    if Config.Weight.stackableItems[itemName] then
        return Config.Weight.stackableItems[itemName]
    end
    
    local item = QBCore.Shared.Items[itemName]
    if item and item.weight then
        return item.weight
    end
    
    return Config.Weight.defaultWeight
end

function GetItemCategory(itemName)
    if string.find(itemName, 'weapon_') then
        return 'weapons'
    elseif string.find(itemName, 'ammo_') then
        return 'ammo'
    elseif string.find(itemName, 'bandage') or string.find(itemName, 'medkit') or string.find(itemName, 'firstaid') then
        return 'medical'
    elseif string.find(itemName, 'water') or string.find(itemName, 'sandwich') or string.find(itemName, 'burger') then
        return 'consumables'
    elseif string.find(itemName, 'lockpick') or string.find(itemName, 'screwdriver') or string.find(itemName, 'wrench') then
        return 'tools'
    elseif string.find(itemName, 'money') or string.find(itemName, 'gold') or string.find(itemName, 'diamond') then
        return 'valuables'
    elseif string.find(itemName, 'tshirt') or string.find(itemName, 'pants') or string.find(itemName, 'shoes') then
        return 'clothing'
    else
        return 'misc'
    end
end

function GetItemDescription(itemName)
    local item = QBCore.Shared.Items[itemName]
    if item and item.description then
        return item.description
    end
    
    if Config.DefaultItems[itemName] then
        return Config.DefaultItems[itemName].description
    end
    
    return 'A mysterious item'
end

function GetItemLabel(itemName)
    local item = QBCore.Shared.Items[itemName]
    if item and item.label then
        return item.label
    end
    
    if Config.DefaultItems[itemName] then
        return Config.DefaultItems[itemName].label
    end
    
    return itemName
end

function IsItemIllegal(itemName)
    return Config.IllegalItems[itemName] or false
end

-- Export functions
exports('GetContainer', GetContainer)
exports('CanAddItemToContainer', CanAddItemToContainer)
exports('AddItemToContainer', AddItemToContainer)
exports('RemoveItemFromContainer', RemoveItemFromContainer)
exports('GetItemFromContainer', GetItemFromContainer)
exports('CalculateContainerWeight', CalculateContainerWeight)
exports('CalculateContainerSlots', CalculateContainerSlots)
exports('CreateGroundItem', CreateGroundItem)
exports('GetGroundItem', GetGroundItem)
exports('RemoveGroundItem', RemoveGroundItem)

-- Server events for inventory management
RegisterNetEvent('bInventory:server:useItem', function(itemName, amount)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local item = Player.Functions.GetItemByName(itemName)
    if not item then
        TriggerClientEvent('QBCore:Notify', src, 'Item not found!', 'error')
        return
    end
    
    if item.amount < amount then
        TriggerClientEvent('QBCore:Notify', src, 'Not enough items!', 'error')
        return
    end
    
    -- Use the item (this would trigger the item's use function)
    local success = Player.Functions.RemoveItem(itemName, amount)
    if success then
        TriggerClientEvent('QBCore:Notify', src, 'Item used successfully!', 'success')
        -- Update client inventory
        TriggerClientEvent('bInventory:client:updateInventory', src, GetPlayerInventory(Player), {}, GetHotbarItems(Player))
    else
        TriggerClientEvent('QBCore:Notify', src, 'Failed to use item!', 'error')
    end
end)

RegisterNetEvent('bInventory:server:dropItem', function(itemName, amount)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local item = Player.Functions.GetItemByName(itemName)
    if not item then
        TriggerClientEvent('QBCore:Notify', src, 'Item not found!', 'error')
        return
    end
    
    if item.amount < amount then
        TriggerClientEvent('QBCore:Notify', src, 'Not enough items!', 'error')
        return
    end
    
    -- Drop the item
    local success = Player.Functions.RemoveItem(itemName, amount)
    if success then
        -- Create item on ground (this would need to be implemented based on your server's item system)
        TriggerClientEvent('QBCore:Notify', src, 'Item dropped!', 'success')
        -- Update client inventory
        TriggerClientEvent('bInventory:client:updateInventory', src, GetPlayerInventory(Player), {}, GetHotbarItems(Player))
    else
        TriggerClientEvent('QBCore:Notify', src, 'Failed to drop item!', 'error')
    end
end)

RegisterNetEvent('bInventory:server:transferItem', function(itemName, amount, source)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local item = Player.Functions.GetItemByName(itemName)
    if not item then
        TriggerClientEvent('QBCore:Notify', src, 'Item not found!', 'error')
        return
    end
    
    if item.amount < amount then
        TriggerClientEvent('QBCore:Notify', src, 'Not enough items!', 'error')
        return
    end
    
    -- Transfer item logic would depend on the source (container, stash, etc.)
    -- This is a placeholder implementation
    TriggerClientEvent('QBCore:Notify', src, 'Item transferred!', 'success')
    -- Update client inventory
    TriggerClientEvent('bInventory:client:updateInventory', src, GetPlayerInventory(Player), {}, GetHotbarItems(Player))
end)

RegisterNetEvent('bInventory:server:moveItem', function(itemName, oldSlot, oldSource, newSlot, newSource)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    -- Move item logic
    local success = Player.Functions.MoveItem(oldSlot, newSlot)
    if success then
        TriggerClientEvent('QBCore:Notify', src, 'Item moved!', 'success')
        -- Update client inventory
        TriggerClientEvent('bInventory:client:updateInventory', src, GetPlayerInventory(Player), {}, GetHotbarItems(Player))
    else
        TriggerClientEvent('QBCore:Notify', src, 'Failed to move item!', 'error')
    end
end)

RegisterNetEvent('bInventory:server:getTrunkItems', function(plate)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    -- Get trunk items from database
    local trunkItems = MySQL.query.await('SELECT * FROM vehicle_trunks WHERE plate = ?', {plate})
    if trunkItems then
        TriggerClientEvent('bInventory:client:updateInventory', src, GetPlayerInventory(Player), trunkItems, GetHotbarItems(Player))
    end
end)

RegisterNetEvent('bInventory:server:getStashItems', function(stashId)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    -- Get stash items from database
    local stashItems = MySQL.query.await('SELECT * FROM player_stashes WHERE id = ?', {stashId})
    if stashItems then
        TriggerClientEvent('bInventory:client:updateInventory', src, GetPlayerInventory(Player), stashItems, GetHotbarItems(Player))
    end
end)

-- Helper functions
function GetPlayerInventory(Player)
    local items = {}
    local playerItems = Player.Functions.GetItems()
    
    for slot, item in pairs(playerItems) do
        if item then
            table.insert(items, {
                id = item.name,
                name = item.label,
                image = item.image or "https://via.placeholder.com/32x32",
                quantity = item.amount,
                weight = item.weight or 0.0,
                slot = slot,
                category = GetItemCategory(item.name),
                description = item.description or "No description available.",
                durability = item.info and item.info.quality or 100,
                illegal = item.illegal or false
            })
        end
    end
    
    return items
end

function GetHotbarItems(Player)
    local items = {}
    local hotbarSlots = {1, 2, 3, 4, 5}
    
    for _, slot in ipairs(hotbarSlots) do
        local item = Player.Functions.GetItemBySlot(slot)
        if item then
            table.insert(items, {
                id = item.name,
                name = item.label,
                image = item.image or "https://via.placeholder.com/32x32",
                quantity = item.amount,
                slot = slot,
                category = GetItemCategory(item.name),
                description = item.description or "No description available.",
                durability = item.info and item.info.quality or 100,
                weight = item.weight or 0.0,
                illegal = item.illegal or false
            })
        end
    end
    
    return items
end

function GetItemCategory(itemName)
    local categories = {
        weapons = {'weapon_', 'ammo_'},
        medical = {'bandage', 'medkit', 'firstaid', 'painkillers'},
        consumables = {'water', 'food', 'burger', 'sandwich'},
        tools = {'lockpick', 'screwdriver', 'phone'},
        valuables = {'gold', 'diamond', 'cash'},
        clothing = {'tshirt', 'pants', 'shoes'}
    }
    
    for category, items in pairs(categories) do
        for _, item in ipairs(items) do
            if string.find(string.lower(itemName), item) then
                return category
            end
        end
    end
    
    return "misc"
end

-- Export functions for other resources
exports('GetPlayerInventory', GetPlayerInventory)
exports('GetHotbarItems', GetHotbarItems)
exports('GetItemCategory', GetItemCategory)
