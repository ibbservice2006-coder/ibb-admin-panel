import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { List, Key, Link2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function FieldSelector({ selectedTables, selectedFields, onFieldToggle }) {
  if (selectedTables.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <List className="h-4 w-4" />
            Select Fields
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground text-sm py-8">
            Select tables first to choose fields
          </div>
        </CardContent>
      </Card>
    )
  }

  const isFieldSelected = (tableName, fieldName) => {
    return selectedFields.some(
      f => f.table === tableName && f.name === fieldName
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <List className="h-4 w-4" />
          Select Fields
          <Badge variant="secondary" className="ml-auto">
            {selectedFields.length} selected
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="space-y-4">
            {selectedTables.map((table) => (
              <div key={table.name}>
                <div className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Badge variant="outline">{table.name}</Badge>
                </div>
                <div className="space-y-2 ml-2">
                  {table.fields.map((field) => {
                    const fieldKey = `${table.name}.${field.name}`
                    const checked = isFieldSelected(table.name, field.name)

                    return (
                      <div
                        key={fieldKey}
                        className={cn(
                          "flex items-center space-x-2 p-2 rounded hover:bg-accent/50 transition-colors cursor-pointer",
                          checked && "bg-primary/5"
                        )}
                        onClick={() => onFieldToggle(table.name, field)}
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => onFieldToggle(table.name, field)}
                        />
                        <div className="flex items-center gap-2 flex-1">
                          {field.primaryKey && (
                            <Key className="h-3 w-3 text-yellow-500" />
                          )}
                          {field.foreignKey && (
                            <Link2 className="h-3 w-3 text-blue-500" />
                          )}
                          <span className="text-sm">{field.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground font-mono">
                          {field.type}
                        </span>
                      </div>
                    )
                  })}
                </div>
                <Separator className="my-3" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
