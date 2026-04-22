import { memo } from 'react'
import { Handle, Position } from 'reactflow'
import { Key, Link2, Database } from 'lucide-react'
import { cn } from '@/lib/utils'

const TableNode = memo(({ data, selected }) => {
  const { name, fields } = data

  return (
    <div
      className={cn(
        "bg-card border-2 rounded-lg shadow-lg min-w-[280px] transition-all duration-200",
        selected ? "border-primary shadow-xl scale-105" : "border-border hover:border-primary/50"
      )}
    >
      {/* Table Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-3 rounded-t-md">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4" />
          <h3 className="font-bold text-sm">{name}</h3>
        </div>
      </div>

      {/* Fields List */}
      <div className="divide-y divide-border">
        {fields.map((field, index) => (
          <div
            key={index}
            className={cn(
              "px-4 py-2 text-xs flex items-center justify-between hover:bg-accent/50 transition-colors",
              field.primaryKey && "bg-primary/5"
            )}
          >
            <div className="flex items-center gap-2 flex-1">
              {/* Icons */}
              <div className="flex items-center gap-1">
                {field.primaryKey && (
                  <Key className="h-3 w-3 text-yellow-500" title="Primary Key" />
                )}
                {field.foreignKey && (
                  <Link2 className="h-3 w-3 text-blue-500" title="Foreign Key" />
                )}
              </div>

              {/* Field Name */}
              <span className={cn(
                "font-medium",
                field.primaryKey && "text-yellow-600 dark:text-yellow-500",
                field.foreignKey && "text-blue-600 dark:text-blue-400"
              )}>
                {field.name}
              </span>
            </div>

            {/* Field Type */}
            <span className="text-muted-foreground text-[10px] font-mono">
              {field.type}
            </span>
          </div>
        ))}
      </div>

      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-primary border-2 border-background"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-primary border-2 border-background"
      />
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-primary border-2 border-background"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-primary border-2 border-background"
      />
    </div>
  )
})

TableNode.displayName = 'TableNode'

export default TableNode
