const { useState, useEffect, useRef } = React;
const { DndProvider, useDrag, useDrop } = ReactDnD;
const { HTML5Backend } = ReactDnDHTML5Backend;
const { Tooltip } = ReactTooltip;

// Main Inventory Component
function InventorySystem() {
    const [isOpen, setIsOpen] = useState(false);
    const [playerInventory, setPlayerInventory] = useState([]);
    const [containerInventory, setContainerInventory] = useState([]);
    const [containerInfo, setContainerInfo] = useState(null);
    const [hotbarItems, setHotbarItems] = useState([]);
    const [uiSettings, setUiSettings] = useState({
        colorTheme: 'blue',
        gridSize: 'medium',
        showWeight: true,
        showDurability: true,
        showIllegalMarker: true,
        showCategoryColors: true,
        darkMode: true,
        bgOpacity: '40',
        borderStyle: 'thin',
        uiStyle: 'default'
    });
    const [config, setConfig] = useState({});
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [actionAmount, setActionAmount] = useState(1);
    const [showSettings, setShowSettings] = useState(false);

    // Listen for messages from FiveM
    useEffect(() => {
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const handleMessage = (event) => {
        const { action, ...data } = event.data;

        switch (action) {
            case 'openInventory':
                setIsOpen(true);
                setPlayerInventory(data.playerInventory || []);
                setContainerInventory(data.containerInventory || []);
                setContainerInfo(data.containerInfo);
                setHotbarItems(data.hotbarItems || []);
                setUiSettings(data.uiSettings || {});
                setConfig(data.config || {});
                break;
            case 'closeInventory':
                setIsOpen(false);
                setSelectedItem(null);
                break;
            case 'updateInventory':
                setPlayerInventory(data.playerInventory || []);
                setContainerInventory(data.containerInventory || []);
                break;
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        fetch('https://bInventory/closeInventory', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
    };

    const handleItemClick = (item, source) => {
        if (selectedItem && selectedItem.id === item.id && selectedItem.source === source) {
            setSelectedItem(null);
        } else {
            setSelectedItem({ ...item, source });
            setActionAmount(1);
        }
    };

    const handleUseItem = () => {
        if (!selectedItem) return;
        
        fetch('https://bInventory/useItem', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                item: selectedItem.id,
                slot: selectedItem.slot,
                amount: actionAmount
            })
        });
        setSelectedItem(null);
    };

    const handleDropItem = () => {
        if (!selectedItem || selectedItem.source !== 'player') return;
        
        fetch('https://bInventory/dropItem', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                item: selectedItem.id,
                slot: selectedItem.slot,
                amount: actionAmount
            })
        });
        setSelectedItem(null);
    };

    const handleTransferItem = () => {
        if (!selectedItem) return;
        
        const fromSource = selectedItem.source;
        const toSource = fromSource === 'player' ? 'container' : 'player';
        
        fetch('https://bInventory/transferItem', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                item: selectedItem.id,
                fromSlot: selectedItem.slot,
                toSlot: 1, // Find empty slot
                fromSource,
                toSource,
                amount: actionAmount
            })
        });
        setSelectedItem(null);
    };

    const handleSaveSettings = () => {
        fetch('https://bInventory/saveSettings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ settings: uiSettings })
        });
        setShowSettings(false);
    };

    const handleSaveHotbar = (newHotbarItems) => {
        fetch('https://bInventory/saveHotbar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: newHotbarItems })
        });
    };

    const increaseAmount = () => {
        if (!selectedItem) return;
        setActionAmount(prev => Math.min(prev + 1, selectedItem.quantity || 1));
    };

    const decreaseAmount = () => {
        if (!selectedItem) return;
        setActionAmount(prev => Math.max(prev - 1, 1));
    };

    const getGridSizeClass = () => {
        switch (uiSettings.gridSize) {
            case 'small': return 'grid-cols-8';
            case 'large': return 'grid-cols-6';
            default: return 'grid-cols-7';
        }
    };

    const getCategoryColor = (category) => {
        const colors = {
            weapons: 'from-red-500/20 to-red-900/20 border-red-800/30',
            medical: 'from-green-500/20 to-green-900/20 border-green-800/30',
            consumables: 'from-amber-500/20 to-amber-900/20 border-amber-800/30',
            tools: 'from-blue-500/20 to-blue-900/20 border-blue-800/30',
            valuables: 'from-purple-500/20 to-purple-900/20 border-purple-800/30',
            clothing: 'from-cyan-500/20 to-cyan-900/20 border-cyan-800/30',
            ammo: 'from-orange-500/20 to-orange-900/20 border-orange-800/30',
            misc: 'from-gray-700/50 to-gray-900/50 border-gray-700/50'
        };
        return colors[category] || colors.misc;
    };

    const getDurabilityColor = (durability) => {
        if (durability > 75) return 'bg-emerald-500';
        if (durability > 40) return 'bg-amber-500';
        return 'bg-red-500';
    };

    const filteredPlayerItems = playerInventory.filter(item => {
        const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
        const matchesSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (!isOpen) return null;

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="inventory-container">
                <div className="inventory-content">
                    {/* Main Inventory Grids */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 flex-grow">
                        {/* Player Inventory */}
                        <InventoryPanel
                            title="Player Inventory"
                            items={filteredPlayerItems}
                            maxWeight={config.maxWeight || 30}
                            maxSlots={config.maxSlots || 42}
                            gridSize={getGridSizeClass()}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            activeCategory={activeCategory}
                            setActiveCategory={setActiveCategory}
                            categories={config.categories || []}
                            onItemClick={(item) => handleItemClick(item, 'player')}
                            uiSettings={uiSettings}
                            getCategoryColor={getCategoryColor}
                            getDurabilityColor={getDurabilityColor}
                            source="player"
                        />

                        {/* Container Inventory */}
                        {containerInfo && (
                            <InventoryPanel
                                title={containerInfo.label || "Container"}
                                items={containerInventory}
                                maxWeight={containerInfo.maxWeight || 50}
                                maxSlots={containerInfo.maxSlots || 42}
                                gridSize={getGridSizeClass()}
                                onItemClick={(item) => handleItemClick(item, 'container')}
                                uiSettings={uiSettings}
                                getCategoryColor={getCategoryColor}
                                getDurabilityColor={getDurabilityColor}
                                source="container"
                            />
                        )}
                    </div>

                    {/* Hotbar */}
                    <Hotbar
                        items={hotbarItems}
                        slots={config.hotbarSlots || 5}
                        onItemClick={(item) => handleItemClick(item, 'hotbar')}
                        uiSettings={uiSettings}
                        getCategoryColor={getCategoryColor}
                        getDurabilityColor={getDurabilityColor}
                        onSave={handleSaveHotbar}
                    />

                    {/* Action Modal */}
                    {selectedItem && (
                        <ActionModal
                            item={selectedItem}
                            actionAmount={actionAmount}
                            onIncrease={increaseAmount}
                            onDecrease={decreaseAmount}
                            onUse={handleUseItem}
                            onDrop={handleDropItem}
                            onTransfer={handleTransferItem}
                            onClose={() => setSelectedItem(null)}
                            uiSettings={uiSettings}
                            getDurabilityColor={getDurabilityColor}
                        />
                    )}

                    {/* Settings Button */}
                    <button
                        className="settings-btn"
                        onClick={() => setShowSettings(true)}
                    >
                        <i className="fas fa-cog"></i>
                    </button>

                    {/* Settings Modal */}
                    {showSettings && (
                        <SettingsModal
                            settings={uiSettings}
                            setSettings={setUiSettings}
                            onSave={handleSaveSettings}
                            onClose={() => setShowSettings(false)}
                            colorThemes={config.colorThemes || []}
                        />
                    )}
                </div>
            </div>
        </DndProvider>
    );
}

// Inventory Panel Component
function InventoryPanel({ title, items, maxWeight, maxSlots, gridSize, searchQuery, setSearchQuery, activeCategory, setActiveCategory, categories, onItemClick, uiSettings, getCategoryColor, getDurabilityColor, source }) {
    const currentWeight = items.reduce((total, item) => total + (item.weight * item.quantity), 0);
    const weightPercentage = (currentWeight / maxWeight) * 100;
    const slots = Array.from({ length: maxSlots }, (_, i) => i + 1);

    return (
        <div className="inventory-panel">
            <div className="inventory-header">
                <div className="inventory-title">
                    <span>{title}</span>
                    <div className="weight-bar">
                        <div className="weight-progress">
                            <div 
                                className={`weight-fill ${weightPercentage > 80 ? 'bg-red-500' : 'bg-blue-500'}`}
                                style={{ width: `${weightPercentage}%` }}
                            ></div>
                        </div>
                        <span className="weight-text">
                            {currentWeight.toFixed(1)}/{maxWeight.toFixed(1)} kg
                        </span>
                    </div>
                </div>
                
                {source === 'player' && (
                    <div className="controls">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="search-input"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <i className="fas fa-search search-icon"></i>
                        </div>
                        <select
                            className="category-select"
                            value={activeCategory}
                            onChange={(e) => setActiveCategory(e.target.value)}
                        >
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
            
            <div className={`inventory-grid ${gridSize}`}>
                {slots.map(slot => {
                    const item = items.find(item => item.slot === slot);
                    return (
                        <InventorySlot
                            key={`${source}-${slot}`}
                            slot={slot}
                            item={item}
                            onItemClick={onItemClick}
                            uiSettings={uiSettings}
                            getCategoryColor={getCategoryColor}
                            getDurabilityColor={getDurabilityColor}
                            source={source}
                        />
                    );
                })}
            </div>
        </div>
    );
}

// Inventory Slot Component
function InventorySlot({ slot, item, onItemClick, uiSettings, getCategoryColor, getDurabilityColor, source }) {
    const [{ isOver }, drop] = useDrop({
        accept: 'INVENTORY_ITEM',
        drop: (droppedItem) => {
            // Handle drop logic here
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });

    return (
        <div 
            ref={drop}
            className={`inventory-slot ${isOver ? 'drag-over' : ''}`}
            onClick={() => item && onItemClick(item)}
        >
            {item ? (
                <DraggableItem
                    item={item}
                    source={source}
                    uiSettings={uiSettings}
                    getCategoryColor={getCategoryColor}
                    getDurabilityColor={getDurabilityColor}
                />
            ) : (
                <span className="slot-number">{slot}</span>
            )}
        </div>
    );
}

// Draggable Item Component
function DraggableItem({ item, source, uiSettings, getCategoryColor, getDurabilityColor }) {
    const [{ isDragging }, drag] = useDrag({
        type: 'INVENTORY_ITEM',
        item: { ...item, source },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    const categoryColor = uiSettings.showCategoryColors ? getCategoryColor(item.category) : 'from-gray-700/50 to-gray-900/50 border-gray-700/50';

    return (
        <div
            ref={drag}
            className={`item ${isDragging ? 'dragging' : ''}`}
            style={{ background: `linear-gradient(135deg, ${categoryColor})` }}
            data-tooltip-id={`tooltip-${source}-${item.slot}`}
            data-tooltip-content={JSON.stringify(item)}
            onDragStart={(e) => {
                // Prevent the default drag behavior and create a custom drag image
                e.preventDefault();
                e.stopPropagation();
                
                // Create a clone of the entire item element
                const dragImage = e.currentTarget.cloneNode(true);
                dragImage.style.position = 'absolute';
                dragImage.style.top = '-1000px';
                dragImage.style.left = '-1000px';
                dragImage.style.opacity = '0.8';
                dragImage.style.transform = 'scale(1.2)';
                dragImage.style.zIndex = '9999';
                dragImage.style.pointerEvents = 'none';
                document.body.appendChild(dragImage);
                
                // Set the custom drag image
                e.dataTransfer.setDragImage(dragImage, 0, 0);
                
                // Remove the temporary element after a short delay
                setTimeout(() => {
                    if (document.body.contains(dragImage)) {
                        document.body.removeChild(dragImage);
                    }
                }, 100);
            }}
        >
            <img 
                src={item.image || 'https://via.placeholder.com/32x32?text=?'} 
                alt={item.name}
                className="item-image"
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
            />
            <div className="item-name">{item.name}</div>
            
            {item.quantity > 1 && (
                <div className="item-quantity">{item.quantity}</div>
            )}
            
            {uiSettings.showWeight && item.weight > 0 && (
                <div className="item-weight">{item.weight}kg</div>
            )}
            
            {item.illegal && uiSettings.showIllegalMarker && (
                <div className="item-illegal">⚠️</div>
            )}
            
            {uiSettings.showDurability && (
                <div className="item-durability">
                    <div 
                        className={`durability-fill ${getDurabilityColor(item.durability)}`}
                        style={{ width: `${item.durability}%` }}
                    ></div>
                </div>
            )}
        </div>
    );
}

// Hotbar Component
function Hotbar({ items, slots, onItemClick, uiSettings, getCategoryColor, getDurabilityColor, onSave }) {
    const hotbarSlots = Array.from({ length: slots }, (_, i) => i + 1);

    return (
        <div className="hotbar">
            {hotbarSlots.map(slot => {
                const item = items.find(item => item.slot === slot);
                return (
                    <div 
                        key={`hotbar-${slot}`}
                        className="hotbar-slot"
                        onClick={() => item && onItemClick(item)}
                    >
                        {item ? (
                            <DraggableItem
                                item={item}
                                source="hotbar"
                                uiSettings={uiSettings}
                                getCategoryColor={getCategoryColor}
                                getDurabilityColor={getDurabilityColor}
                            />
                        ) : (
                            <span className="slot-number">{slot}</span>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// Action Modal Component
function ActionModal({ item, actionAmount, onIncrease, onDecrease, onUse, onDrop, onTransfer, onClose, uiSettings, getDurabilityColor }) {
    const getCategoryColor = (category) => {
        const colors = {
            weapons: 'bg-red-500',
            medical: 'bg-green-500',
            consumables: 'bg-amber-500',
            tools: 'bg-blue-500',
            valuables: 'bg-purple-500',
            clothing: 'bg-cyan-500',
            ammo: 'bg-orange-500',
            misc: 'bg-gray-500'
        };
        return colors[category] || colors.misc;
    };

    return (
        <div className="action-modal">
            <div>
                <div className="modal-header">
                <div>
                    <h3 className="modal-title">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <div className={`w-2 h-2 rounded-full ${getCategoryColor(item.category)}`}></div>
                        <span className="text-xs text-gray-400 capitalize">{item.category}</span>
                    </div>
                </div>
                <button className="modal-close" onClick={onClose}>
                    <i className="fas fa-times"></i>
                </button>
            </div>

            <div className="item-preview">
                <img 
                    src={item.image || 'https://via.placeholder.com/64x64?text=?'} 
                    alt={item.name}
                    className="preview-image"
                />
            </div>

            <p className="item-description">{item.description}</p>

            <div className="item-stats">
                {uiSettings.showWeight && (
                    <div className="stat-item">
                        <span className="stat-label">Weight:</span>
                        <span className="stat-value">{item.weight}kg</span>
                    </div>
                )}
                {uiSettings.showDurability && (
                    <div className="stat-item">
                        <span className="stat-label">Durability:</span>
                        <div className="durability-bar">
                            <div className="durability-progress">
                                <div 
                                    className={`durability-fill ${getDurabilityColor(item.durability)}`}
                                    style={{ width: `${item.durability}%` }}
                                ></div>
                            </div>
                            <span className={`text-xs ${getDurabilityColor(item.durability).replace('bg-', 'text-')}`}>
                                {item.durability}%
                            </span>
                        </div>
                    </div>
                )}
                {item.illegal && uiSettings.showIllegalMarker && (
                    <div className="illegal-warning">
                        <span className="illegal-icon">⚠️</span>
                        <span className="illegal-text">Illegal Item</span>
                    </div>
                )}
            </div>

            {item.quantity > 1 && (
                <div className="amount-selector">
                    <span className="amount-label">Amount:</span>
                    <div className="amount-controls">
                        <button className="amount-btn" onClick={onDecrease}>
                            <i className="fas fa-minus"></i>
                        </button>
                        <div className="amount-display">{actionAmount}</div>
                        <button className="amount-btn" onClick={onIncrease}>
                            <i className="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
            )}

            <div className="action-buttons">
                <button className="action-btn success" onClick={onUse}>
                    Use
                </button>
                {item.source === 'player' ? (
                    <>
                        <button className="action-btn primary" onClick={onTransfer}>
                            Transfer
                        </button>
                        <button className="action-btn danger" onClick={onDrop}>
                            Drop
                        </button>
                    </>
                ) : (
                    <button className="action-btn primary" onClick={onTransfer}>
                        Take
                    </button>
                )}
            </div>
            </div>
        </div>
    );
}

// Settings Modal Component
function SettingsModal({ settings, setSettings, onSave, onClose, colorThemes }) {
    const [tempSettings, setTempSettings] = useState(settings);

    const handleSave = () => {
        setSettings(tempSettings);
        onSave();
    };

    return (
        <div className="settings-modal">
            <div className="settings-content">
                <div className="settings-header">
                    <h3 className="settings-title">Inventory Settings</h3>
                    <button className="settings-close" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                
                <div className="settings-body">
                    {/* Color Theme */}
                    <div className="settings-section">
                        <h4 className="settings-section-title">
                            <i className="fas fa-palette"></i>
                            Color Theme
                        </h4>
                        <div className="settings-grid">
                            {colorThemes.map(theme => (
                                <button
                                    key={theme.id}
                                    className={`settings-option ${tempSettings.colorTheme === theme.accent ? 'active' : ''}`}
                                    onClick={() => setTempSettings({ ...tempSettings, colorTheme: theme.accent })}
                                >
                                    {theme.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grid Size */}
                    <div className="settings-section">
                        <h4 className="settings-section-title">
                            <i className="fas fa-th"></i>
                            Grid Size
                        </h4>
                        <div className="settings-grid">
                            {['small', 'medium', 'large'].map(size => (
                                <button
                                    key={size}
                                    className={`settings-option ${tempSettings.gridSize === size ? 'active' : ''}`}
                                    onClick={() => setTempSettings({ ...tempSettings, gridSize: size })}
                                >
                                    {size.charAt(0).toUpperCase() + size.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Display Options */}
                    <div className="settings-section">
                        <h4 className="settings-section-title">
                            <i className="fas fa-eye"></i>
                            Display Options
                        </h4>
                        {[
                            { key: 'showWeight', label: 'Show Weight' },
                            { key: 'showDurability', label: 'Show Durability' },
                            { key: 'showIllegalMarker', label: 'Show Illegal Marker' },
                            { key: 'showCategoryColors', label: 'Show Category Colors' },
                            { key: 'darkMode', label: 'Dark Mode' }
                        ].map(option => (
                            <div key={option.key} className="settings-row">
                                <span className="settings-label">{option.label}</span>
                                <div 
                                    className={`settings-toggle ${tempSettings[option.key] ? 'active' : ''}`}
                                    onClick={() => setTempSettings({ 
                                        ...tempSettings, 
                                        [option.key]: !tempSettings[option.key] 
                                    })}
                                >
                                    <div className="toggle-slider"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="settings-footer">
                    <button className="settings-btn cancel" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="settings-btn save" onClick={handleSave}>
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}

// Tooltip Component
function ItemTooltip({ id, uiSettings }) {
    return (
        <Tooltip
            id={id}
            render={({ content }) => {
                if (!content) return null;
                const item = JSON.parse(content);

                const getCategoryColor = (category) => {
                    const colors = {
                        weapons: 'bg-red-500',
                        medical: 'bg-green-500',
                        consumables: 'bg-amber-500',
                        tools: 'bg-blue-500',
                        valuables: 'bg-purple-500',
                        clothing: 'bg-cyan-500',
                        ammo: 'bg-orange-500',
                        misc: 'bg-gray-500'
                    };
                    return colors[category] || colors.misc;
                };

                return (
                    <div className="bg-black/90 border border-gray-700 rounded-lg p-3 max-w-xs backdrop-blur-md shadow-xl text-white">
                        <div className="flex items-center gap-2 mb-2">
                            <div className={`w-2 h-2 rounded-full ${getCategoryColor(item.category)}`}></div>
                            <div className="text-lg font-bold">{item.name}</div>
                        </div>
                        <div className="text-sm text-gray-300 mb-3 border-l-2 border-gray-700 pl-2 italic">
                            {item.description}
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Category:</span>
                                <span className="text-white capitalize font-medium">{item.category}</span>
                            </div>
                            {uiSettings.showWeight && (
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Weight:</span>
                                    <span className="text-white font-medium">{item.weight} kg</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-gray-400">Quantity:</span>
                                <span className="text-white font-medium">{item.quantity}</span>
                            </div>
                            {uiSettings.showDurability && (
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Durability:</span>
                                    <span className="text-white font-medium">{item.durability}%</span>
                                </div>
                            )}
                            {item.illegal && uiSettings.showIllegalMarker && (
                                <div className="col-span-2 mt-1 bg-red-900/30 border border-red-800/50 rounded px-2 py-1 flex items-center gap-2">
                                    <span className="text-red-500">⚠️</span>
                                    <span className="text-red-400 font-medium">Illegal Item</span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            }}
        />
    );
}

// Render the app
ReactDOM.render(<InventorySystem />, document.getElementById('root'));
