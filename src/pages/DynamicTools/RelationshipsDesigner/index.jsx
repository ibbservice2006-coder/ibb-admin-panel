import { useState, useCallback, useMemo } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  Panel
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Network, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  RefreshCw,
  Key,
  Link2,
  Info
} from 'lucide-react'
import TableNode from './components/TableNode'
import RelationshipEdge from './components/RelationshipEdge'
import { mockSchema } from './data/mockSchema'
import { toPng } from 'html-to-image'

const nodeTypes = {
  tableNode: TableNode,
}

const edgeTypes = {
  relationship: RelationshipEdge,
}

export default function RelationshipsDesigner() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedTable, setSelectedTable] = useState(null)

  // Initialize nodes and edges from mock schema
  useMemo(() => {
    // Create nodes from tables
    const initialNodes = mockSchema.tables.map(table => ({
      id: table.id,
      type: 'tableNode',
      position: table.position,
      data: {
        name: table.name,
        fields: table.fields
      }
    }))

    // Create edges from relationships
    const initialEdges = mockSchema.relationships.map(rel => ({
      id: rel.id,
      source: rel.from,
      target: rel.to,
      type: 'relationship',
      data: { label: rel.label },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
      },
      animated: false,
    }))

    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [setNodes, setEdges])

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const onNodeClick = useCallback((event, node) => {
    setSelectedTable(node.data)
  }, [])

  // Export diagram as PNG
  const exportDiagram = useCallback(() => {
    const element = document.querySelector('.react-flow')
    if (element) {
      toPng(element, {
        backgroundColor: '#ffffff',
        width: element.offsetWidth,
        height: element.offsetHeight,
      })
        .then((dataUrl) => {
          const link = document.createElement('a')
          link.download = 'erd-diagram.png'
          link.href = dataUrl
          link.click()
        })
        .catch((err) => {
          console.error('Failed to export diagram:', err)
        })
    }
  }, [])

  // Statistics
  const stats = useMemo(() => ({
    tables: mockSchema.tables.length,
    relationships: mockSchema.relationships.length,
    fields: mockSchema.tables.reduce((sum, table) => sum + table.fields.length, 0)
  }), [])

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
              <Network className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Relationships Designer</h1>
              <p className="text-sm text-muted-foreground">
                Visual Entity Relationship Diagram (ERD)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportDiagram}>
              <Download className="h-4 w-4 mr-2" />
              Export PNG
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="px-6 pb-4 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Network className="h-3 w-3" />
              {stats.tables} Tables
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Link2 className="h-3 w-3" />
              {stats.relationships} Relationships
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Key className="h-3 w-3" />
              {stats.fields} Fields
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* ERD Canvas */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            attributionPosition="bottom-left"
            minZoom={0.1}
            maxZoom={2}
          >
            <Background color="#aaa" gap={16} />
            <Controls />
            <MiniMap
              nodeColor={(node) => {
                return '#3b82f6'
              }}
              nodeStrokeWidth={3}
              zoomable
              pannable
            />

            {/* Legend Panel */}
            <Panel position="top-right" className="bg-card border rounded-lg shadow-lg p-4 m-4">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Legend
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <Key className="h-3 w-3 text-yellow-500" />
                  <span>Primary Key</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link2 className="h-3 w-3 text-blue-500" />
                  <span>Foreign Key</span>
                </div>
                <Separator className="my-2" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-muted-foreground"></div>
                  <span>Relationship</span>
                </div>
              </div>
            </Panel>
          </ReactFlow>
        </div>

        {/* Side Panel - Table Details */}
        {selectedTable && (
          <div className="w-80 border-l bg-card/50 backdrop-blur-sm overflow-y-auto">
            <Card className="border-0 rounded-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  {selectedTable.name}
                </CardTitle>
                <CardDescription>
                  Table structure and field details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Fields ({selectedTable.fields.length})</h4>
                  <div className="space-y-2">
                    {selectedTable.fields.map((field, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center gap-2">
                            {field.primaryKey && (
                              <Key className="h-3 w-3 text-yellow-500" />
                            )}
                            {field.foreignKey && (
                              <Link2 className="h-3 w-3 text-blue-500" />
                            )}
                            <span className="font-medium text-sm">{field.name}</span>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {field.type}
                        </div>
                        {field.foreignKey && (
                          <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                            → {field.foreignKey.table}.{field.foreignKey.field}
                          </div>
                        )}
                        <div className="flex gap-1 mt-2">
                          {field.nullable === false && (
                            <Badge variant="outline" className="text-[10px] px-1 py-0">
                              NOT NULL
                            </Badge>
                          )}
                          {field.unique && (
                            <Badge variant="outline" className="text-[10px] px-1 py-0">
                              UNIQUE
                            </Badge>
                          )}
                          {field.default && (
                            <Badge variant="outline" className="text-[10px] px-1 py-0">
                              DEFAULT
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
