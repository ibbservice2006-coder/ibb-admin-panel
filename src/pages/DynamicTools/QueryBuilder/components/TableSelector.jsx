import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Database, Plus, Search, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function TableSelector({ availableTables, selectedTables, onAddTable, onRemoveTable }) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTables = availableTables.filter(table =>
    table.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const isTableSelected = (tableName) => {
    return selectedTables.some(t => t.name === tableName)
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Database className="h-4 w-4" />
          Available Tables
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tables..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Tables List */}
        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="space-y-2">
            {filteredTables.map((table) => {
              const selected = isTableSelected(table.name)
              
              return (
                <div
                  key={table.name}
                  className={cn(
                    "p-3 rounded-lg border transition-all cursor-pointer",
                    selected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-accent/50"
                  )}
                  onClick={() => {
                    if (selected) {
                      onRemoveTable(table.name)
                    } else {
                      onAddTable(table)
                    }
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">{table.name}</span>
                    </div>
                    {selected ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <Plus className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {table.fields.length} fields
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
