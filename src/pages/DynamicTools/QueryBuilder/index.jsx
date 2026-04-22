import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Workflow, RefreshCw } from 'lucide-react'
import TableSelector from './components/TableSelector'
import FieldSelector from './components/FieldSelector'
import JoinBuilder from './components/JoinBuilder'
import WhereBuilder from './components/WhereBuilder'
import SQLPreview from './components/SQLPreview'
import QueryResults from './components/QueryResults'
import { mockSchema } from '../RelationshipsDesigner/data/mockSchema'
import { mockQueryResults } from './data/mockResults'
import { generateSQL, validateQuery } from './utils/sqlGenerator'

export default function QueryBuilder() {
  const [selectedTables, setSelectedTables] = useState([])
  const [selectedFields, setSelectedFields] = useState([])
  const [joins, setJoins] = useState([])
  const [whereConditions, setWhereConditions] = useState([])
  const [groupBy, setGroupBy] = useState([])
  const [orderBy, setOrderBy] = useState([])
  const [limit, setLimit] = useState(null)
  const [generatedSQL, setGeneratedSQL] = useState('')
  const [queryValidation, setQueryValidation] = useState({ isValid: true, errors: [] })
  const [queryResults, setQueryResults] = useState(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionError, setExecutionError] = useState(null)

  const availableTables = mockSchema.tables

  // Generate SQL whenever query state changes
  useEffect(() => {
    const queryState = {
      tables: selectedTables,
      joins,
      selectedFields,
      whereConditions,
      groupBy,
      orderBy,
      limit
    }

    const sql = generateSQL(queryState)
    setGeneratedSQL(sql)

    const validation = validateQuery(queryState)
    setQueryValidation(validation)
  }, [selectedTables, joins, selectedFields, whereConditions, groupBy, orderBy, limit])

  const handleAddTable = (table) => {
    setSelectedTables([...selectedTables, table])
  }

  const handleRemoveTable = (tableName) => {
    setSelectedTables(selectedTables.filter(t => t.name !== tableName))
    // Also remove fields from this table
    setSelectedFields(selectedFields.filter(f => f.table !== tableName))
    // Remove joins involving this table
    setJoins(joins.filter(j => j.fromTable !== tableName && j.toTable !== tableName))
    // Remove conditions involving this table
    setWhereConditions(whereConditions.filter(c => c.table !== tableName))
  }

  const handleFieldToggle = (tableName, field) => {
    const fieldKey = `${tableName}.${field.name}`
    const exists = selectedFields.some(f => f.table === tableName && f.name === field.name)

    if (exists) {
      setSelectedFields(selectedFields.filter(f => !(f.table === tableName && f.name === field.name)))
    } else {
      setSelectedFields([...selectedFields, { table: tableName, name: field.name, type: field.type }])
    }
  }

  const handleAddJoin = (join) => {
    setJoins([...joins, join])
  }

  const handleRemoveJoin = (index) => {
    setJoins(joins.filter((_, i) => i !== index))
  }

  const handleUpdateJoin = (index, updatedJoin) => {
    const newJoins = [...joins]
    newJoins[index] = updatedJoin
    setJoins(newJoins)
  }

  const handleAddCondition = (condition) => {
    setWhereConditions([...whereConditions, condition])
  }

  const handleRemoveCondition = (index) => {
    setWhereConditions(whereConditions.filter((_, i) => i !== index))
  }

  const handleUpdateCondition = (index, updatedCondition) => {
    const newConditions = [...whereConditions]
    newConditions[index] = updatedCondition
    setWhereConditions(newConditions)
  }

  const handleExecuteQuery = () => {
    if (!queryValidation.isValid) {
      return
    }

    setIsExecuting(true)
    setExecutionError(null)

    // Simulate query execution
    setTimeout(() => {
      try {
        // In a real application, this would send the SQL to the backend
        setQueryResults(mockQueryResults)
        setIsExecuting(false)
      } catch (error) {
        setExecutionError(error.message)
        setIsExecuting(false)
      }
    }, 1000)
  }

  const handleReset = () => {
    setSelectedTables([])
    setSelectedFields([])
    setJoins([])
    setWhereConditions([])
    setGroupBy([])
    setOrderBy([])
    setLimit(null)
    setQueryResults(null)
    setExecutionError(null)
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
              <Workflow className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Query Builder</h1>
              <p className="text-sm text-muted-foreground">
                Visual SQL Query Designer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Table Selection */}
        <div className="w-80 border-r bg-card/50 backdrop-blur-sm">
          <ScrollArea className="h-full p-4">
            <TableSelector
              availableTables={availableTables}
              selectedTables={selectedTables}
              onAddTable={handleAddTable}
              onRemoveTable={handleRemoveTable}
            />
          </ScrollArea>
        </div>

        {/* Center - Query Builder */}
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="fields" className="h-full flex flex-col">
            <div className="border-b px-6 py-2">
              <TabsList>
                <TabsTrigger value="fields">Fields</TabsTrigger>
                <TabsTrigger value="joins">Joins</TabsTrigger>
                <TabsTrigger value="where">WHERE</TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-6 space-y-6">
                <TabsContent value="fields" className="mt-0">
                  <FieldSelector
                    selectedTables={selectedTables}
                    selectedFields={selectedFields}
                    onFieldToggle={handleFieldToggle}
                  />
                </TabsContent>

                <TabsContent value="joins" className="mt-0">
                  <JoinBuilder
                    selectedTables={selectedTables}
                    joins={joins}
                    onAddJoin={handleAddJoin}
                    onRemoveJoin={handleRemoveJoin}
                    onUpdateJoin={handleUpdateJoin}
                  />
                </TabsContent>

                <TabsContent value="where" className="mt-0">
                  <WhereBuilder
                    selectedTables={selectedTables}
                    conditions={whereConditions}
                    onAddCondition={handleAddCondition}
                    onRemoveCondition={handleRemoveCondition}
                    onUpdateCondition={handleUpdateCondition}
                  />
                </TabsContent>

                {/* SQL Preview */}
                <SQLPreview
                  sql={generatedSQL}
                  isValid={queryValidation.isValid}
                  errors={queryValidation.errors}
                  onExecute={handleExecuteQuery}
                />

                {/* Query Results */}
                <QueryResults
                  results={queryResults}
                  isLoading={isExecuting}
                  error={executionError}
                />
              </div>
            </ScrollArea>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
