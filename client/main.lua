local QBCore = exports['qb-core']:GetCoreObject()
local PlayerData = {}
local isInventoryOpen = false

-- Initialize player data
RegisterNetEvent('QBCore:Client:OnPlayerLoaded', function()
    PlayerData = QBCore.Functions.GetPlayerData()
end)

RegisterNetEvent('QBCore:Client:OnPlayerUnload', function()
    PlayerData = {}
end)

RegisterNetEvent('QBCore:Client:OnJobUpdate', function(JobInfo)
    PlayerData.job = JobInfo
end)

-- Open inventory
RegisterCommand('inventory', function()
    OpenInventory()
end)

RegisterKeyMapping('inventory', 'Open Inventory', 'keyboard', 'TAB')

-- Function to open inventory
function OpenInventory()
    if isInventoryOpen then return end
    
    local player = PlayerPedId()
    if IsPedInAnyVehicle(player, false) then return end
    
    isInventoryOpen = true
    SetNuiFocus(true, true)
    
    -- Get player inventory data
    local playerInventory = GetPlayerInventory()
    local hotbarItems = GetHotbarItems()
    
    SendNUIMessage({
        type = 'openInventory',
        data = {
            playerInventory = playerInventory,
            hotbarItems = hotbarItems,
            containerInventory = {},
            containerInfo = null
        }
    })
end

-- Function to open container (trunk, stash, etc.)
function OpenContainer(containerType, containerData)
    if isInventoryOpen then return end
    
    local player = PlayerPedId()
    if IsPedInAnyVehicle(player, false) and containerType ~= 'trunk' and containerType ~= 'glovebox' then return end
    
    isInventoryOpen = true
    SetNuiFocus(true, true)
    
    -- Get player inventory data
    local playerInventory = GetPlayerInventory()
    local hotbarItems = GetHotbarItems()
    local containerInventory = GetContainerInventory(containerType, containerData)
    local containerInfo = GetContainerInfo(containerType, containerData)
    
    SendNUIMessage({
        type = 'openInventory',
        data = {
            playerInventory = playerInventory,
            hotbarItems = hotbarItems,
            containerInventory = containerInventory,
            containerInfo = containerInfo
        }
    })
end

-- Get player inventory data
function GetPlayerInventory()
    local items = {}
    local playerItems = QBCore.Functions.GetPlayerData().items
    
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

-- Get hotbar items
function GetHotbarItems()
    local items = {}
    local hotbarSlots = {1, 2, 3, 4, 5}
    
    for _, slot in ipairs(hotbarSlots) do
        local item = QBCore.Functions.GetPlayerData().items[slot]
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

-- Get container inventory
function GetContainerInventory(containerType, containerData)
    local items = {}
    
    if containerType == 'trunk' then
        -- Get trunk items from vehicle
        local vehicle = GetVehiclePedIsIn(PlayerPedId(), false)
        if vehicle and vehicle ~= 0 then
            local plate = GetVehicleNumberPlateText(vehicle)
            TriggerServerEvent('bInventory:server:getTrunkItems', plate)
            -- This would need to be handled via callback or event
        end
    elseif containerType == 'stash' then
        -- Get stash items
        TriggerServerEvent('bInventory:server:getStashItems', containerData.id)
    end
    
    return items
end

-- Get container info
function GetContainerInfo(containerType, containerData)
    local info = {
        type = containerType,
        label = "Container",
        maxWeight = 50.0,
        maxSlots = 42,
        currentWeight = 0.0,
        currentSlots = 0
    }
    
    if containerType == 'trunk' then
        info.label = "Vehicle Trunk"
        info.maxWeight = 50.0
    elseif containerType == 'glovebox' then
        info.label = "Glovebox"
        info.maxWeight = 5.0
        info.maxSlots = 10
    elseif containerType == 'stash' then
        info.label = "Personal Stash"
        info.maxWeight = 100.0
        info.maxSlots = 100
    end
    
    return info
end

-- Get item category
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

-- NUI Callbacks
RegisterNUICallback('closeInventory', function(data, cb)
    isInventoryOpen = false
    SetNuiFocus(false, false)
    cb('ok')
end)

RegisterNUICallback('useItem', function(data, cb)
    local item = data.item
    local amount = data.amount
    
    TriggerServerEvent('bInventory:server:useItem', item.id, amount)
    cb('ok')
end)

RegisterNUICallback('dropItem', function(data, cb)
    local item = data.item
    local amount = data.amount
    
    TriggerServerEvent('bInventory:server:dropItem', item.id, amount)
    cb('ok')
end)

RegisterNUICallback('transferItem', function(data, cb)
    local item = data.item
    local amount = data.amount
    
    TriggerServerEvent('bInventory:server:transferItem', item.id, amount, item.source)
    cb('ok')
end)

RegisterNUICallback('moveItem', function(data, cb)
    local item = data.item
    local newSlot = data.newSlot
    local newSource = data.newSource
    
    TriggerServerEvent('bInventory:server:moveItem', item.id, item.slot, item.source, newSlot, newSource)
    cb('ok')
end)

-- Server events for inventory updates
RegisterNetEvent('bInventory:client:updateInventory', function(playerInventory, containerInventory, hotbarItems)
    if isInventoryOpen then
        SendNUIMessage({
            type = 'updateInventory',
            data = {
                playerInventory = playerInventory,
                containerInventory = containerInventory,
                hotbarItems = hotbarItems
            }
        })
    end
end)

RegisterNetEvent('bInventory:client:updateSettings', function(settings)
    SendNUIMessage({
        type = 'updateSettings',
        data = settings
    })
end)

-- Close inventory on resource stop
AddEventHandler('onResourceStop', function(resourceName)
    if GetCurrentResourceName() == resourceName and isInventoryOpen then
        SetNuiFocus(false, false)
    end
end)

-- Export functions for other resources
exports('OpenInventory', OpenInventory)
exports('OpenContainer', OpenContainer)
