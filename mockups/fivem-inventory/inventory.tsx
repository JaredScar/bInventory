"use client"

import { useState } from "react"
import { Search, Settings, X } from "lucide-react"

// Mock data for demonstration
const playerItems = [
  {
    id: 1,
    name: "Phone",
    image: "/placeholder.svg?height=64&width=64",
    quantity: 1,
    weight: 0.5,
    description: "A smartphone device",
    usable: true,
    category: "electronics",
  },
  {
    id: 2,
    name: "Bandage",
    image: "/placeholder.svg?height=64&width=64",
    quantity: 5,
    weight: 0.1,
    description: "Used to heal minor wounds",
    usable: true,
    category: "medical",
  },
  {
    id: 3,
    name: "Water Bottle",
    image: "/placeholder.svg?height=64&width=64",
    quantity: 3,
    weight: 0.5,
    description: "Refreshing water to quench thirst",
    usable: true,
    category: "food",
  },
]

const containerItems = [
  {
    id: 101,
    name: "Gold Bar",
    image: "/placeholder.svg?height=64&width=64",
    quantity: 2,
    weight: 1.0,
    description: "Valuable gold bar",
    usable: false,
    category: "valuables",
  },
]

const hotbarItems = [
  { id: 1, name: "Phone", image: "/placeholder.svg?height=64&width=64", quantity: 1, slot: 1 },
  { id: 2, name: "Bandage", image: "/placeholder.svg?height=64&width=64", quantity: 5, slot: 2 },
  null,
  null,
  null,
]

// Categories for filtering
const categories = ["all", "weapons", "medical", "food", "tools", "electronics", "valuables"]

export default function InventorySystem() {
  const [selectedItem, setSelectedItem] = useState(null)
  const [playerInventory] = useState(playerItems)
  const [containerInventory] = useState(containerItems)
  const [hotbar] = useState(hotbarItems)
  const [playerFilter, setPlayerFilter] = useState("all")
  const [containerFilter, setContainerFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Handle item selection
  const handleItemClick = (item, source) => {
    setSelectedItem({ ...item, source })
  }

  return (
    <div className="flex flex-col h-screen w-full bg-black/80 text-white font-sans">
      {/* Status Bar */}
      <div className="absolute top-4 right-4 flex gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs">
            <span>♥</span>
          </div>
          <span className="text-sm">95%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-xs">
            <span>🍔</span>
          </div>
          <span className="text-sm">85%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs">
            <span>💧</span>
          </div>
          <span className="text-sm">78%</span>
        </div>
      </div>

      {/* Main Inventory Container */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl w-full">
          {/* Player Inventory */}
          <div className="bg-gray-900/90 rounded-lg overflow-hidden border border-gray-700 backdrop-blur-md">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Player Inventory</h2>
                <div className="flex items-center mt-1">
                  <div className="h-2 w-32 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: "40%" }}></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-300">5.2/30.0 kg</span>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="bg-gray-800 border border-gray-700 rounded-md px-3 py-1 text-sm w-40 pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-2 top-1.5 h-4 w-4 text-gray-400" />
                </div>
                <select
                  className="bg-gray-800 border border-gray-700 rounded-md px-2 py-1 text-sm"
                  value={playerFilter}
                  onChange={(e) => setPlayerFilter(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2 p-4 h-[400px] overflow-y-auto">
              {playerInventory.map((item) => (
                <div
                  key={item.id}
                  className={`relative bg-gray-800 border ${
                    selectedItem?.id === item.id ? "border-blue-500" : "border-gray-700"
                  } rounded-md p-2 flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 transition-colors h-24`}
                  onClick={() => handleItemClick(item, "player")}
                >
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-12 h-12 object-contain" />
                  <div className="mt-1 text-xs text-center truncate w-full">{item.name}</div>
                  {item.quantity > 1 && (
                    <div className="absolute top-1 right-1 bg-blue-600 text-white text-xs px-1 rounded">
                      x{item.quantity}
                    </div>
                  )}
                  {item.weight > 0 && (
                    <span className="absolute bottom-1 right-1 text-[10px] text-gray-400">{item.weight}kg</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Container/Storage Inventory */}
          <div className="bg-gray-900/90 rounded-lg overflow-hidden border border-gray-700 backdrop-blur-md">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Storage</h2>
                <div className="flex items-center mt-1">
                  <div className="h-2 w-32 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: "20%" }}></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-300">2.5/50.0 kg</span>
                </div>
              </div>
              <select
                className="bg-gray-800 border border-gray-700 rounded-md px-2 py-1 text-sm"
                value={containerFilter}
                onChange={(e) => setContainerFilter(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-5 gap-2 p-4 h-[400px] overflow-y-auto">
              {containerInventory.map((item) => (
                <div
                  key={item.id}
                  className={`relative bg-gray-800 border ${
                    selectedItem?.id === item.id ? "border-blue-500" : "border-gray-700"
                  } rounded-md p-2 flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 transition-colors h-24`}
                  onClick={() => handleItemClick(item, "container")}
                >
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-12 h-12 object-contain" />
                  <div className="mt-1 text-xs text-center truncate w-full">{item.name}</div>
                  {item.quantity > 1 && (
                    <div className="absolute top-1 right-1 bg-blue-600 text-white text-xs px-1 rounded">
                      x{item.quantity}
                    </div>
                  )}
                  {item.weight > 0 && (
                    <span className="absolute bottom-1 right-1 text-[10px] text-gray-400">{item.weight}kg</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Panel - Shows when item is selected */}
      {selectedItem && (
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900/95 border border-gray-700 rounded-lg p-4 w-80 backdrop-blur-md">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold">{selectedItem.name}</h3>
            <button className="text-gray-400 hover:text-white" onClick={() => setSelectedItem(null)}>
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center justify-center mb-4">
            <img
              src={selectedItem.image || "/placeholder.svg"}
              alt={selectedItem.name}
              className="w-20 h-20 object-contain"
            />
          </div>

          <p className="text-sm text-gray-300 mb-4">{selectedItem.description}</p>

          <div className="flex items-center justify-between mb-4">
            <span className="text-sm">Quantity: {selectedItem.quantity}</span>
            <span className="text-sm">Weight: {selectedItem.weight}kg</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {selectedItem.usable && (
              <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">Use</button>
            )}

            {selectedItem.source === "player" ? (
              <>
                <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">Transfer</button>
                <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded">Drop</button>
              </>
            ) : (
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded col-span-2">Take</button>
            )}
          </div>
        </div>
      )}

      {/* Hotbar */}
      <div className="p-4 flex justify-center">
        <div className="flex gap-2">
          {hotbar.map((item, index) => (
            <div
              key={index}
              className="relative w-20 h-20 bg-gray-900/90 border border-gray-700 rounded-md flex items-center justify-center"
            >
              {item ? (
                <>
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-12 h-12 object-contain" />
                  {item.quantity > 1 && (
                    <div className="absolute top-1 right-1 bg-blue-600 text-white text-xs px-1 rounded">
                      x{item.quantity}
                    </div>
                  )}
                </>
              ) : (
                <span className="text-gray-600">Empty</span>
              )}
              <div className="absolute bottom-1 left-1 w-5 h-5 bg-gray-800 rounded-sm flex items-center justify-center text-xs border border-gray-700">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settings Button */}
      <button className="absolute bottom-4 left-4 bg-gray-900/80 border border-gray-700 p-2 rounded-md">
        <Settings className="h-4 w-4" />
      </button>
    </div>
  )
}
