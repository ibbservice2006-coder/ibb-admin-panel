// Mock data generator
export const generateMockInventory = () => {
  const categories = ['Electronics', 'Accessories', 'Furniture', 'Clothing']
  const locations = ['Warehouse A', 'Warehouse B', 'Warehouse C']
  const products = [
    'Wireless Bluetooth Headphones', 'Smart Watch Series 5', 'USB-C Charging Cable',
    'Laptop Stand Aluminum', 'Mechanical Keyboard RGB', 'Wireless Mouse',
    'Phone Case Premium', 'Screen Protector', 'Power Bank 20000mAh',
    'HDMI Cable 2m', 'USB Hub 4-Port', 'Webcam HD 1080p',
    'Desk Lamp LED', 'Office Chair Ergonomic', 'Monitor Stand',
    'Bluetooth Speaker', 'Microphone USB', 'Gaming Headset',
    'Mouse Pad XL', 'Cable Organizer', 'Laptop Bag 15inch'
  ]

  return products.map((name, index) => {
    const stock = Math.floor(Math.random() * 300)
    const reserved = Math.floor(Math.random() * 20)
    const reorderPoint = Math.floor(Math.random() * 100) + 20
    
    let status = 'in_stock'
    if (stock === 0) status = 'out_of_stock'
    else if (stock <= reorderPoint) status = 'low_stock'

    return {
      id: index + 1,
      sku: `PROD-${String(index + 1).padStart(3, '0')}`,
      name,
      category: categories[Math.floor(Math.random() * categories.length)],
      stock,
      reserved,
      available: stock - reserved,
      reorderPoint,
      status,
      location: `${locations[Math.floor(Math.random() * locations.length)]} - Shelf ${Math.floor(Math.random() * 30) + 1}`,
      unitCost: (Math.random() * 100 + 10).toFixed(2),
      lastUpdated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      image: `https://via.placeholder.com/150?text=${name.split(' ')[0]}`,
      description: `High-quality ${name.toLowerCase()} for professional use`
    }
  })
}

export const mockInventory = generateMockInventory()

// Mock stock history
export const mockStockHistory = [
  { id: 1, date: '2024-10-03 14:30', user: 'John Doe', action: 'Added', quantity: 50, reason: 'Stock Received', newStock: 195 },
  { id: 2, date: '2024-10-02 10:15', user: 'Jane Smith', action: 'Removed', quantity: 10, reason: 'Damaged', newStock: 145 },
  { id: 3, date: '2024-10-01 16:45', user: 'Mike Johnson', action: 'Set', quantity: 155, reason: 'Inventory Correction', newStock: 155 },
  { id: 4, date: '2024-09-30 09:20', user: 'Sarah Wilson', action: 'Added', quantity: 30, reason: 'Customer Return', newStock: 185 }
]

// Mock stock movements
export const mockStockMovements = [
  { id: 1, date: '2024-10-03', type: 'in', quantity: 50, from: 'Supplier A', to: 'Warehouse A', notes: 'New stock arrival' },
  { id: 2, date: '2024-10-02', type: 'out', quantity: 20, from: 'Warehouse A', to: 'Customer', notes: 'Order #1234' },
  { id: 3, date: '2024-10-01', type: 'transfer', quantity: 30, from: 'Warehouse A', to: 'Warehouse B', notes: 'Stock rebalancing' },
  { id: 4, date: '2024-09-30', type: 'in', quantity: 100, from: 'Supplier B', to: 'Warehouse C', notes: 'Bulk order' }
]
