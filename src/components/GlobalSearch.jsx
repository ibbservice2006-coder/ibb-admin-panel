import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, Clock, TrendingUp, FileText, Package, Users, ShoppingCart, Truck } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

// Mock data for search results
const mockData = {
  products: [
    { id: 1, name: 'Laptop Dell XPS 15', category: 'Electronics', price: 45000, stock: 12 },
    { id: 2, name: 'iPhone 15 Pro', category: 'Electronics', price: 42900, stock: 8 },
    { id: 3, name: 'Samsung Galaxy S24', category: 'Electronics', price: 35900, stock: 15 },
    { id: 4, name: 'MacBook Pro M3', category: 'Electronics', price: 89900, stock: 5 },
    { id: 5, name: 'iPad Air', category: 'Electronics', price: 24900, stock: 20 }
  ],
  customers: [
    { id: 1, name: 'John Smith', email: 'john@example.com', phone: '081-234-5678', orders: 12 },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', phone: '082-345-6789', orders: 8 },
    { id: 3, name: 'Michael Brown', email: 'michael@example.com', phone: '083-456-7890', orders: 15 },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com', phone: '084-567-8901', orders: 6 }
  ],
  orders: [
    { id: 'ORD-001', customer: 'John Smith', total: 45000, status: 'Completed', date: '2025-10-01' },
    { id: 'ORD-002', customer: 'Sarah Johnson', total: 42900, status: 'Pending', date: '2025-10-05' },
    { id: 'ORD-003', customer: 'Michael Brown', total: 89900, status: 'Shipped', date: '2025-10-07' },
    { id: 'ORD-004', customer: 'Emily Davis', total: 24900, status: 'Processing', date: '2025-10-08' }
  ],
  vendors: [
    { id: 1, name: 'Tech Supplies Co.', contact: 'vendor1@example.com', products: 45 },
    { id: 2, name: 'Global Electronics', contact: 'vendor2@example.com', products: 32 },
    { id: 3, name: 'Smart Devices Inc.', contact: 'vendor3@example.com', products: 28 }
  ]
}

const searchCategories = [
  { id: 'products', label: 'Products', icon: Package, color: 'text-blue-600' },
  { id: 'customers', label: 'Customers', icon: Users, color: 'text-green-600' },
  { id: 'orders', label: 'Orders', icon: ShoppingCart, color: 'text-purple-600' },
  { id: 'vendors', label: 'Vendors', icon: Truck, color: 'text-orange-600' }
]

