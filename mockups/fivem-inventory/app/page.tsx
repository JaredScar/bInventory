"use client"

// @ts-nocheck - Mockup file with expected TypeScript errors
// Type definitions to fix lint issues
declare global {
  interface Window {
    React: any;
    ReactDOM: any;
  }
  
  namespace JSX {
    interface IntrinsicElements {
      div: any;
      span: any;
      img: any;
      button: any;
      input: any;
      select: any;
      option: any;
      p: any;
      h2: any;
      h3: any;
      h4: any;
      [elemName: string]: any;
    }
  }
}

// Mock React hooks and components
const useDrag = (config: any) => [{ isDragging: false }, () => {}] as const;
const useDrop = (config: any) => [{ isOver: false }, () => {}] as const;
const DndProvider = ({ children }: { children: any }) => children;
const Tooltip = ({ id, render, children }: { id?: string; render?: any; children?: any }) => children;

// Mock icons
const Search = () => null;
const Settings = () => null;
const X = () => null;
const ChevronDown = () => null;
const ChevronUp = () => null;
const Check = () => null;
const Palette = () => null;
const Grid = () => null;
const Eye = () => null;

// Type definitions for components
interface Item {
  id: string;
  name: string;
  description: string;
  weight: number;
  quantity: number;
  category: string;
  durability: number;
  illegal?: boolean;
  image?: string;
  slot: number;
  source?: string;
}

interface UiSettings {
  colorTheme: string;
  gridSize: string;
  showWeight: boolean;
  showDurability: boolean;
  showIllegalMarker: boolean;
  showCategoryColors: boolean;
  darkMode: boolean;
  bgOpacity: string;
  borderStyle: string;
  uiStyle: string;
}

interface DraggableItemProps {
  item: Item;
  source: string;
  onClick: (item: Item, source: string) => void;
  tooltipId: string;
  uiSettings: UiSettings;
}

interface DroppableSlotProps {
  slot: number;
  item: Item | null;
  source: string;
  onItemClick: (item: Item, source: string) => void;
  onDrop: (item: Item, slot: number, source: string) => void;
  tooltipId: string;
  uiSettings: UiSettings;
}

interface ItemTooltipProps {
  id: string;
  uiSettings: UiSettings;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  uiSettings: UiSettings;
  setUiSettings: (settings: UiSettings) => void;
}

// JSX namespace declaration
declare namespace JSX {
  interface IntrinsicElements {
    div: any;
    span: any;
    img: any;
    button: any;
    input: any;
    select: any;
    option: any;
    p: any;
    h2: any;
    h3: any;
    h4: any;
    [elemName: string]: any;
  }
}

// Mock modules for development
const React = { useState, useEffect } as any;
const ReactDOM = { render: () => {} } as any;

import { useState, useEffect } from "react"
import { Search, Settings, X, ChevronDown, ChevronUp, Check, Palette, Grid, Eye } from "lucide-react"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Tooltip } from "react-tooltip"

// Item categories
const categories = [
  { id: "all", name: "All Items" },
  { id: "weapons", name: "Weapons" },
  { id: "consumables", name: "Consumables" },
  { id: "tools", name: "Tools" },
  { id: "valuables", name: "Valuables" },
  { id: "clothing", name: "Clothing" },
  { id: "medical", name: "Medical" },
]

// Color themes
const colorThemes = [
  {
    id: "blue",
    name: "Blue",
    primary: "from-blue-600 to-blue-700",
    hover: "from-blue-500 to-blue-600",
    accent: "blue",
  },
  {
    id: "green",
    name: "Green",
    primary: "from-green-600 to-green-700",
    hover: "from-green-500 to-green-600",
    accent: "green",
  },
  {
    id: "purple",
    name: "Purple",
    primary: "from-purple-600 to-purple-700",
    hover: "from-purple-500 to-purple-600",
    accent: "purple",
  },
  {
    id: "amber",
    name: "Amber",
    primary: "from-amber-600 to-amber-700",
    hover: "from-amber-500 to-amber-600",
    accent: "amber",
  },
  { id: "red", name: "Red", primary: "from-red-600 to-red-700", hover: "from-red-500 to-red-600", accent: "red" },
  {
    id: "cyan",
    name: "Cyan",
    primary: "from-cyan-600 to-cyan-700",
    hover: "from-cyan-500 to-cyan-600",
    accent: "cyan",
  },
]

// Mock data for demonstration with better images and categories
const playerItems = [
  {
    id: 1,
    name: "Smartphone",
    image: "https://i.gyazo.com/855fff443d61d880045f5ee7e1440db5.png", // Will be updated later
    quantity: 1,
    weight: 0.5,
    slot: 8,
    category: "tools",
    description: "A modern smartphone with various apps installed.",
    durability: 100,
    illegal: false,
  },
  {
    id: 2,
    name: "Bandage",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bandage_item-DR8T0b1A0Ne540OgkUkyR19VQfDEGO.png",
    quantity: 5,
    weight: 0.1,
    slot: 15,
    category: "medical",
    description: "Used to stop bleeding and heal minor wounds.",
    durability: 100,
    illegal: false,
  },
  {
    id: 3,
    name: "Water Bottle",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/water_bottle_item-uaB2JNkjnSVE4MeAgQaOtpjPe63CIf.png",
    quantity: 3,
    weight: 0.5,
    slot: 22,
    category: "consumables",
    description: "Refreshing water to quench your thirst.",
    durability: 100,
    illegal: false,
  },
  {
    id: 4,
    name: "Pistol",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pistol_item-vZQ8XUwCXvng8VXAoS9rriWLwu6PD6.png",
    quantity: 1,
    weight: 2.0,
    slot: 1,
    category: "weapons",
    description: "Standard 9mm pistol. Effective at short range.",
    durability: 92,
    illegal: true,
  },
  {
    id: 5,
    name: "Ammo 9mm",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ammo_9mm_item-IprXpqXX2f1sEhda3XzJkfCp0OGJyU.png",
    quantity: 50,
    weight: 0.01,
    slot: 2,
    category: "weapons",
    description: "Standard ammunition for 9mm weapons.",
    durability: 100,
    illegal: true,
  },
  {
    id: 6,
    name: "Lockpick",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lockpick_item-iequCFnWiV7ywTeuntIKskrf7c4n16.png",
    quantity: 2,
    weight: 0.3,
    slot: 9,
    category: "tools",
    description: "Used to break into locked vehicles and doors.",
    durability: 75,
    illegal: true,
  },
  {
    id: 7,
    name: "Cash",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cash_icon-aoFhwPnNQDJMrU98zNt2BAQH65Pv7x.png",
    quantity: 1250,
    weight: 0.0,
    slot: 16,
    category: "valuables",
    description: "Cash money. Used for transactions.",
    durability: 100,
    illegal: false,
  },
  {
    id: 8,
    name: "T-Shirt",
    image: "https://cdn3.iconfinder.com/data/icons/clothing-set-4/64/tshirt-other-512.png", // Keep original for now
    quantity: 1,
    weight: 0.3,
    slot: 23,
    category: "clothing",
    description: "A casual t-shirt. Provides minimal protection.",
    durability: 90,
    illegal: false,
  },
  {
    id: 9,
    name: "First Aid Kit",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/first_aid_kit_item-gPSbMKf9THF0qEPwVh31v0iXjlSVPm.png",
    quantity: 1,
    weight: 1.0,
    slot: 29,
    category: "medical",
    description: "Complete medical kit for treating various injuries.",
    durability: 100,
    illegal: false,
  },
]

