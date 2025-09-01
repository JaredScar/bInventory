local QBCore = exports['qb-core']:GetCoreObject()

-- Vehicle trunk events
RegisterNetEvent('binventory:client:openTrunk', function(vehicle)
    local player = PlayerPedId()
    local playerCoords = GetEntityCoords(player)
    local vehicleCoords = GetEntityCoords(vehicle)
    
    if #(playerCoords - vehicleCoords) > 3.0 then
        QBCore.Functions.Notify(Lang:t('error.vehicle_too_far'), 'error')
        return
    end
    
    if GetVehicleDoorLockStatus(vehicle) == 2 then
        QBCore.Functions.Notify(Lang:t('error.vehicle_locked'), 'error')
        return
    end
    
    local trunkBone = GetEntityBoneIndexByName(vehicle, 'boot')
    if trunkBone == -1 then
        trunkBone = GetEntityBoneIndexByName(vehicle, 'bonnet')
    end
    
    if trunkBone == -1 then
        QBCore.Functions.Notify(Lang:t('error.invalid_container'), 'error')
        return
    end
    
    local trunkCoords = GetWorldPositionOfEntityBone(vehicle, trunkBone)
    local trunkData = {
        id = 'trunk_' .. GetVehicleNumberPlateText(vehicle),
        label = Lang:t('menu.trunk'),
        maxWeight = Config.Containers.trunk.maxWeight,
        maxSlots = Config.Containers.trunk.maxSlots,
        items = {},
        coords = trunkCoords,
        vehicle = vehicle
    }
    
    TriggerServerEvent('binventory:server:getTrunkItems', GetVehicleNumberPlateText(vehicle), trunkData)
end)

-- Vehicle glovebox events
RegisterNetEvent('binventory:client:openGlovebox', function(vehicle)
    local player = PlayerPedId()
    local playerCoords = GetEntityCoords(player)
    local vehicleCoords = GetEntityCoords(vehicle)
    
    if #(playerCoords - vehicleCoords) > 3.0 then
        QBCore.Functions.Notify(Lang:t('error.vehicle_too_far'), 'error')
        return
    end
    
    if GetVehicleDoorLockStatus(vehicle) == 2 then
        QBCore.Functions.Notify(Lang:t('error.vehicle_locked'), 'error')
        return
    end
    
    local gloveboxData = {
        id = 'glovebox_' .. GetVehicleNumberPlateText(vehicle),
        label = Lang:t('menu.glovebox'),
        maxWeight = Config.Containers.glovebox.maxWeight,
        maxSlots = Config.Containers.glovebox.maxSlots,
        items = {},
        vehicle = vehicle
    }
    
    TriggerServerEvent('binventory:server:getGloveboxItems', GetVehicleNumberPlateText(vehicle), gloveboxData)
end)

-- Stash events
RegisterNetEvent('binventory:client:openStash', function(stashId, stashData)
    local player = PlayerPedId()
    local playerCoords = GetEntityCoords(player)
    
    if stashData.coords and #(playerCoords - stashData.coords) > 3.0 then
        QBCore.Functions.Notify(Lang:t('error.container_too_far'), 'error')
        return
    end
    
    local containerData = {
        id = 'stash_' .. stashId,
        label = stashData.label or Lang:t('menu.stash'),
        maxWeight = stashData.maxWeight or Config.Containers.stash.maxWeight,
        maxSlots = stashData.maxSlots or Config.Containers.stash.maxSlots,
        items = {},
        coords = stashData.coords,
        owner = stashData.owner
    }
    
    TriggerServerEvent('binventory:server:getStashItems', stashId, containerData)
end)

-- Ground items events
RegisterNetEvent('binventory:client:pickupItem', function(itemName, coords)
    local player = PlayerPedId()
    local playerCoords = GetEntityCoords(player)
    
    if #(playerCoords - coords) > 2.0 then
        QBCore.Functions.Notify(Lang:t('error.container_too_far'), 'error')
        return
    end
    
    TriggerServerEvent('binventory:server:pickupItem', itemName, coords)
end)

-- Hotbar events
RegisterNetEvent('binventory:client:useHotbarItem', function(slot)
    local hotbarItems = json.decode(GetResourceKvpString('binventory_hotbar') or '[]')
    local item = hotbarItems[slot]
    
    if item then
        TriggerServerEvent('binventory:server:useItem', item.name, item.slot, 1)
    end
end)

-- Keybind events for hotbar
for i = 1, Config.HotbarSlots do
    RegisterCommand('usehotbar' .. i, function()
        TriggerEvent('binventory:client:useHotbarItem', i)
    end, false)
    
    RegisterKeyMapping('usehotbar' .. i, 'Use Hotbar Item ' .. i, 'keyboard', tostring(i))
end

-- Item use events
RegisterNetEvent('binventory:client:usePhone', function()
    TriggerEvent('qb-phone:client:openPhone')
end)

RegisterNetEvent('binventory:client:useBandage', function()
    local player = PlayerPedId()
    local health = GetEntityHealth(player)
    local maxHealth = GetEntityMaxHealth(player)
    
    if health < maxHealth then
        SetEntityHealth(player, math.min(health + 25, maxHealth))
        QBCore.Functions.Notify(Lang:t('success.item_used', {item = 'Bandage'}), 'success')
    else
        QBCore.Functions.Notify(Lang:t('error.cannot_use'), 'error')
    end
end)

