# bInventory - Advanced FiveM Inventory System for QBCore

A modern, feature-rich inventory system for FiveM servers using QBCore framework. This system provides a beautiful, responsive UI with drag-and-drop functionality, customizable themes, and extensive configuration options.

## Features

### 🎨 Modern UI Design
- **Responsive Design**: Works perfectly on all screen sizes
- **Customizable Themes**: 6 different color themes (Blue, Green, Purple, Amber, Red, Cyan)
- **Dark Mode**: Built-in dark mode support
- **Smooth Animations**: Fluid transitions and hover effects
- **Glass Morphism**: Modern backdrop blur effects

### 📦 Inventory Management
- **Drag & Drop**: Intuitive item movement between slots
- **Weight System**: Realistic weight-based inventory limits
- **Durability System**: Item degradation and repair mechanics
- **Category Filtering**: Filter items by category (Weapons, Medical, Tools, etc.)
- **Search Functionality**: Quick item search with real-time filtering
- **Hotbar System**: Quick access to frequently used items

### 🔧 Advanced Features
- **Container Support**: Vehicle trunks, gloveboxes, stashes, and more
- **Illegal Item Marking**: Visual indicators for restricted items
- **Item Stacking**: Automatic stacking of identical items
- **Split/Combine**: Split item stacks and combine compatible items
- **Ground Items**: Pick up and drop items on the ground
- **Settings Persistence**: User preferences saved locally

### 🎮 Game Integration
- **QBCore Compatible**: Full integration with QBCore framework
- **Keybind Support**: Customizable keybindings
- **Animation Support**: Player animations during inventory actions
- **Sound Effects**: Audio feedback for actions
- **Notification System**: Integrated with QBCore notifications

## Installation

### Prerequisites
- FiveM Server
- QBCore Framework
- oxmysql (for database operations)

### Setup Instructions

1. **Download and Extract**
   ```bash
   # Place the resource in your server's resources folder
   resources/[bCore]/bInventory/
   ```

2. **Database Setup**
   ```sql
   -- The system uses QBCore's existing inventory system
   -- No additional database setup required
   ```

3. **Server Configuration**
   ```lua
   -- Add to your server.cfg
   ensure bInventory
   ```

4. **Dependencies**
   ```lua
   -- Make sure these resources are started before bInventory
   ensure qb-core
   ensure oxmysql
   ```

## Configuration

### Basic Settings (`config.lua`)

```lua
Config = {
    Debug = false,                    -- Enable debug mode
    MaxWeight = 30.0,                -- Maximum player weight
    MaxSlots = 42,                   -- Maximum inventory slots
    HotbarSlots = 5,                 -- Number of hotbar slots
    
    Keys = {
        OpenInventory = 'TAB',        -- Key to open inventory
        UseItem = 'E',               -- Key to use selected item
        DropItem = 'G',              -- Key to drop selected item
        SplitItem = 'F',             -- Key to split item stack
    }
}
```

### UI Settings

```lua
Config.UISettings = {
    colorTheme = "blue",             -- Default color theme
    gridSize = "medium",             -- Grid size (small/medium/large)
    showWeight = true,               -- Show item weights
    showDurability = true,           -- Show durability bars
    showIllegalMarker = true,        -- Show illegal item warnings
    showCategoryColors = true,       -- Color items by category
    darkMode = true,                 -- Enable dark mode
    bgOpacity = "40",                -- Background opacity
    borderStyle = "thin",            -- Border style
    uiStyle = "default"              -- UI style
}
```

### Container Configuration

```lua
Config.Containers = {
    ['trunk'] = {
        label = 'Vehicle Trunk',
        maxWeight = 50.0,
        maxSlots = 42,
        allowedItems = {},           -- Empty = all items allowed
        restrictedItems = {}         -- Items that cannot be stored
    },
    ['glovebox'] = {
        label = 'Glovebox',
        maxWeight = 5.0,
        maxSlots = 10,
        allowedItems = {},
        restrictedItems = {'weapon_', 'ammo_'}
    }
}
```

## Usage

### Opening the Inventory

```lua
-- Open player inventory
exports['bInventory']:OpenInventory()

-- Open container (trunk, glovebox, stash, etc.)
exports['bInventory']:OpenContainer('trunk', containerData)
```

### Keybindings

- **TAB**: Open/Close inventory
- **E**: Use selected item
- **G**: Drop selected item
- **F**: Split item stack
- **1-5**: Use hotbar items

### Item Actions

1. **Use Item**: Click on an item and press "Use" or press E
2. **Drop Item**: Select item and press "Drop" or press G
3. **Transfer Item**: Drag items between inventories or use "Transfer" button
4. **Split Stack**: Right-click on stacked items to split them
5. **Search Items**: Type in the search bar to filter items
6. **Filter by Category**: Use the category dropdown to filter items

### Container Interaction

```lua
-- Open vehicle trunk
RegisterNetEvent('binventory:client:openTrunk', function(vehicle)
    -- Automatically handles distance and lock checks
end)

-- Open glovebox
RegisterNetEvent('binventory:client:openGlovebox', function(vehicle)
    -- Only works when inside the vehicle
end)

-- Open stash
RegisterNetEvent('binventory:client:openStash', function(stashId, stashData)
    -- Custom stash with configurable limits
end)
```