export function GlobalSearch({ open, onOpenChange }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState({})
  const [recentSearches, setRecentSearches] = useState([
    'iPhone 15',
    'John Smith',
    'ORD-001',
    'Tech Supplies'
  ])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()

  // Search function
  const performSearch = useCallback((searchQuery) => {
    if (!searchQuery.trim()) {
      setResults({})
      return
    }

    const query = searchQuery.toLowerCase()
    const searchResults = {}

    // Search products
    const productResults = mockData.products.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    )
    if (productResults.length > 0) {
      searchResults.products = productResults.slice(0, 5)
    }

    // Search customers
    const customerResults = mockData.customers.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query) ||
      item.phone.includes(query)
    )
    if (customerResults.length > 0) {
      searchResults.customers = customerResults.slice(0, 5)
    }

    // Search orders
    const orderResults = mockData.orders.filter(item =>
      item.id.toLowerCase().includes(query) ||
      item.customer.toLowerCase().includes(query) ||
      item.status.toLowerCase().includes(query)
    )
    if (orderResults.length > 0) {
      searchResults.orders = orderResults.slice(0, 5)
    }

    // Search vendors
    const vendorResults = mockData.vendors.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.contact.toLowerCase().includes(query)
    )
    if (vendorResults.length > 0) {
      searchResults.vendors = vendorResults.slice(0, 5)
    }

    setResults(searchResults)
  }, [])

  // Handle search input change
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, performSearch])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!open) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => Math.min(prev + 1, getTotalResults() - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        handleSelectResult(selectedIndex)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, selectedIndex, results])

  const getTotalResults = () => {
    return Object.values(results).reduce((acc, arr) => acc + arr.length, 0)
  }

  const handleSelectResult = (index) => {
    // Navigate to the selected result
    // This is a placeholder - implement actual navigation
    console.log('Selected result at index:', index)
    
    // Add to recent searches
    if (query && !recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)])
    }
    
    onOpenChange(false)
    setQuery('')
  }

  const handleRecentSearch = (search) => {
    setQuery(search)
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
  }

  const handleClose = () => {
    onOpenChange(false)
    setQuery('')
    setResults({})
    setSelectedIndex(0)
  }

  const getResultIcon = (category) => {
    const cat = searchCategories.find(c => c.id === category)
    return cat ? cat.icon : FileText
  }

  const getResultColor = (category) => {
    const cat = searchCategories.find(c => c.id === category)
    return cat ? cat.color : 'text-gray-600'
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <Search className="w-5 h-5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, customers, orders, vendors..."
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:bg-muted rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <ScrollArea className="max-h-[500px]">
          <div className="p-4">
            {/* Recent Searches */}
            {!query && recentSearches.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium text-muted-foreground">Recent Searches</h3>
                  </div>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentSearch(search)}
                      className="px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 rounded-md transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            {!query && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium text-muted-foreground">Popular Searches</h3>
                </div>
                <div className="space-y-2">
                  {['iPhone 15 Pro', 'Laptop Dell', 'Samsung Galaxy', 'MacBook Pro'].map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setQuery(item)}
                      className="w-full text-left px-3 py-2 hover:bg-muted rounded-md transition-colors text-sm"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {query && Object.keys(results).length > 0 && (
              <div className="space-y-6">
                {Object.entries(results).map(([category, items]) => {
                  const Icon = getResultIcon(category)
                  const color = getResultColor(category)
                  
                  return (
                    <div key={category}>
                      <div className="flex items-center gap-2 mb-3">
                        <Icon className={`w-4 h-4 ${color}`} />
                        <h3 className="text-sm font-medium capitalize">{category}</h3>
                        <Badge variant="secondary" className="ml-auto">
                          {items.length}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        {items.map((item, index) => (
                          <button
                            key={item.id}
                            onClick={() => handleSelectResult(index)}
                            className="w-full text-left px-3 py-2.5 hover:bg-muted rounded-md transition-colors"
                          >
                            {category === 'products' && (
                              <div>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm text-muted-foreground flex items-center gap-3 mt-1">
                                  <span>{item.category}</span>
                                  <span>•</span>
                                  <span>฿{item.price.toLocaleString()}</span>
                                  <span>•</span>
                                  <span>Stock: {item.stock}</span>
                                </div>
                              </div>
                            )}
                            {category === 'customers' && (
                              <div>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm text-muted-foreground flex items-center gap-3 mt-1">
                                  <span>{item.email}</span>
                                  <span>•</span>
                                  <span>{item.phone}</span>
                                  <span>•</span>
                                  <span>{item.orders} orders</span>
                                </div>
                              </div>
                            )}
                            {category === 'orders' && (
                              <div>
                                <div className="font-medium">{item.id}</div>
                                <div className="text-sm text-muted-foreground flex items-center gap-3 mt-1">
                                  <span>{item.customer}</span>
                                  <span>•</span>
                                  <span>฿{item.total.toLocaleString()}</span>
                                  <span>•</span>
                                  <Badge variant="outline" className="text-xs">
                                    {item.status}
                                  </Badge>
                                </div>
                              </div>
                            )}
                            {category === 'vendors' && (
                              <div>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm text-muted-foreground flex items-center gap-3 mt-1">
                                  <span>{item.contact}</span>
                                  <span>•</span>
                                  <span>{item.products} products</span>
                                </div>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                      <Separator className="mt-4" />
                    </div>
                  )
                })}
              </div>
            )}

            {/* No Results */}
            {query && Object.keys(results).length === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-1">No results found</h3>
                <p className="text-sm text-muted-foreground">
                  Try searching with different keywords
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="px-4 py-2 border-t bg-muted/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-background border rounded">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-background border rounded">↓</kbd>
                <span className="ml-1">to navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-background border rounded">Enter</kbd>
                <span className="ml-1">to select</span>
              </span>
            </div>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-background border rounded">Esc</kbd>
              <span className="ml-1">to close</span>
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
