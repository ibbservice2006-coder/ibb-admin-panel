import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Filter, Plus, Trash2 } from 'lucide-react'

export default function WhereBuilder({ selectedTables, conditions, onAddCondition, onRemoveCondition, onUpdateCondition }) {
  if (selectedTables.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Filter className="h-4 w-4" />
            WHERE Conditions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground text-sm py-4">
            Select tables first to add conditions
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleAddCondition = () => {
    onAddCondition({
      table: selectedTables[0].name,
      field: selectedTables[0].fields[0].name,
      operator: '=',
      value: '',
      logicalOperator: conditions.length > 0 ? 'AND' : null
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Filter className="h-4 w-4" />
          WHERE Conditions
          <Badge variant="secondary" className="ml-auto">
            {conditions.length} conditions
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {conditions.map((condition, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-3 bg-card">
            <div className="flex items-center justify-between">
              {index > 0 && (
                <Select
                  value={condition.logicalOperator}
                  onValueChange={(value) => onUpdateCondition(index, { ...condition, logicalOperator: value })}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AND">AND</SelectItem>
                    <SelectItem value="OR">OR</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto"
                onClick={() => onRemoveCondition(index)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Table */}
              <div className="space-y-2">
                <label className="text-xs font-medium">Table</label>
                <Select
                  value={condition.table}
                  onValueChange={(value) => {
                    const table = selectedTables.find(t => t.name === value)
                    onUpdateCondition(index, {
                      ...condition,
                      table: value,
                      field: table?.fields[0]?.name || ''
                    })
                  }}
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

              {/* Field */}
              <div className="space-y-2">
                <label className="text-xs font-medium">Field</label>
                <Select
                  value={condition.field}
                  onValueChange={(value) => onUpdateCondition(index, { ...condition, field: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedTables
                      .find(t => t.name === condition.table)
                      ?.fields.map(field => (
                        <SelectItem key={field.name} value={field.name}>
                          {field.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Operator */}
              <div className="space-y-2">
                <label className="text-xs font-medium">Operator</label>
                <Select
                  value={condition.operator}
                  onValueChange={(value) => onUpdateCondition(index, { ...condition, operator: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="=">=</SelectItem>
                    <SelectItem value="!=">!=</SelectItem>
                    <SelectItem value=">">{'>'}</SelectItem>
                    <SelectItem value="<">{'<'}</SelectItem>
                    <SelectItem value=">=">{'>='}</SelectItem>
                    <SelectItem value="<=">{'<='}</SelectItem>
                    <SelectItem value="LIKE">LIKE</SelectItem>
                    <SelectItem value="IN">IN</SelectItem>
                    <SelectItem value="IS NULL">IS NULL</SelectItem>
                    <SelectItem value="IS NOT NULL">IS NOT NULL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Value */}
              <div className="space-y-2">
                <label className="text-xs font-medium">Value</label>
                <Input
                  value={condition.value}
                  onChange={(e) => onUpdateCondition(index, { ...condition, value: e.target.value })}
                  placeholder="Enter value"
                  disabled={condition.operator === 'IS NULL' || condition.operator === 'IS NOT NULL'}
                />
              </div>
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleAddCondition}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Condition
        </Button>
      </CardContent>
    </Card>
  )
}