## Customization

### Adding Custom Items

```lua
-- In config.lua
Config.ItemImages = {
    ['custom_item'] = 'https://example.com/image.png'
}

Config.DefaultItems = {
    ['custom_item'] = {
        label = 'Custom Item',
        weight = 0.5,
        type = 'item',
        image = 'custom_item.png',
        unique = false,
        useable = true,
        shouldClose = true,
        combinable = nil,
        description = 'A custom item description'
    }
}
```

### Custom Item Categories

```lua
Config.Categories = {
    { id = "all", name = "All Items" },
    { id = "weapons", name = "Weapons" },
    { id = "medical", name = "Medical" },
    { id = "custom", name = "Custom Category" }  -- Add your own
}
```

### Custom Themes

```lua
Config.ColorThemes = {
    {
        id = "custom",
        name = "Custom Theme",
        primary = "from-custom-600 to-custom-700",
        hover = "from-custom-500 to-custom-600",
        accent = "custom",
    }
}
```

## API Reference

### Client Exports

```lua
-- Open inventory
exports['bInventory']:OpenInventory()

-- Close inventory
exports['bInventory']:CloseInventory()

-- Open container
exports['bInventory']:OpenContainer(containerType, containerData)

-- Close container
exports['bInventory']:CloseContainer()

-- Get player inventory
local inventory = exports['bInventory']:GetPlayerInventory()

-- Get item weight
local weight = exports['bInventory']:GetItemWeight('item_name')

-- Get item category
local category = exports['bInventory']:GetItemCategory('item_name')

-- Check if item is illegal
local isIllegal = exports['bInventory']:IsItemIllegal('item_name')
```

### Server Exports

```lua
-- Get container data
local container = exports['bInventory']:GetContainer(containerId)

-- Check if item can be added to container
local canAdd, reason = exports['bInventory']:CanAddItemToContainer(containerId, itemName, amount)

-- Add item to container
exports['bInventory']:AddItemToContainer(containerId, itemName, amount, slot, info)

-- Remove item from container
exports['bInventory']:RemoveItemFromContainer(containerId, slot, amount)

-- Get item from container
local item = exports['bInventory']:GetItemFromContainer(containerId, slot)

-- Calculate container weight
local weight = exports['bInventory']:CalculateContainerWeight(items)

-- Calculate container slots used
local slots = exports['bInventory']:CalculateContainerSlots(items)
```

## Events

### Client Events

```lua
-- Item use events
RegisterNetEvent('binventory:client:usePhone', function()
    -- Handle phone usage
end)

RegisterNetEvent('binventory:client:useBandage', function()
    -- Handle bandage usage
end)

-- Container events
RegisterNetEvent('binventory:client:openTrunk', function(vehicle)
    -- Handle trunk opening
end)

RegisterNetEvent('binventory:client:openGlovebox', function(vehicle)
    -- Handle glovebox opening
end)
```

### Server Events

```lua
-- Item use event
RegisterNetEvent('binventory:server:itemUsed', function(src, itemName, amount, info)
    -- Handle item usage on server
end)

-- Container events
RegisterNetEvent('binventory:server:getTrunkItems', function(plate, trunkData)
    -- Handle trunk item retrieval
end)
```

## Troubleshooting

### Common Issues

1. **Inventory not opening**
   - Check if QBCore is properly loaded
   - Verify all dependencies are started
   - Check console for errors

2. **Items not showing**
   - Ensure items are properly configured in QBCore
   - Check item images are accessible
   - Verify item categories are defined

3. **Drag and drop not working**
   - Check if React DnD is properly loaded
   - Verify browser console for JavaScript errors
   - Ensure proper event handling

4. **Container issues**
   - Check container configuration
   - Verify distance checks
   - Ensure proper vehicle/player validation

### Debug Mode

Enable debug mode in `config.lua`:

```lua
Config.Debug = true
```

This will provide additional console output and debug commands:

```lua
-- Debug commands (only available when Config.Debug = true)
/testinventory    -- Test inventory opening
/testcontainer    -- Test container opening
```

## Support

### Getting Help

1. **Check the documentation** - This README contains most common solutions
2. **Review the configuration** - Ensure all settings are correct
3. **Check console logs** - Look for error messages
4. **Test in isolation** - Try with minimal other resources

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credits

- **bCore Development** - Main development team
- **QBCore Framework** - Base framework integration
- **React DnD** - Drag and drop functionality
- **Font Awesome** - Icons
- **Tailwind CSS** - Styling framework

## Changelog

### Version 1.0.0
- Initial release
- Full QBCore integration
- Modern UI with drag and drop
- Container system
- Hotbar functionality
- Customizable themes
- Weight and durability systems
- Search and filtering
- Settings persistence

---

**Note**: This inventory system is designed to work with QBCore framework. Make sure you have QBCore properly installed and configured before using this resource.