const containerItems = [
  {
    id: 101,
    name: "Gold Bar",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/goldbar_inventory_item-qL2NbeJ3FRnxDm2Mg0YVmzaEAqYkuv.png",
    quantity: 2,
    weight: 1.0,
    slot: 1,
    category: "valuables",
    description: "Pure gold bar. Highly valuable.",
    durability: 100,
    illegal: false,
  },
  {
    id: 102,
    name: "First Aid Kit",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/first_aid_kit_item-gPSbMKf9THF0qEPwVh31v0iXjlSVPm.png",
    quantity: 1,
    weight: 1.5,
    slot: 8,
    category: "medical",
    description: "Complete medical kit for treating various injuries.",
    durability: 100,
    illegal: false,
  },
  {
    id: 103,
    name: "Assault Rifle",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/assault_rifle_item-iiLdD3fMRUiCHk6DnuPseNCGnOVToX.png",
    quantity: 1,
    weight: 3.5,
    slot: 15,
    category: "weapons",
    description: "High-powered assault rifle. Effective at medium to long range.",
    durability: 85,
    illegal: true,
  },
  {
    id: 104,
    name: "Burger",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/burger_item-jRAminnmsZZHX6v7QLr7vy9vcnrLv0.png",
    quantity: 2,
    weight: 0.3,
    slot: 22,
    category: "consumables",
    description: "Delicious burger. Restores hunger.",
    durability: 100,
    illegal: false,
  },
]

// Initialize hotbar with actual items (no null values)
const initialHotbarItems = [
  {
    id: 4,
    name: "Pistol",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pistol_item-vZQ8XUwCXvng8VXAoS9rriWLwu6PD6.png",
    quantity: 1,
    slot: 1,
    category: "weapons",
    description: "Standard 9mm pistol. Effective at short range.",
    durability: 92,
    weight: 2.0,
    illegal: true,
  },
  {
    id: 6,
    name: "Lockpick",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lockpick_item-iequCFnWiV7ywTeuntIKskrf7c4n16.png",
    quantity: 2,
    slot: 2,
    category: "tools",
    description: "Used to break into locked vehicles and doors.",
    durability: 75,
    weight: 0.3,
    illegal: true,
  },
  {
    id: 3,
    name: "Water Bottle",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/water_bottle_item-uaB2JNkjnSVE4MeAgQaOtpjPe63CIf.png",
    quantity: 3,
    slot: 3,
    category: "consumables",
    description: "Refreshing water to quench your thirst.",
    durability: 100,
    weight: 0.5,
    illegal: false,
  },
]

// Draggable Item Component
const DraggableItem = ({ item, source, onClick, tooltipId, uiSettings }: DraggableItemProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "INVENTORY_ITEM",
    item: { ...item, source },
    collect: (monitor: any) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  // Get category color
  const getCategoryColor = (category: any) => {
    switch (category) {
      case "weapons":
        return "from-red-500/20 to-red-900/20 border-red-800/30"
      case "medical":
        return "from-green-500/20 to-green-900/20 border-green-800/30"
      case "consumables":
        return "from-amber-500/20 to-amber-900/20 border-amber-800/30"
      case "tools":
        return "from-blue-500/20 to-blue-900/20 border-blue-800/30"
      case "valuables":
        return "from-purple-500/20 to-purple-900/20 border-purple-800/30"
      case "clothing":
        return "from-cyan-500/20 to-cyan-900/20 border-cyan-800/30"
      default:
        return "from-gray-700/50 to-gray-900/50 border-gray-700/50"
    }
  }

  return (
    <div
      ref={drag}
      className={`w-[85%] h-[85%] mx-auto my-auto bg-gradient-to-br ${
        uiSettings.showCategoryColors
          ? getCategoryColor(item.category)
          : "from-gray-700/50 to-gray-900/50 border-gray-700/50"
      } backdrop-blur-sm border rounded-md flex flex-col items-center justify-center relative cursor-pointer hover:border-gray-500 transition-all ${
        isDragging ? "opacity-50 scale-95" : "opacity-100"
      } shadow-lg`}
      onClick={onClick}
      data-tooltip-id={tooltipId}
      data-tooltip-content={JSON.stringify({
        name: item.name,
        description: item.description,
        weight: item.weight,
        quantity: item.quantity,
        category: item.category,
        durability: item.durability,
        illegal: item.illegal,
      })}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="absolute inset-0 bg-black/20 rounded-md"></div>
      <img
        src={item.image || "/placeholder.svg"}
        alt={item.name}
        className="w-8 h-8 object-contain relative z-10 drop-shadow-md"
      />
      <div className="mt-1 text-[10px] text-center truncate w-full px-1 font-medium text-white/90 relative z-10 drop-shadow-md">
        {item.name}
      </div>
      {item.quantity > 1 && (
        <div className="absolute top-0.5 right-0.5 bg-black/60 text-white text-[8px] px-1 py-0.5 rounded-full font-medium z-20 backdrop-blur-sm border border-white/10">
          {item.quantity}
        </div>
      )}
      {uiSettings.showWeight && item.weight > 0 && (
        <span className="absolute bottom-0.5 right-0.5 text-[8px] text-white/70 font-medium z-10">{item.weight}kg</span>
      )}
      {item.illegal && uiSettings.showIllegalMarker && (
        <span className="absolute top-0.5 left-0.5 bg-red-500/80 text-white text-[8px] p-0.5 rounded-full z-20">⚠️</span>
      )}
      {uiSettings.showDurability && (
        <div className="absolute bottom-0.5 left-0.5 w-full max-w-[70%] h-1 bg-black/40 rounded-full overflow-hidden z-10">
          <div
            className={`h-full ${
              item.durability > 75 ? "bg-emerald-500" : item.durability > 40 ? "bg-amber-500" : "bg-red-500"
            }`}
            style={{ width: `${item.durability}%` }}
          ></div>
        </div>
      )}
    </div>
  )
}

