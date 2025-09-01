local QBCore = exports['qb-core']:GetCoreObject()

-- Utility functions for the inventory system

-- Calculate total weight of items
function CalculateTotalWeight(items)
    local totalWeight = 0
    for _, item in pairs(items) do
        if item and item.weight and item.quantity then
            totalWeight = totalWeight + (item.weight * item.quantity)
        end
    end
    return totalWeight
end

-- Calculate total slots used
function CalculateSlotsUsed(items)
    local slotsUsed = 0
    for _, item in pairs(items) do
        if item and item.slot then
            slotsUsed = slotsUsed + 1
        end
    end
    return slotsUsed
end

-- Find empty slot in inventory
function FindEmptySlot(items, maxSlots)
    for i = 1, maxSlots do
        local slotOccupied = false
        for _, item in pairs(items) do
            if item and item.slot == i then
                slotOccupied = true
                break
            end
        end
        if not slotOccupied then
            return i
        end
    end
    return nil
end

-- Check if item can be added to inventory
function CanAddItem(items, itemName, quantity, maxWeight, maxSlots)
    local currentWeight = CalculateTotalWeight(items)
    local currentSlots = CalculateSlotsUsed(items)
    local itemWeight = GetItemWeight(itemName)
    local totalItemWeight = itemWeight * quantity
    
    -- Check weight limit
    if currentWeight + totalItemWeight > maxWeight then
        return false, "weight"
    end
    
    -- Check if item already exists in inventory (for stackable items)
    local existingItem = nil
    for _, item in pairs(items) do
        if item and item.id == itemName then
            existingItem = item
            break
        end
    end
    
    if existingItem then
        -- Item exists, check if we can add to existing stack
        return true, "stack"
    else
        -- New item, check slot availability
        if currentSlots >= maxSlots then
            return false, "slots"
        end
        return true, "new"
    end
end

-- Add item to inventory
function AddItemToInventory(items, itemName, quantity, slot, info)
    local itemData = {
        id = itemName,
        name = GetItemLabel(itemName),
        image = GetItemImage(itemName),
        quantity = quantity,
        weight = GetItemWeight(itemName),
        slot = slot,
        category = GetItemCategory(itemName),
        description = GetItemDescription(itemName),
        durability = info and info.quality or 100,
        illegal = IsItemIllegal(itemName),
        info = info
    }
    
    table.insert(items, itemData)
    return items
end

-- Remove item from inventory
function RemoveItemFromInventory(items, itemName, quantity, slot)
    for i, item in pairs(items) do
        if item and item.id == itemName and item.slot == slot then
            if item.quantity <= quantity then
                -- Remove entire item
                table.remove(items, i)
            else
                -- Reduce quantity
                item.quantity = item.quantity - quantity
            end
            break
        end
    end
    return items
end

-- Get item label
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

-- Get item image (already defined in main.lua, but keeping for reference)
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

-- Get item weight (already defined in main.lua, but keeping for reference)
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

-- Get item category (already defined in main.lua, but keeping for reference)
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

-- Get item description (already defined in main.lua, but keeping for reference)
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

-- Check if item is illegal (already defined in main.lua, but keeping for reference)
function IsItemIllegal(itemName)
    return Config.IllegalItems[itemName] or false
end

-- Sort items by category
function SortItemsByCategory(items, category)
    if category == 'all' then
        return items
    end
    
    local filteredItems = {}
    for _, item in pairs(items) do
        if item and item.category == category then
            table.insert(filteredItems, item)
        end
    end
    
    return filteredItems
end

-- Search items by name
function SearchItems(items, searchQuery)
    if not searchQuery or searchQuery == '' then
        return items
    end
    
    local filteredItems = {}
    local query = string.lower(searchQuery)
    
    for _, item in pairs(items) do
        if item and string.find(string.lower(item.name), query) then
            table.insert(filteredItems, item)
        end
    end
    
    return filteredItems
end

-- Sort items by various criteria
function SortItems(items, sortBy, sortOrder)
    local sortedItems = {}
    for _, item in pairs(items) do
        table.insert(sortedItems, item)
    end
    
    if sortBy == 'name' then
        table.sort(sortedItems, function(a, b)
            if sortOrder == 'asc' then
                return a.name < b.name
            else
                return a.name > b.name
            end
        end)
    elseif sortBy == 'weight' then
        table.sort(sortedItems, function(a, b)
            if sortOrder == 'asc' then
                return a.weight < b.weight
            else
                return a.weight > b.weight
            end
        end)
    elseif sortBy == 'quantity' then
        table.sort(sortedItems, function(a, b)
            if sortOrder == 'asc' then
                return a.quantity < b.quantity
            else
                return a.quantity > b.quantity
            end
        end)
    elseif sortBy == 'durability' then
        table.sort(sortedItems, function(a, b)
            if sortOrder == 'asc' then
                return a.durability < b.durability
            else
                return a.durability > b.durability
            end
        end)
    elseif sortBy == 'category' then
        table.sort(sortedItems, function(a, b)
            if sortOrder == 'asc' then
                return a.category < b.category
            else
                return a.category > b.category
            end
        end)
    end
    
    return sortedItems