RegisterNetEvent('binventory:client:useWater', function()
    local player = PlayerPedId()
    -- Add thirst logic here if you have a thirst system
    QBCore.Functions.Notify(Lang:t('success.item_used', {item = 'Water Bottle'}), 'success')
end)

RegisterNetEvent('binventory:client:useLockpick', function()
    local player = PlayerPedId()
    local playerCoords = GetEntityCoords(player)
    
    -- Find nearby vehicles
    local vehicles = GetGamePool('CVehicle')
    for _, vehicle in pairs(vehicles) do
        local vehicleCoords = GetEntityCoords(vehicle)
        if #(playerCoords - vehicleCoords) < 3.0 then
            local lockStatus = GetVehicleDoorLockStatus(vehicle)
            if lockStatus == 2 then
                SetVehicleDoorsLocked(vehicle, 1)
                QBCore.Functions.Notify(Lang:t('success.item_used', {item = 'Lockpick'}), 'success')
                return
            end
        end
    end
    
    QBCore.Functions.Notify(Lang:t('error.cannot_use'), 'error')
end)

-- Weapon events
RegisterNetEvent('binventory:client:equipWeapon', function(weaponName)
    local player = PlayerPedId()
    GiveWeaponToPed(player, GetHashKey(weaponName), 0, false, true)
    SetCurrentPedWeapon(player, GetHashKey(weaponName), true)
    QBCore.Functions.Notify(Lang:t('success.item_used', {item = weaponName}), 'success')
end)

RegisterNetEvent('binventory:client:unequipWeapon', function(weaponName)
    local player = PlayerPedId()
    RemoveWeaponFromPed(player, GetHashKey(weaponName))
    QBCore.Functions.Notify(Lang:t('success.item_dropped', {item = weaponName}), 'success')
end)

-- Clothing events
RegisterNetEvent('binventory:client:wearClothing', function(clothingName)
    local player = PlayerPedId()
    -- Add clothing logic here
    QBCore.Functions.Notify(Lang:t('success.item_used', {item = clothingName}), 'success')
end)

-- Container interaction events
RegisterNetEvent('binventory:client:interactWithContainer', function(containerType, containerId)
    local player = PlayerPedId()
    local playerCoords = GetEntityCoords(player)
    
    if containerType == 'trunk' then
        local vehicle = GetVehiclePedIsIn(player, false)
        if vehicle == 0 then
            -- Find nearby vehicle
            local vehicles = GetGamePool('CVehicle')
            for _, veh in pairs(vehicles) do
                local vehicleCoords = GetEntityCoords(veh)
                if #(playerCoords - vehicleCoords) < 3.0 then
                    vehicle = veh
                    break
                end
            end
        end
        
        if vehicle ~= 0 then
            TriggerEvent('binventory:client:openTrunk', vehicle)
        else
            QBCore.Functions.Notify(Lang:t('error.vehicle_too_far'), 'error')
        end
    elseif containerType == 'glovebox' then
        local vehicle = GetVehiclePedIsIn(player, false)
        if vehicle ~= 0 then
            TriggerEvent('binventory:client:openGlovebox', vehicle)
        else
            QBCore.Functions.Notify(Lang:t('error.vehicle_too_far'), 'error')
        end
    elseif containerType == 'stash' then
        TriggerEvent('binventory:client:openStash', containerId, {})
    end
end)

-- Animation events
RegisterNetEvent('binventory:client:playPickupAnimation', function()
    local player = PlayerPedId()
    TaskStartScenarioInPlace(player, "PROP_HUMAN_BUM_BIN", 0, true)
    Wait(2000)
    ClearPedTasks(player)
end)

RegisterNetEvent('binventory:client:playDropAnimation', function()
    local player = PlayerPedId()
    TaskStartScenarioInPlace(player, "PROP_HUMAN_BUM_BIN", 0, true)
    Wait(1000)
    ClearPedTasks(player)
end)

-- Sound events
RegisterNetEvent('binventory:client:playPickupSound', function()
    PlaySoundFrontend(-1, "PICK_UP", "HUD_FRONTEND_DEFAULT_SOUNDSET", 1)
end)

RegisterNetEvent('binventory:client:playDropSound', function()
    PlaySoundFrontend(-1, "DROP", "HUD_FRONTEND_DEFAULT_SOUNDSET", 1)
end)

RegisterNetEvent('binventory:client:playErrorSound', function()
    PlaySoundFrontend(-1, "ERROR", "HUD_FRONTEND_DEFAULT_SOUNDSET", 1)
end)

-- Notification events
RegisterNetEvent('binventory:client:showNotification', function(message, type)
    QBCore.Functions.Notify(message, type or 'primary')
end)

-- Debug events
if Config.Debug then
    RegisterNetEvent('binventory:client:debugInfo', function()
        local player = PlayerPedId()
        local playerCoords = GetEntityCoords(player)
        local playerHealth = GetEntityHealth(player)
        local playerArmor = GetPedArmour(player)
        
        print('Player Position:', playerCoords)
        print('Player Health:', playerHealth)
        print('Player Armor:', playerArmor)
        print('Inventory Open:', isInventoryOpen)
        print('Current Container:', currentContainer)
    end)
end