// Droppable Slot Component
const DroppableSlot = ({ slot, item, source, onItemClick, onDrop, tooltipId, uiSettings }: DroppableSlotProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "INVENTORY_ITEM",
    drop: (droppedItem: any) => onDrop(droppedItem, slot, source),
    collect: (monitor: any) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  return (
    <div
      ref={drop}
      className={`aspect-square bg-black/30 backdrop-blur-sm border ${
        isOver
          ? `border-${uiSettings.colorTheme}-400 shadow-md shadow-${uiSettings.colorTheme}-500/20`
          : "border-gray-800/50"
      } rounded-md flex flex-col items-center justify-center relative cursor-pointer hover:border-gray-600/70 transition-all ${
        isOver ? "scale-105" : ""
      }`}
    >
      {item ? (
        <DraggableItem
          item={item}
          source={source}
          onClick={() => onItemClick(item, source)}
          tooltipId={tooltipId}
          uiSettings={uiSettings}
        />
      ) : (
        <span className="text-gray-500/50 text-[10px] font-medium">{slot}</span>
      )}
    </div>
  )
}

// Custom Tooltip Component
const ItemTooltip = ({ id, uiSettings }: ItemTooltipProps) => {
  return (
    <Tooltip
      id={id}
              render={({ content }: { content: any }) => {
        if (!content) return null
        const item = JSON.parse(content)

        // Get category color
        const getCategoryColor = (category: any) => {
          switch (category) {
            case "weapons":
              return "bg-red-500"
            case "medical":
              return "bg-green-500"
            case "consumables":
              return "bg-amber-500"
            case "tools":
              return "bg-blue-500"
            case "valuables":
              return "bg-purple-500"
            case "clothing":
              return "bg-cyan-500"
            default:
              return "bg-gray-500"
          }
        }

        return (
          <div
            className={`bg-black/90 border border-gray-700 rounded-lg p-3 max-w-xs backdrop-blur-md shadow-xl ${
              uiSettings.darkMode ? "text-white" : "text-gray-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${getCategoryColor(item.category)}`}></div>
              <div className="text-lg font-bold text-white">{item.name}</div>
            </div>
            <div className="text-sm text-gray-300 mb-3 border-l-2 border-gray-700 pl-2 italic">{item.description}</div>
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
                  <span
                    className={`font-medium ${
                      item.durability > 75
                        ? "text-emerald-400"
                        : item.durability > 40
                          ? "text-amber-400"
                          : "text-red-400"
                    }`}
                  >
                    {item.durability}%
                  </span>
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
        )
      }}
    />
  )
}

// Update the settings modal to have a sticky header and styled progress bars
// Also further reduce the inventory height to prevent scrollbars