end

-- Validate item data
function ValidateItemData(item)
    if not item or not item.id then
        return false, "Invalid item data"
    end
    
    if not item.name then
        item.name = GetItemLabel(item.id)
    end
    
    if not item.weight then
        item.weight = GetItemWeight(item.id)
    end
    
    if not item.category then
        item.category = GetItemCategory(item.id)
    end
    
    if not item.description then
        item.description = GetItemDescription(item.id)
    end
    
    if not item.durability then
        item.durability = 100
    end
    
    if item.illegal == nil then
        item.illegal = IsItemIllegal(item.id)
    end
    
    return true, item
end

-- Format weight for display
function FormatWeight(weight)
    if weight < 1 then
        return string.format("%.2f", weight) .. "kg"
    else
        return string.format("%.1f", weight) .. "kg"
    end
end

-- Format durability for display
function FormatDurability(durability)
    return string.format("%.0f", durability) .. "%"
end

-- Get category color
function GetCategoryColor(category)
    local colors = {
        weapons = "from-red-500/20 to-red-900/20 border-red-800/30",
        medical = "from-green-500/20 to-green-900/20 border-green-800/30",
        consumables = "from-amber-500/20 to-amber-900/20 border-amber-800/30",
        tools = "from-blue-500/20 to-blue-900/20 border-blue-800/30",
        valuables = "from-purple-500/20 to-purple-900/20 border-purple-800/30",
        clothing = "from-cyan-500/20 to-cyan-900/20 border-cyan-800/30",
        ammo = "from-orange-500/20 to-orange-900/20 border-orange-800/30",
        misc = "from-gray-700/50 to-gray-900/50 border-gray-700/50"
    }
    
    return colors[category] or colors.misc
end

-- Get durability color
function GetDurabilityColor(durability)
    if durability > 75 then
        return "text-emerald-400"
    elseif durability > 40 then
        return "text-amber-400"
    else
        return "text-red-400"
    end
end

-- Check if player is near container
function IsPlayerNearContainer(playerCoords, containerCoords, maxDistance)
    if not containerCoords then
        return false
    end
    
    local distance = #(playerCoords - containerCoords)
    return distance <= (maxDistance or 3.0)
end

-- Check if player is in vehicle
function IsPlayerInVehicle(player)
    return IsPedInAnyVehicle(player, false)
end

-- Check if vehicle is locked
function IsVehicleLocked(vehicle)
    return GetVehicleDoorLockStatus(vehicle) == 2
end

-- Get vehicle plate
function GetVehiclePlate(vehicle)
    return GetVehicleNumberPlateText(vehicle)
end

-- Play sound effect
function PlayInventorySound(soundType)
    if soundType == 'pickup' then
        PlaySoundFrontend(-1, "PICK_UP", "HUD_FRONTEND_DEFAULT_SOUNDSET", 1)
    elseif soundType == 'drop' then
        PlaySoundFrontend(-1, "DROP", "HUD_FRONTEND_DEFAULT_SOUNDSET", 1)
    elseif soundType == 'error' then
        PlaySoundFrontend(-1, "ERROR", "HUD_FRONTEND_DEFAULT_SOUNDSET", 1)
    elseif soundType == 'success' then
        PlaySoundFrontend(-1, "SELECT", "HUD_FRONTEND_DEFAULT_SOUNDSET", 1)
    end
end

-- Show notification
function ShowInventoryNotification(message, type)
    QBCore.Functions.Notify(message, type or 'primary')
end

-- Debug function
function DebugPrint(...)
    if Config.Debug then
        print('[bInventory Debug]', ...)
    end
end

-- Export functions
exports('CalculateTotalWeight', CalculateTotalWeight)
exports('CalculateSlotsUsed', CalculateSlotsUsed)
exports('FindEmptySlot', FindEmptySlot)
exports('CanAddItem', CanAddItem)
exports('AddItemToInventory', AddItemToInventory)
exports('RemoveItemFromInventory', RemoveItemFromInventory)
exports('GetItemLabel', GetItemLabel)
exports('SortItemsByCategory', SortItemsByCategory)
exports('SearchItems', SearchItems)
exports('SortItems', SortItems)
exports('ValidateItemData', ValidateItemData)
exports('FormatWeight', FormatWeight)
exports('FormatDurability', FormatDurability)
exports('GetCategoryColor', GetCategoryColor)
exports('GetDurabilityColor', GetDurabilityColor)
exports('IsPlayerNearContainer', IsPlayerNearContainer)
exports('IsPlayerInVehicle', IsPlayerInVehicle)
exports('IsVehicleLocked', IsVehicleLocked)
exports('GetVehiclePlate', GetVehiclePlate)
exports('PlayInventorySound', PlayInventorySound)
exports('ShowInventoryNotification', ShowInventoryNotification)
exports('DebugPrint', DebugPrint)
