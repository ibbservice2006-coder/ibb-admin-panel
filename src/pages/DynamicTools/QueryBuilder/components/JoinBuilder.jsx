import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Link2, Plus, Trash2 } from 'lucide-react'

export default function JoinBuilder({ selectedTables, joins, onAddJoin, onRemoveJoin, onUpdateJoin }) {
  if (selectedTables.length < 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            Table Joins
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground text-sm py-4">
            Select at least 2 tables to create joins
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleAddJoin = () => {
    if (selectedTables.length >= 2) {
      onAddJoin({
        fromTable: selectedTables[0].name,
        toTable: selectedTables[1].name,
        fromField: '',
        toField: '',
        type: 'inner'
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Link2 className="h-4 w-4" />
          Table Joins
          <Badge variant="secondary" className="ml-auto">
            {joins.length} joins
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {joins.map((join, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-3 bg-card">
            <div className="flex items-center justify-between">
              <Badge variant="outline">{join.type.toUpperCase()} JOIN</Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveJoin(index)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* From Table */}
              <div className="space-y-2">
                <label className="text-xs font-medium">From Table</label>
                <Select
                  value={join.fromTable}
                  onValueChange={(value) => onUpdateJoin(index, { ...join, fromTable: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedTables.map(table => (
                      <SelectItem key={table.name} value={table.name}>
                        {table.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* To Table */}
              <div className="space-y-2">
                <label className="text-xs font-medium">To Table</label>
                <Select
                  value={join.toTable}
                  onValueChange={(value) => onUpdateJoin(index, { ...join, toTable: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedTables.map(table => (
                      <SelectItem key={table.name} value={table.name}>
                        {table.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* From Field */}
              <div className="space-y-2">
                <label className="text-xs font-medium">From Field</label>
                <Select
                  value={join.fromField}
                  onValueChange={(value) => onUpdateJoin(index, { ...join, fromField: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedTables
                      .find(t => t.name === join.fromTable)
                      ?.fields.map(field => (
                        <SelectItem key={field.name} value={field.name}>
                          {field.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* To Field */}
              <div className="space-y-2">
                <label className="text-xs font-medium">To Field</label>
                <Select
                  value={join.toField}
                  onValueChange={(value) => onUpdateJoin(index, { ...join, toField: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedTables
                      .find(t => t.name === join.toTable)
                      ?.fields.map(field => (
                        <SelectItem key={field.name} value={field.name}>
                          {field.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Join Type */}
            <div className="space-y-2">
              <label className="text-xs font-medium">Join Type</label>
              <Select
                value={join.type}
                onValueChange={(value) => onUpdateJoin(index, { ...join, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inner">INNER JOIN</SelectItem>
                  <SelectItem value="left">LEFT JOIN</SelectItem>
                  <SelectItem value="right">RIGHT JOIN</SelectItem>
                  <SelectItem value="full">FULL OUTER JOIN</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleAddJoin}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Join
        </Button>
      </CardContent>
    </Card>
  )
}