// 1. Update the SettingsModal component with sticky header and styled progress bars
const SettingsModal = ({ isOpen, onClose, uiSettings, setUiSettings }: SettingsModalProps) => {
  const [tempSettings, setTempSettings] = useState(uiSettings)

  const handleSave = () => {
    setUiSettings(tempSettings)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900/90 border border-gray-800 rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 flex justify-between items-center p-4 bg-gray-900/95 border-b border-gray-800 backdrop-blur-md">
          <h2 className="text-lg font-bold text-white">Inventory Settings</h2>
          <button
            className="text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700/70 rounded-full p-1 transition-colors"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content with Custom Scrollbar */}
        <div
          className="overflow-y-auto p-4 space-y-4 settings-scrollbar"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#4B5563 #1F2937",
          }}
        >
          {/* Color Theme */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <Palette className="h-4 w-4" /> Color Theme
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {colorThemes.map((theme) => (
                <button
                  key={theme.id}
                  className={`p-2 rounded-md flex items-center justify-center gap-2 bg-gradient-to-r ${theme.primary} hover:${theme.hover} transition-colors`}
                  onClick={() => setTempSettings({ ...tempSettings, colorTheme: theme.accent })}
                >
                  {tempSettings.colorTheme === theme.accent && <Check className="h-4 w-4" />}
                  <span>{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* UI Colors */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <Palette className="h-4 w-4" /> UI Colors
            </h3>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-1.5 bg-gray-800 rounded-md">
                <span className="text-gray-300">Background Opacity</span>
                <select
                  className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
                  value={tempSettings.bgOpacity || "40"}
                  onChange={(e) => setTempSettings({ ...tempSettings, bgOpacity: e.target.value })}
                >
                  <option value="0">Transparent</option>
                  <option value="20">Very Light (20%)</option>
                  <option value="40">Light (40%)</option>
                  <option value="60">Medium (60%)</option>
                  <option value="80">Dark (80%)</option>
                  <option value="95">Very Dark (95%)</option>
                </select>
              </label>

              <label className="flex items-center justify-between p-1.5 bg-gray-800 rounded-md">
                <span className="text-gray-300">Border Style</span>
                <select
                  className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
                  value={tempSettings.borderStyle || "thin"}
                  onChange={(e) => setTempSettings({ ...tempSettings, borderStyle: e.target.value })}
                >
                  <option value="none">No Border</option>
                  <option value="thin">Thin Border</option>
                  <option value="medium">Medium Border</option>
                  <option value="thick">Thick Border</option>
                  <option value="glow">Glowing Border</option>
                </select>
              </label>

              <label className="flex items-center justify-between p-1.5 bg-gray-800 rounded-md">
                <span className="text-gray-300">UI Style</span>
                <select
                  className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
                  value={tempSettings.uiStyle || "default"}
                  onChange={(e) => setTempSettings({ ...tempSettings, uiStyle: e.target.value })}
                >
                  <option value="default">Default</option>
                  <option value="minimal">Minimal</option>
                  <option value="glass">Glass</option>
                  <option value="solid">Solid</option>
                  <option value="neon">Neon</option>
                </select>
              </label>
            </div>
          </div>

          {/* Grid Size */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <Grid className="h-4 w-4" /> Grid Size
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                className={`p-2 rounded-md flex items-center justify-center ${
                  tempSettings.gridSize === "small"
                    ? `bg-${tempSettings.colorTheme}-600 text-white`
                    : "bg-gray-800 text-gray-300"
                }`}
                onClick={() => setTempSettings({ ...tempSettings, gridSize: "small" })}
              >
                Small
              </button>
              <button
                className={`p-2 rounded-md flex items-center justify-center ${
                  tempSettings.gridSize === "medium"
                    ? `bg-${tempSettings.colorTheme}-600 text-white`
                    : "bg-gray-800 text-gray-300"
                }`}
                onClick={() => setTempSettings({ ...tempSettings, gridSize: "medium" })}
              >
                Medium
              </button>
              <button
                className={`p-2 rounded-md flex items-center justify-center ${
                  tempSettings.gridSize === "large"
                    ? `bg-${tempSettings.colorTheme}-600 text-white`
                    : "bg-gray-800 text-gray-300"
                }`}
                onClick={() => setTempSettings({ ...tempSettings, gridSize: "large" })}
              >
                Large
              </button>
            </div>
          </div>

          {/* Display Options */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <Eye className="h-4 w-4" /> Display Options
            </h3>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-1.5 bg-gray-800 rounded-md">
                <span className="text-gray-300">Show Weight</span>
                <div
                  className={`w-10 h-5 rounded-full p-0.5 cursor-pointer transition-colors ${
                    tempSettings.showWeight ? `bg-${tempSettings.colorTheme}-600` : "bg-gray-700"
                  }`}
                  onClick={() => setTempSettings({ ...tempSettings, showWeight: !tempSettings.showWeight })}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      tempSettings.showWeight ? "transform translate-x-5" : ""
                    }`}
                  ></div>
                </div>
              </label>

              <label className="flex items-center justify-between p-1.5 bg-gray-800 rounded-md">
                <span className="text-gray-300">Show Durability</span>
                <div
                  className={`w-10 h-5 rounded-full p-0.5 cursor-pointer transition-colors ${
                    tempSettings.showDurability ? `bg-${tempSettings.colorTheme}-600` : "bg-gray-700"
                  }`}
                  onClick={() => setTempSettings({ ...tempSettings, showDurability: !tempSettings.showDurability })}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      tempSettings.showDurability ? "transform translate-x-5" : ""
                    }`}
                  ></div>
                </div>
              </label>

              <label className="flex items-center justify-between p-1.5 bg-gray-800 rounded-md">
                <span className="text-gray-300">Show Illegal Marker</span>
                <div
                  className={`w-10 h-5 rounded-full p-0.5 cursor-pointer transition-colors ${
                    tempSettings.showIllegalMarker ? `bg-${tempSettings.colorTheme}-600` : "bg-gray-700"
                  }`}
                  onClick={() =>
                    setTempSettings({ ...tempSettings, showIllegalMarker: !tempSettings.showIllegalMarker })
                  }
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      tempSettings.showIllegalMarker ? "transform translate-x-5" : ""
                    }`}
                  ></div>
                </div>
              </label>

              <label className="flex items-center justify-between p-1.5 bg-gray-800 rounded-md">
                <span className="text-gray-300">Show Category Colors</span>
                <div
                  className={`w-10 h-5 rounded-full p-0.5 cursor-pointer transition-colors ${
                    tempSettings.showCategoryColors ? `bg-${tempSettings.colorTheme}-600` : "bg-gray-700"
                  }`}
                  onClick={() =>
                    setTempSettings({ ...tempSettings, showCategoryColors: !tempSettings.showCategoryColors })
                  }
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      tempSettings.showCategoryColors ? "transform translate-x-5" : ""
                    }`}
                  ></div>
                </div>
              </label>

              <label className="flex items-center justify-between p-1.5 bg-gray-800 rounded-md">
                <span className="text-gray-300">Dark Mode</span>
                <div
                  className={`w-10 h-5 rounded-full p-0.5 cursor-pointer transition-colors ${
                    tempSettings.darkMode ? `bg-${tempSettings.colorTheme}-600` : "bg-gray-700"
                  }`}
                  onClick={() => setTempSettings({ ...tempSettings, darkMode: !tempSettings.darkMode })}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      tempSettings.darkMode ? "transform translate-x-5" : ""
                    }`}
                  ></div>
                </div>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 rounded-md transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className={`flex-1 bg-gradient-to-r from-${tempSettings.colorTheme}-600 to-${tempSettings.colorTheme}-700 hover:from-${tempSettings.colorTheme}-500 hover:to-${tempSettings.colorTheme}-600 text-white py-2 rounded-md transition-colors`}
              onClick={handleSave}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [selectedItem, setSelectedItem] = useState(null)
  const [playerWeight, setPlayerWeight] = useState({ current: 5.2, max: 30.0 })
  const [containerWeight, setContainerWeight] = useState({ current: 2.5, max: 50.0 })
  const [searchQuery, setSearchQuery] = useState("")
  const [actionAmount, setActionAmount] = useState(1)
  const [playerInventory, setPlayerInventory] = useState(playerItems)
  const [containerInventory, setContainerInventory] = useState(containerItems)
  const [activeCategory, setActiveCategory] = useState("all")
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [uiSettings, setUiSettings] = useState({
    colorTheme: "blue",
    gridSize: "medium",
    showWeight: true,
    showDurability: true,
    showIllegalMarker: true,
    showCategoryColors: true,
    darkMode: true,
    bgOpacity: "40",
    borderStyle: "thin",
    uiStyle: "default",
  })
  const [hotbarInventory, setHotbarInventory] = useState(initialHotbarItems)

  // Calculate weight percentages
  const playerWeightPercentage = (playerWeight.current / playerWeight.max) * 100
  const containerWeightPercentage = (containerWeight.current / containerWeight.max) * 100

  // Handle item selection
  const handleItemClick = (item, source) => {
    if (selectedItem && selectedItem.id === item.id && selectedItem.source === source) {
      setSelectedItem(null)
    } else {
      setSelectedItem({ ...item, source })
      setActionAmount(1)
    }
  }

  // Generate empty slots for player inventory (7 columns x 6 rows = 42 slots)
  const playerSlots = Array.from({ length: 42 }, (_, i) => i + 1)

  // Generate empty slots for container inventory (7 columns x 6 rows = 42 slots)
  const containerSlots = Array.from({ length: 42 }, (_, i) => i + 1)

  // Generate hotbar slots (5 slots)
  const hotbarSlots = Array.from({ length: 5 }, (_, i) => i + 1)

  // Find item by slot
  const getItemBySlot = (slot, source) => {
    if (source === "player") {
      return playerInventory.find((item) => item.slot === slot) || null
    } else if (source === "container") {
      return containerInventory.find((item) => item.slot === slot) || null
    } else if (source === "hotbar") {
      return hotbarInventory.find((item) => item.slot === slot) || null
    }
    return null
  }

  // Handle item drop (for drag and drop)
  const handleItemDrop = (item, newSlot, newSource) => {
    if (!item) return // Safety check

    const oldSource = item.source
    const oldSlot = item.slot

    // Check if the target slot is already occupied
    const targetItem = getItemBySlot(newSlot, newSource)

    if (oldSource === newSource) {
      // Moving within the same inventory
      if (oldSource === "player") {
        const updatedItems = [...playerInventory]
        const itemIndex = updatedItems.findIndex((i) => i.slot === oldSlot)

        if (itemIndex !== -1) {
          // If target slot has an item, swap positions
          if (targetItem) {
            const targetIndex = updatedItems.findIndex((i) => i.slot === newSlot)
            if (targetIndex !== -1) {
              updatedItems[targetIndex].slot = oldSlot
            }
          }

          // Update the dragged item's slot
          updatedItems[itemIndex].slot = newSlot
          setPlayerInventory(updatedItems)
        }
      } else if (oldSource === "container") {
        // Container inventory
        const updatedItems = [...containerInventory]
        const itemIndex = updatedItems.findIndex((i) => i.slot === oldSlot)

        if (itemIndex !== -1) {
          // If target slot has an item, swap positions
          if (targetItem) {
            const targetIndex = updatedItems.findIndex((i) => i.slot === newSlot)
            if (targetIndex !== -1) {
              updatedItems[targetIndex].slot = oldSlot
            }
          }

          // Update the dragged item's slot
          updatedItems[itemIndex].slot = newSlot
          setContainerInventory(updatedItems)
        }
      } else if (oldSource === "hotbar") {
        // Hotbar inventory
        const updatedItems = [...hotbarInventory]
        const itemIndex = updatedItems.findIndex((i) => i.slot === oldSlot)

        if (itemIndex !== -1) {
          // If target slot has an item, swap positions
          if (targetItem) {
            const targetIndex = updatedItems.findIndex((i) => i.slot === newSlot)
            if (targetIndex !== -1) {
              updatedItems[targetIndex].slot = oldSlot
            }
          }

          // Update the dragged item's slot
          updatedItems[itemIndex].slot = newSlot
          setHotbarInventory(updatedItems)
        }
      }
    } else {
      // Moving between inventories
      if (oldSource === "player") {
        // From player to another inventory
        const updatedPlayerItems = playerInventory.filter((i) => i.slot !== oldSlot)
        const itemToMove = playerInventory.find((i) => i.slot === oldSlot)

        if (itemToMove) {
          if (newSource === "container") {
            // To container
            let updatedContainerItems = [...containerInventory]

            // If target slot has an item, swap positions
            if (targetItem) {
              updatedPlayerItems.push({ ...targetItem, slot: oldSlot })
              updatedContainerItems = containerInventory.filter((i) => i.slot !== newSlot)
            }

            // Add the moved item to the container
            updatedContainerItems.push({ ...itemToMove, slot: newSlot })
            setPlayerInventory(updatedPlayerItems)
            setContainerInventory(updatedContainerItems)
          } else if (newSource === "hotbar") {
            // To hotbar
            let updatedHotbarItems = [...hotbarInventory]

            // If target slot has an item, swap positions
            if (targetItem) {
              updatedPlayerItems.push({ ...targetItem, slot: oldSlot })
              updatedHotbarItems = hotbarInventory.filter((i) => i.slot !== newSlot)
            }

            // Add the moved item to the hotbar
            updatedHotbarItems.push({ ...itemToMove, slot: newSlot })
            setPlayerInventory(updatedPlayerItems)
            setHotbarInventory(updatedHotbarItems)
          }

          // Update weights
          updateWeights(updatedPlayerItems, containerInventory)
        }
      } else if (oldSource === "container") {
        // From container to another inventory
        const updatedContainerItems = containerInventory.filter((i) => i.slot !== oldSlot)
        const itemToMove = containerInventory.find((i) => i.slot === oldSlot)

        if (itemToMove) {
          if (newSource === "player") {
            // To player
            let updatedPlayerItems = [...playerInventory]

            // If target slot has an item, swap positions
            if (targetItem) {
              updatedContainerItems.push({ ...targetItem, slot: oldSlot })
              updatedPlayerItems = playerInventory.filter((i) => i.slot !== newSlot)
            }

            // Add the moved item to the player inventory
            updatedPlayerItems.push({ ...itemToMove, slot: newSlot })
            setPlayerInventory(updatedPlayerItems)
            setContainerInventory(updatedContainerItems)
          } else if (newSource === "hotbar") {
            // To hotbar
            let updatedHotbarItems = [...hotbarInventory]

            // If target slot has an item, swap positions
            if (targetItem) {
              updatedContainerItems.push({ ...targetItem, slot: oldSlot })
              updatedHotbarItems = hotbarInventory.filter((i) => i.slot !== newSlot)
            }

            // Add the moved item to the hotbar
            updatedHotbarItems.push({ ...itemToMove, slot: newSlot })
            setContainerInventory(updatedContainerItems)
            setHotbarInventory(updatedHotbarItems)
          }

          // Update weights
          updateWeights(playerInventory, updatedContainerItems)
        }
      } else if (oldSource === "hotbar") {
        // From hotbar to another inventory
        const updatedHotbarItems = hotbarInventory.filter((i) => i.slot !== oldSlot)
        const itemToMove = hotbarInventory.find((i) => i.slot === oldSlot)

        if (itemToMove) {
          if (newSource === "player") {
            // To player
            let updatedPlayerItems = [...playerInventory]

            // If target slot has an item, swap positions
            if (targetItem) {
              updatedHotbarItems.push({ ...targetItem, slot: oldSlot })
              updatedPlayerItems = playerInventory.filter((i) => i.slot !== newSlot)
            }

            // Add the moved item to the player inventory
            updatedPlayerItems.push({ ...itemToMove, slot: newSlot })
            setPlayerInventory(updatedPlayerItems)
            setHotbarInventory(updatedHotbarItems)

            // Update weights
            updateWeights(updatedPlayerItems, containerInventory)
          } else if (newSource === "container") {
            // To container
            let updatedContainerItems = [...containerInventory]

            // If target slot has an item, swap positions
            if (targetItem) {
              updatedHotbarItems.push({ ...targetItem, slot: oldSlot })
              updatedContainerItems = containerInventory.filter((i) => i.slot !== newSlot)
            }

            // Add the moved item to the container
            updatedContainerItems.push({ ...itemToMove, slot: newSlot })
            setContainerInventory(updatedContainerItems)
            setHotbarInventory(updatedHotbarItems)

            // Update weights
            updateWeights(playerInventory, updatedContainerItems)
          }
        }
      }
    }

    // Clear selection if the moved item was selected
    if (selectedItem && selectedItem.id === item.id && selectedItem.source === oldSource) {
      setSelectedItem(null)
    }
  }

  // Update weights based on inventory contents
  const updateWeights = (playerItems, containerItems) => {
    const playerTotalWeight = playerItems.reduce(
      (total, item) => total + (item?.weight || 0) * (item?.quantity || 1),
      0,
    )
    const containerTotalWeight = containerItems.reduce(
      (total, item) => total + (item?.weight || 0) * (item?.quantity || 1),
      0,
    )

    setPlayerWeight({ ...playerWeight, current: playerTotalWeight })
    setContainerWeight({ ...containerWeight, current: containerTotalWeight })
  }

  // Handle item transfer
  const handleTransfer = (direction) => {
    if (!selectedItem) return

    if (direction === "to-container") {
      // Find an empty slot in container
      let targetSlot = 1
      while (getItemBySlot(targetSlot, "container") && targetSlot <= 42) {
        targetSlot++
      }

      if (targetSlot <= 42) {
        handleItemDrop(selectedItem, targetSlot, "container")
      }
    } else {
      // Find an empty slot in player inventory
      let targetSlot = 1
      while (getItemBySlot(targetSlot, "player") && targetSlot <= 42) {
        targetSlot++
      }

      if (targetSlot <= 42) {
        handleItemDrop(selectedItem, targetSlot, "player")
      }
    }
  }

  // Handle item use
  const handleUse = () => {
    if (!selectedItem) return

    // Logic for using items would go here
    setSelectedItem(null)
  }

  // Handle item drop
  const handleDrop = () => {
    if (!selectedItem || selectedItem.source !== "player") return

    // Remove item from inventory
    const updatedItems = playerInventory.filter(
      (item) => !(item.id === selectedItem.id && item.slot === selectedItem.slot),
    )
    setPlayerInventory(updatedItems)

    // Update weight
    updateWeights(updatedItems, containerInventory)

    // Clear selection
    setSelectedItem(null)
  }

  // Increase action amount
  const increaseAmount = () => {
    if (!selectedItem) return
    setActionAmount((prev) => Math.min(prev + 1, selectedItem.quantity || 1))
  }

  // Decrease action amount
  const decreaseAmount = () => {
    if (!selectedItem) return
    setActionAmount((prev) => Math.max(prev - 1, 1))
  }

  // Filter items by category and search query
  const filteredPlayerItems = playerInventory.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory
    const matchesSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Calculate total weight on component mount and when inventory changes
  useEffect(() => {
    updateWeights(playerInventory, containerInventory)
  }, [])

  // Get grid size class
  const getGridSizeClass = () => {
    switch (uiSettings.gridSize) {
      case "small":
        return "grid-cols-8"
      case "large":
        return "grid-cols-6"
      default:
        return "grid-cols-7"
    }
  }

  // Helper function to get border style based on settings
  const getBorderStyle = () => {
    switch (uiSettings.borderStyle) {
      case "none":
        return "border-0"
      case "thin":
        return uiSettings.darkMode ? "border border-gray-800/50" : "border border-gray-300/50"
      case "medium":
        return uiSettings.darkMode ? "border-2 border-gray-800/70" : "border-2 border-gray-300/70"
      case "thick":
        return uiSettings.darkMode ? "border-4 border-gray-800/70" : "border-4 border-gray-300/70"
      case "glow":
        return `border border-${uiSettings.colorTheme}-500/50 shadow-lg shadow-${uiSettings.colorTheme}-500/20`
      default:
        return uiSettings.darkMode ? "border border-gray-800/50" : "border border-gray-300/50"
    }
  }

  // Helper function to get UI style based on settings
  const getUiStyle = () => {
    switch (uiSettings.uiStyle) {
      case "minimal":
        return uiSettings.darkMode ? "bg-black/30 backdrop-blur-sm" : "bg-white/30 backdrop-blur-sm"
      case "glass":
        return uiSettings.darkMode ? "bg-black/40 backdrop-blur-md" : "bg-white/40 backdrop-blur-md"
      case "solid":
        return uiSettings.darkMode ? "bg-gray-900" : "bg-gray-100"
      case "neon":
        return uiSettings.darkMode
          ? `bg-black/60 border-${uiSettings.colorTheme}-500/30 shadow-lg shadow-${uiSettings.colorTheme}-500/20`
          : `bg-white/60 border-${uiSettings.colorTheme}-500/30 shadow-lg shadow-${uiSettings.colorTheme}-500/20`
      default:
        return uiSettings.darkMode
          ? `bg-black/${uiSettings.bgOpacity} backdrop-blur-sm`
          : `bg-white/${uiSettings.bgOpacity} backdrop-blur-sm`
    }
  }

  // Update the main component's return statement for a more polished UI
  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className={`h-screen w-full ${
          uiSettings.darkMode ? "bg-black/90" : "bg-gray-100/90"
        } text-white font-sans flex items-center justify-center p-1 overflow-hidden`}
        style={{
          backgroundImage: uiSettings.darkMode
            ? "linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url('/placeholder.svg?height=1080&width=1920')"
            : "linear-gradient(to bottom, rgba(255,255,255,0.7), rgba(255,255,255,0.9)), url('/placeholder.svg?height=1080&width=1920')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative w-full max-w-7xl mx-auto h-full flex flex-col">
          {/* Main Inventory Container */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 flex-grow">
            {/* Player Inventory */}
            <div
              className={`${getUiStyle()} rounded-lg overflow-hidden ${getBorderStyle()} shadow-xl h-full flex flex-col`}
            >
              <div
                className={`p-2 border-b ${
                  uiSettings.darkMode ? "border-gray-800/50" : "border-gray-300/50"
                } flex justify-between items-center ${
                  uiSettings.darkMode
                    ? "bg-gradient-to-r from-gray-900/30 to-black/30"
                    : "bg-gradient-to-r from-gray-100/30 to-white/30"
                }`}
              >
                <div className="flex items-center gap-2">
                  <h2 className={`text-base font-bold ${uiSettings.darkMode ? "text-white" : "text-gray-900"}`}>
                    Player Inventory
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 bg-gray-700/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          playerWeightPercentage > 80
                            ? "bg-gradient-to-r from-red-500 to-red-600"
                            : `bg-gradient-to-r from-${uiSettings.colorTheme}-500 to-${uiSettings.colorTheme}-600`
                        }`}
                        style={{ width: `${playerWeightPercentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {playerWeight.current.toFixed(1)}/{playerWeight.max.toFixed(1)} kg
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      className={`${
                        uiSettings.darkMode ? "bg-black/60 border-gray-700/50" : "bg-white/60 border-gray-300/50"
                      } border rounded-md px-2 py-1 text-xs w-32 pl-6 focus:outline-none focus:ring-1 focus:ring-${
                        uiSettings.colorTheme
                      }-500 focus:border-${uiSettings.colorTheme}-500 transition-all ${
                        uiSettings.darkMode ? "text-white" : "text-gray-900"
                      }`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search
                      className={`absolute left-1.5 top-1.5 h-3 w-3 ${
                        uiSettings.darkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <select
                    className={`${
                      uiSettings.darkMode ? "bg-black/60 border-gray-700/50" : "bg-white/60 border-gray-300/50"
                    } border rounded-md px-2 py-1 text-xs appearance-none focus:outline-none focus:ring-1 focus:ring-${
                      uiSettings.colorTheme
                    }-500 focus:border-${uiSettings.colorTheme}-500 transition-all pr-6 relative ${
                      uiSettings.darkMode ? "text-white" : "text-gray-900"
                    }`}
                    value={activeCategory}
                    onChange={(e) => setActiveCategory(e.target.value)}
                    style={{
                      backgroundImage:
                        'url(\'data:image/svg+xml;charset=US-ASCII,<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" fill="%236B7280"/></svg>\')',
                      backgroundPosition: "right 0.25rem center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "12px 12px",
                    }}
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={`grid ${getGridSizeClass()} gap-[1px] p-0.5 overflow-y-auto flex-grow`}>
                {playerSlots.map((slot) => {
                  const item = getItemBySlot(slot, "player")
                  const isVisible = !item || filteredPlayerItems.includes(item)

                  return isVisible ? (
                    <DroppableSlot
                      key={`player-${slot}`}
                      slot={slot}
                      item={item}
                      source="player"
                      onItemClick={handleItemClick}
                      onDrop={handleItemDrop}
                      tooltipId="player-tooltip"
                      uiSettings={uiSettings}
                    />
                  ) : (
                    <div
                      key={`player-${slot}`}
                      className={`aspect-square ${
                        uiSettings.darkMode ? "bg-black/30 border-gray-800/30" : "bg-gray-200/30 border-gray-300/30"
                      } border rounded-md flex items-center justify-center`}
                    >
                      <span className={`${uiSettings.darkMode ? "text-gray-700/50" : "text-gray-400/50"} text-[10px]`}>
                        {slot}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Container Inventory */}
            <div
              className={`${getUiStyle()} rounded-lg overflow-hidden ${getBorderStyle()} shadow-xl h-full flex flex-col`}
            >
              <div
                className={`p-2 border-b ${
                  uiSettings.darkMode ? "border-gray-800/50" : "border-gray-300/50"
                } flex justify-between items-center ${
                  uiSettings.darkMode
                    ? "bg-gradient-to-r from-gray-900/30 to-black/30"
                    : "bg-gradient-to-r from-gray-100/30 to-white/30"
                }`}
              >
                <div className="flex items-center gap-2">
                  <h2 className={`text-base font-bold ${uiSettings.darkMode ? "text-white" : "text-gray-900"}`}>
                    Storage
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 bg-gray-700/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r from-${uiSettings.colorTheme}-500 to-${uiSettings.colorTheme}-600`}
                        style={{ width: `${containerWeightPercentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {containerWeight.current.toFixed(1)}/{containerWeight.max.toFixed(1)} kg
                    </span>
                  </div>
                </div>
              </div>
              <div className={`grid ${getGridSizeClass()} gap-[1px] p-0.5 overflow-y-auto flex-grow`}>
                {containerSlots.map((slot) => {
                  const item = getItemBySlot(slot, "container")
                  return (
                    <DroppableSlot
                      key={`container-${slot}`}
                      slot={slot}
                      item={item}
                      source="container"
                      onItemClick={handleItemClick}
                      onDrop={handleItemDrop}
                      tooltipId="container-tooltip"
                      uiSettings={uiSettings}
                    />
                  )
                })}
              </div>
            </div>
          </div>

          {/* Hotbar - Moved below the inventory grids */}
          <div className="mt-2 flex justify-center">
            <div className={`flex gap-1 p-2 ${getUiStyle()} rounded-lg ${getBorderStyle()} shadow-lg`}>
              {hotbarSlots.map((slot) => (
                <div
                  key={`hotbar-${slot}`}
                  className="w-12 h-12 sm:w-14 sm:h-14" // Fixed width and height for consistency
                >
                  <DroppableSlot
                    slot={slot}
                    item={getItemBySlot(slot, "hotbar")}
                    source="hotbar"
                    onItemClick={handleItemClick}
                    onDrop={handleItemDrop}
                    tooltipId="hotbar-tooltip"
                    uiSettings={uiSettings}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          {selectedItem && (
            <div className={`fixed inset-0 flex items-center justify-center z-50`}>
              <div
                className={`${
                  uiSettings.darkMode ? "bg-black/50" : "bg-white/50"
                } border ${
                  uiSettings.darkMode ? "border-gray-700/50" : "border-gray-300/50"
                } rounded-lg p-3 w-80 backdrop-blur-sm shadow-2xl`}
              >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className={`text-lg font-bold ${uiSettings.darkMode ? "text-white" : "text-gray-900"}`}>
                    {selectedItem.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        selectedItem.category === "weapons"
                          ? "bg-red-500"
                          : selectedItem.category === "medical"
                            ? "bg-green-500"
                            : selectedItem.category === "consumables"
                              ? "bg-amber-500"
                              : selectedItem.category === "tools"
                                ? "bg-blue-500"
                                : selectedItem.category === "valuables"
                                  ? "bg-purple-500"
                                  : selectedItem.category === "clothing"
                                    ? "bg-cyan-500"
                                    : "bg-gray-500"
                      }`}
                    ></div>
                    <span className="text-xs text-gray-400 capitalize">{selectedItem.category}</span>
                  </div>
                </div>
                <button
                  className={`text-gray-400 hover:text-${
                    uiSettings.darkMode ? "white" : "gray-900"
                  } bg-gray-800/50 hover:bg-gray-700/70 rounded-full p-1 transition-colors`}
                  onClick={() => setSelectedItem(null)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div
                className={`flex items-center justify-center mb-3 ${
                  uiSettings.darkMode
                    ? "bg-gradient-to-b from-gray-800/30 to-gray-900/30"
                    : "bg-gradient-to-b from-gray-200/30 to-gray-300/30"
                } p-3 rounded-lg border ${uiSettings.darkMode ? "border-gray-800/50" : "border-gray-300/50"}`}
              >
                <img
                  src={selectedItem.image || "/placeholder.svg"}
                  alt={selectedItem.name}
                  className="w-16 h-16 object-contain drop-shadow-lg"
                />
              </div>

              <p
                className={`text-xs ${uiSettings.darkMode ? "text-gray-300" : "text-gray-700"} mb-3 border-l-2 ${
                  uiSettings.darkMode ? "border-gray-700" : "border-gray-300"
                } pl-2 italic`}
              >
                {selectedItem.description}
              </p>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3 text-xs">
                {uiSettings.showWeight && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Weight:</span>
                    <span
                      className={`${uiSettings.darkMode ? "text-white" : "text-gray-900"} font-medium ${
                        uiSettings.darkMode ? "bg-gray-800/50" : "bg-gray-200/50"
                      } px-1.5 py-0.5 rounded`}
                    >
                      {selectedItem.weight}kg
                    </span>
                  </div>
                )}
                {uiSettings.showDurability && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Durability:</span>
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`h-1 w-10 ${
                          uiSettings.darkMode ? "bg-gray-800" : "bg-gray-300"
                        } rounded-full overflow-hidden`}
                      >
                        <div
                          className={`h-full ${
                            selectedItem.durability > 75
                              ? "bg-emerald-500"
                              : selectedItem.durability > 40
                                ? "bg-amber-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${selectedItem.durability}%` }}
                        ></div>
                      </div>
                      <span
                        className={`font-medium ${
                          selectedItem.durability > 75
                            ? "text-emerald-400"
                            : selectedItem.durability > 40
                              ? "text-amber-400"
                              : "text-red-400"
                        }`}
                      >
                        {selectedItem.durability}%
                      </span>
                    </div>
                  </div>
                )}
                {selectedItem.illegal && uiSettings.showIllegalMarker && (
                  <div className="col-span-2 bg-red-900/30 border border-red-800/50 rounded px-2 py-1 flex items-center gap-2">
                    <span className="text-red-500">⚠️</span>
                    <span className="text-red-400 font-medium">Illegal Item</span>
                  </div>
                )}
              </div>

              {selectedItem.quantity > 1 && (
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs ${uiSettings.darkMode ? "text-gray-300" : "text-gray-700"}`}>Amount:</span>
                  <div className="flex items-center">
                    <button
                      className={`${
                        uiSettings.darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-300 hover:bg-gray-400"
                      } ${
                        uiSettings.darkMode ? "text-white" : "text-gray-900"
                      } w-6 h-6 flex items-center justify-center rounded-l-md transition-colors`}
                      onClick={decreaseAmount}
                    >
                      <ChevronDown className="h-3 w-3" />
                    </button>
                    <div
                      className={`${uiSettings.darkMode ? "bg-black text-white" : "bg-white text-gray-900"} text-center w-8 h-6 flex items-center justify-center border-t border-b ${
                        uiSettings.darkMode ? "border-gray-700" : "border-gray-300"
                      }`}
                    >
                      {actionAmount}
                    </div>
                    <button
                      className={`${
                        uiSettings.darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-300 hover:bg-gray-400"
                      } ${
                        uiSettings.darkMode ? "text-white" : "text-gray-900"
                      } w-6 h-6 flex items-center justify-center rounded-r-md transition-colors`}
                      onClick={increaseAmount}
                    >
                      <ChevronUp className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button
                  className={`bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white py-1.5 px-3 rounded-md transition-colors font-medium shadow-md text-sm`}
                  onClick={handleUse}
                >
                  Use
                </button>

                {selectedItem.source === "player" ? (
                  <>
                    <button
                      className={`bg-gradient-to-r from-${uiSettings.colorTheme}-600 to-${uiSettings.colorTheme}-700 hover:from-${uiSettings.colorTheme}-500 hover:to-${uiSettings.colorTheme}-600 text-white py-1.5 px-3 rounded-md transition-colors font-medium shadow-md text-sm`}
                      onClick={() => handleTransfer("to-container")}
                    >
                      Transfer
                    </button>
                    <button
                      className={`bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-1.5 px-3 rounded-md col-span-2 mt-1 transition-colors font-medium shadow-md text-sm`}
                      onClick={handleDrop}
                    >
                      Drop
                    </button>
                  </>
                ) : (
                  <button
                    className={`bg-gradient-to-r from-${uiSettings.colorTheme}-600 to-${uiSettings.colorTheme}-700 hover:from-${uiSettings.colorTheme}-500 hover:to-${uiSettings.colorTheme}-600 text-white py-1.5 px-3 rounded-md transition-colors font-medium shadow-md text-sm`}
                    onClick={() => handleTransfer("to-player")}
                  >
                    Take
                  </button>
                )}
              </div>
            </div>
            </div>
          )}

          {/* Settings Button */}
          <button
            className={`fixed bottom-4 left-4 ${
              uiSettings.darkMode ? "bg-black/70 border-gray-700/50" : "bg-white/70 border-gray-300/50"
            } border p-2 rounded-md backdrop-blur-md shadow-lg hover:bg-${
              uiSettings.darkMode ? "gray-900/70" : "gray-100/70"
            } transition-colors`}
            onClick={() => setSettingsOpen(true)}
          >
            <Settings className={`h-4 w-4 ${uiSettings.darkMode ? "text-white" : "text-gray-900"}`} />
          </button>
        </div>

        {/* Tooltips */}
        <ItemTooltip id="player-tooltip" uiSettings={uiSettings} />
        <ItemTooltip id="container-tooltip" uiSettings={uiSettings} />
        <ItemTooltip id="hotbar-tooltip" uiSettings={uiSettings} />

        {/* Settings Modal */}
        <SettingsModal
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          uiSettings={uiSettings}
          setUiSettings={setUiSettings}
        />
      </div>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .settings-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .settings-scrollbar::-webkit-scrollbar-track {
          background: #1F2937;
          border-radius: 8px;
        }
        
        .settings-scrollbar::-webkit-scrollbar-thumb {
          background: #4B5563;
          border-radius: 8px;
          border: 1px solid #374151;
        }
        
        .settings-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6B7280;
        }
      `}</style>
    </DndProvider>
  )
}
