"use client"

import { useState } from "react"

// Simple mock data
const playerItems = [
  { id: 1, name: "Phone", quantity: 1, weight: 0.5 },
  { id: 2, name: "Bandage", quantity: 5, weight: 0.1 },
  { id: 3, name: "Water Bottle", quantity: 3, weight: 0.5 },
]

const containerItems = [
  { id: 101, name: "Gold Bar", quantity: 2, weight: 1.0 },
  { id: 102, name: "First Aid Kit", quantity: 1, weight: 1.5 },
]

export default function InventoryPage() {
  const [selectedItem, setSelectedItem] = useState(null)

  // Handle item selection
  const handleItemClick = (item) => {
    setSelectedItem(item)
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">FiveM Inventory</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* Player Inventory */}
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <h2 className="text-xl font-bold mb-4">Player Inventory</h2>
          <div className="grid grid-cols-4 gap-2">
            {playerItems.map((item) => (
              <div
                key={item.id}
                className={`bg-gray-800 border ${selectedItem?.id === item.id ? "border-blue-500" : "border-gray-700"} rounded p-2 cursor-pointer`}
                onClick={() => handleItemClick(item)}
              >
                <div className="text-center mb-1">{item.name}</div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>x{item.quantity}</span>
                  <span>{item.weight}kg</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Container Inventory */}
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <h2 className="text-xl font-bold mb-4">Storage</h2>
          <div className="grid grid-cols-4 gap-2">
            {containerItems.map((item) => (
              <div
                key={item.id}
                className={`bg-gray-800 border ${selectedItem?.id === item.id ? "border-blue-500" : "border-gray-700"} rounded p-2 cursor-pointer`}
                onClick={() => handleItemClick(item)}
              >
                <div className="text-center mb-1">{item.name}</div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>x{item.quantity}</span>
                  <span>{item.weight}kg</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hotbar */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((slot) => (
            <div
              key={slot}
              className="w-16 h-16 bg-gray-900 border border-gray-800 rounded flex items-center justify-center"
            >
              <span className="text-gray-600">{slot}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Item Details */}
      {selectedItem && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 border border-gray-800 rounded-lg p-4 w-64">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">{selectedItem.name}</h3>
            <button className="text-gray-400 hover:text-white" onClick={() => setSelectedItem(null)}>
              ✕
            </button>
          </div>
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span>Quantity:</span>
              <span>{selectedItem.quantity}</span>
            </div>
            <div className="flex justify-between">
              <span>Weight:</span>
              <span>{selectedItem.weight} kg</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded">Use</button>
            <button className="bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded">Drop</button>
          </div>
        </div>
      )}
    </div>
  )
}
