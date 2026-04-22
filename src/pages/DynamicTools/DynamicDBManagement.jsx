import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast'
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';
import { Database, Table, Plus, Edit, Trash2, Search, Play, Download, Upload, RefreshCw, Filter, Eye, Code, GitBranch, Workflow, FileText, BarChart3, Layout, Type, CheckSquare, Calendar, Image as ImageIcon, Save, Clock, FileCode, Calculator } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function DynamicDBManagement() {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const handleSaveSettings = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast({ title: 'Settings Saved', description: 'Settings Saved' })
    }, 600)
  }
  const [isRefreshing, setIsRefreshing] = useState(false)
  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      toast({ title: 'Refreshed', description: 'Latest data loaded' })
    }, 800)
  }
  const [tables, setTables] = useState([
    { name: 'products', records: 1250, columns: 12, size: '2.5 MB', lastModified: '2025-10-06 10:30' },
    { name: 'orders', records: 3420, columns: 15, size: '5.8 MB', lastModified: '2025-10-06 11:45' },
    { name: 'customers', records: 890, columns: 10, size: '1.2 MB', lastModified: '2025-10-05 16:20' },
    { name: 'categories', records: 45, columns: 5, size: '128 KB', lastModified: '2025-10-04 09:15' },
    { name: 'inventory', records: 2100, columns: 8, size: '3.1 MB', lastModified: '2025-10-06 08:00' },
    { name: 'payments', records: 3200, columns: 11, size: '4.7 MB', lastModified: '2025-10-06 12:00' },
  ]);

  const [selectedTable, setSelectedTable] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [tableColumns, setTableColumns] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sqlQuery, setSqlQuery] = useState('');
  const [queryResult, setQueryResult] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tableDesignerOpen, setTableDesignerOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [addRelationshipOpen, setAddRelationshipOpen] = useState(false);
  const [editRelationshipOpen, setEditRelationshipOpen] = useState(false);
  const [deleteRelationshipOpen, setDeleteRelationshipOpen] = useState(false);
  const [selectedRelationship, setSelectedRelationship] = useState(null);
  const [relationships, setRelationships] = useState([
    { id: 1, fromTable: 'products', fromColumn: 'category_id', toTable: 'categories', toColumn: 'id', type: 'Many-to-One' },
    { id: 2, fromTable: 'orders', fromColumn: 'product_id', toTable: 'products', toColumn: 'id', type: 'Many-to-One' },
    { id: 3, fromTable: 'orders', fromColumn: 'customer_id', toTable: 'customers', toColumn: 'id', type: 'Many-to-One' },
  ]);
  const [newTableColumns, setNewTableColumns] = useState([]);
  const [editingColumn, setEditingColumn] = useState(null);
  const [columnFormOpen, setColumnFormOpen] = useState(false);
  const [deleteTableOpen, setDeleteTableOpen] = useState(false);
  const [tableToDelete, setTableToDelete] = useState(null);
  
  // Forms Builder State
  const [forms, setForms] = useState([
    { id: 1, name: 'Product Entry Form', fields: 12, created: '2025-10-05', targetTable: 'products', formFields: [], subforms: [] },
    { id: 2, name: 'Customer Registration', fields: 8, created: '2025-10-04', targetTable: 'customers', formFields: [], subforms: [] },
    { 
      id: 3, 
      name: 'Order Form', 
      fields: 15, 
      created: '2025-10-03', 
      targetTable: 'orders', 
      formFields: [],
      subforms: [
        {
          id: 1,
          name: 'Order Items',
          targetTable: 'order_items',
          linkField: 'order_id',
          parentField: 'id',
          fields: ['product_id', 'quantity', 'price', 'subtotal'],
          displayType: 'table'
        }
      ]
    },
  ]);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [deleteFormOpen, setDeleteFormOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState(null);
  const [currentFormName, setCurrentFormName] = useState('');
  const [currentFormTable, setCurrentFormTable] = useState('');
  const [formFields, setFormFields] = useState([]);
  
  // Subforms State (NEW FEATURE)
  const [subformDialogOpen, setSubformDialogOpen] = useState(false);
  const [selectedSubform, setSelectedSubform] = useState(null);
  const [currentSubformName, setCurrentSubformName] = useState('');
  const [currentSubformTable, setCurrentSubformTable] = useState('');
  const [currentSubformLinkField, setCurrentSubformLinkField] = useState('');
  const [currentSubformParentField, setCurrentSubformParentField] = useState('');
  const [currentSubformFields, setCurrentSubformFields] = useState([]);
  const [currentSubformDisplayType, setCurrentSubformDisplayType] = useState('table');
  const [editingFormForSubform, setEditingFormForSubform] = useState(null);
  
  // Reports Builder State
  const [reports, setReports] = useState([
    { id: 1, name: 'Sales Summary', type: 'Table', created: '2025-10-05', dataSource: 'orders', subreports: [] },
    { id: 2, name: 'Monthly Revenue', type: 'Chart', created: '2025-10-04', dataSource: 'payments', subreports: [] },
    { 
      id: 3, 
      name: 'Customer Analytics', 
      type: 'Dashboard', 
      created: '2025-10-03', 
      dataSource: 'customers',
      subreports: [
        {
          id: 1,
          name: 'Customer Orders',
          dataSource: 'orders',
          linkField: 'customer_id',
          parentField: 'id',
          displayType: 'table',
          aggregations: ['count', 'sum:total']
        }
      ]
    },
  ]);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [deleteReportOpen, setDeleteReportOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [currentReportName, setCurrentReportName] = useState('');
  const [currentReportSource, setCurrentReportSource] = useState('');
  const [currentReportType, setCurrentReportType] = useState('');
  
  // Subreports State (NEW FEATURE)
  const [subreportDialogOpen, setSubreportDialogOpen] = useState(false);
  const [selectedSubreport, setSelectedSubreport] = useState(null);
  const [currentSubreportName, setCurrentSubreportName] = useState('');
  const [currentSubreportSource, setCurrentSubreportSource] = useState('');
  const [currentSubreportLinkField, setCurrentSubreportLinkField] = useState('');
  const [currentSubreportParentField, setCurrentSubreportParentField] = useState('');
  const [currentSubreportDisplayType, setCurrentSubreportDisplayType] = useState('table');
  const [currentSubreportAggregations, setCurrentSubreportAggregations] = useState([]);
  const [editingReportForSubreport, setEditingReportForSubreport] = useState(null);
  
  // Macros State
  const [macros, setMacros] = useState([
    { id: 1, name: 'Auto Update Inventory', trigger: 'OnOrderComplete', actions: 3, created: '2025-10-05', enabled: true },
    { id: 2, name: 'Send Welcome Email', trigger: 'OnCustomerCreate', actions: 2, created: '2025-10-04', enabled: true },
    { id: 3, name: 'Calculate Discount', trigger: 'OnPriceChange', actions: 4, created: '2025-10-03', enabled: false },
  ]);
  const [macroDialogOpen, setMacroDialogOpen] = useState(false);
  const [selectedMacro, setSelectedMacro] = useState(null);
  const [deleteMacroOpen, setDeleteMacroOpen] = useState(false);
  const [macroToDelete, setMacroToDelete] = useState(null);
  const [currentMacroName, setCurrentMacroName] = useState('');
  const [currentMacroTrigger, setCurrentMacroTrigger] = useState('');
  const [macroActions, setMacroActions] = useState([]);
  
  // Modules (VBA) State
  const [modules, setModules] = useState([
    { id: 1, name: 'CalculateTax', type: 'Function', code: 'function calculateTax(amount) {\n  return amount * 0.07;\n}', created: '2025-10-05' },
    { id: 2, name: 'ValidateEmail', type: 'Function', code: 'function validateEmail(email) {\n  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);\n}', created: '2025-10-04' },
    { id: 3, name: 'OrderProcessor', type: 'Module', code: '// Order processing logic\nfunction processOrder(order) {\n  // Implementation\n}', created: '2025-10-03' },
  ]);
  const [moduleDialogOpen, setModuleDialogOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [deleteModuleOpen, setDeleteModuleOpen] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState(null);
  const [currentModuleName, setCurrentModuleName] = useState('');
  const [currentModuleType, setCurrentModuleType] = useState('');
  const [currentModuleCode, setCurrentModuleCode] = useState('');

  // Data Validation State
  const [validationRules, setValidationRules] = useState([
    { id: 1, table: 'products', field: 'price', rule: 'price > 0', message: 'Price must be greater than 0', created: '2025-10-05' },
    { id: 2, table: 'customers', field: 'email', rule: 'LIKE "%@%"', message: 'Email must contain @', created: '2025-10-04' },
    { id: 3, table: 'orders', field: 'quantity', rule: 'quantity >= 1', message: 'Quantity must be at least 1', created: '2025-10-03' },
  ]);
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);
  const [selectedValidation, setSelectedValidation] = useState(null);
  const [deleteValidationOpen, setDeleteValidationOpen] = useState(false);
  const [validationToDelete, setValidationToDelete] = useState(null);
  const [currentValidationTable, setCurrentValidationTable] = useState('');
  const [currentValidationField, setCurrentValidationField] = useState('');
  const [currentValidationRule, setCurrentValidationRule] = useState('');
  const [currentValidationMessage, setCurrentValidationMessage] = useState('');

  // Expression Builder State (NEW FEATURE)
  const [calculatedFields, setCalculatedFields] = useState([
    { 
      id: 1, 
      table: 'orders', 
      fieldName: 'total_with_tax', 
      expression: '[subtotal] * 1.07', 
      dataType: 'decimal',
      description: 'Total including 7% tax',
      created: '2025-10-05' 
    },
    { 
      id: 2, 
      table: 'products', 
      fieldName: 'profit_margin', 
      expression: '([price] - [cost]) / [price] * 100', 
      dataType: 'decimal',
      description: 'Profit margin percentage',
      created: '2025-10-04' 
    },
    { 
      id: 3, 
      table: 'customers', 
      fieldName: 'full_name', 
      expression: '[first_name] & " " & [last_name]', 
      dataType: 'text',
      description: 'Concatenated full name',
      created: '2025-10-03' 
    },
  ]);
  const [expressionDialogOpen, setExpressionDialogOpen] = useState(false);
  const [selectedExpression, setSelectedExpression] = useState(null);
  const [deleteExpressionOpen, setDeleteExpressionOpen] = useState(false);
  const [expressionToDelete, setExpressionToDelete] = useState(null);
  const [currentExpressionTable, setCurrentExpressionTable] = useState('');
  const [currentExpressionFieldName, setCurrentExpressionFieldName] = useState('');
  const [currentExpressionFormula, setCurrentExpressionFormula] = useState('');
  const [currentExpressionDataType, setCurrentExpressionDataType] = useState('text');
  const [currentExpressionDescription, setCurrentExpressionDescription] = useState('');
  const [expressionBuilderMode, setExpressionBuilderMode] = useState('visual'); // 'visual' or 'text'

  // Pivot Tables State (NEW FEATURE)
  const [pivotTables, setPivotTables] = useState([
    {
      id: 1,
      name: 'Sales by Category and Month',
      dataSource: 'sales',
      rowFields: ['category'],
      columnFields: ['month'],
      valueFields: [{ field: 'amount', aggregation: 'sum' }],
      filters: [],
      created: '2025-10-07'
    },
    {
      id: 2,
      name: 'Product Performance',
      dataSource: 'products',
      rowFields: ['category', 'brand'],
      columnFields: ['quarter'],
      valueFields: [
        { field: 'sales', aggregation: 'sum' },
        { field: 'quantity', aggregation: 'count' }
      ],
      filters: [],
      created: '2025-10-06'
    }
  ]);
  const [pivotDialogOpen, setPivotDialogOpen] = useState(false);
  const [selectedPivot, setSelectedPivot] = useState(null);
  const [deletePivotOpen, setDeletePivotOpen] = useState(false);
  const [pivotToDelete, setPivotToDelete] = useState(null);
  const [currentPivotName, setCurrentPivotName] = useState('');
  const [currentPivotSource, setCurrentPivotSource] = useState('');
  const [currentPivotRowFields, setCurrentPivotRowFields] = useState([]);
  const [currentPivotColumnFields, setCurrentPivotColumnFields] = useState([]);
  const [currentPivotValueFields, setCurrentPivotValueFields] = useState([]);
  const [currentPivotFilters, setCurrentPivotFilters] = useState([]);
  const [pivotPreviewOpen, setPivotPreviewOpen] = useState(false);
  const [pivotToPreview, setPivotToPreview] = useState(null);

  // Navigation & Switchboard State
  const [switchboards, setSwitchboards] = useState([
    { id: 1, name: 'Main Menu', items: 6, created: '2025-10-05', isDefault: true },
    { id: 2, name: 'Admin Panel', items: 4, created: '2025-10-04', isDefault: false },
    { id: 3, name: 'Reports Dashboard', items: 8, created: '2025-10-03', isDefault: false },
  ]);
  const [switchboardDialogOpen, setSwitchboardDialogOpen] = useState(false);
  const [selectedSwitchboard, setSelectedSwitchboard] = useState(null);
  const [deleteSwitchboardOpen, setDeleteSwitchboardOpen] = useState(false);
  const [switchboardToDelete, setSwitchboardToDelete] = useState(null);
  const [currentSwitchboardName, setCurrentSwitchboardName] = useState('');
  const [switchboardItems, setSwitchboardItems] = useState([]);

  // SQL Editor State (Enhanced)
  const [queryHistory, setQueryHistory] = useState([
    { id: 1, query: 'SELECT * FROM products WHERE price > 100', timestamp: '2025-10-06 14:30', executionTime: '0.023s' },
    { id: 2, query: 'SELECT COUNT(*) FROM orders WHERE status = "completed"', timestamp: '2025-10-06 14:25', executionTime: '0.015s' },
    { id: 3, query: 'SELECT * FROM customers ORDER BY created_at DESC LIMIT 10', timestamp: '2025-10-06 14:20', executionTime: '0.018s' },
  ]);
  const [savedQueries, setSavedQueries] = useState([
    { id: 1, name: 'High Value Products', query: 'SELECT * FROM products WHERE price > 500 ORDER BY price DESC', created: '2025-10-05' },
    { id: 2, name: 'Recent Orders', query: 'SELECT * FROM orders WHERE created_at > DATE_SUB(NOW(), INTERVAL 7 DAY)', created: '2025-10-04' },
    { id: 3, name: 'Active Customers', query: 'SELECT * FROM customers WHERE status = "active"', created: '2025-10-03' },
  ]);
  const [saveQueryDialogOpen, setSaveQueryDialogOpen] = useState(false);
  const [currentQueryName, setCurrentQueryName] = useState('');
  const [deleteSavedQueryOpen, setDeleteSavedQueryOpen] = useState(false);
  const [queryToDelete, setQueryToDelete] = useState(null);

  // Parameter Queries State (NEW FEATURE)
  const [parameterQueries, setParameterQueries] = useState([
    { 
      id: 1, 
      name: 'Products by Price Range', 
      query: 'SELECT * FROM products WHERE price >= :minPrice AND price <= :maxPrice',
      parameters: [
        { name: 'minPrice', type: 'number', defaultValue: 0, description: 'Minimum price' },
        { name: 'maxPrice', type: 'number', defaultValue: 1000, description: 'Maximum price' }
      ],
      created: '2025-10-05'
    },
    { 
      id: 2, 
      name: 'Orders by Date', 
      query: 'SELECT * FROM orders WHERE created_at BETWEEN :startDate AND :endDate',
      parameters: [
        { name: 'startDate', type: 'date', defaultValue: '2025-01-01', description: 'Start date' },
        { name: 'endDate', type: 'date', defaultValue: '2025-12-31', description: 'End date' }
      ],
      created: '2025-10-04'
    },
    { 
      id: 3, 
      name: 'Search Customers', 
      query: 'SELECT * FROM customers WHERE name LIKE :searchTerm',
      parameters: [
        { name: 'searchTerm', type: 'text', defaultValue: '%', description: 'Search term (use % for wildcard)' }
      ],
      created: '2025-10-03'
    },
  ]);
  const [paramQueryDialogOpen, setParamQueryDialogOpen] = useState(false);
  const [selectedParamQuery, setSelectedParamQuery] = useState(null);
  const [deleteParamQueryOpen, setDeleteParamQueryOpen] = useState(false);
  const [paramQueryToDelete, setParamQueryToDelete] = useState(null);
  const [currentParamQueryName, setCurrentParamQueryName] = useState('');
  const [currentParamQuerySQL, setCurrentParamQuerySQL] = useState('');
  const [currentParameters, setCurrentParameters] = useState([]);
  const [executeParamQueryOpen, setExecuteParamQueryOpen] = useState(false);
  const [paramQueryToExecute, setParamQueryToExecute] = useState(null);
  const [parameterValues, setParameterValues] = useState({});

  // Mock data for products table
  const mockProductsData = [
    { id: 1, name: 'Laptop Pro 15"', category: 'Electronics', price: 1299.99, stock: 45, status: 'Active' },
    { id: 2, name: 'Wireless Mouse', category: 'Accessories', price: 29.99, stock: 230, status: 'Active' },
    { id: 3, name: 'USB-C Cable', category: 'Accessories', price: 12.99, stock: 450, status: 'Active' },
    { id: 4, name: 'Monitor 27"', category: 'Electronics', price: 349.99, stock: 78, status: 'Active' },
    { id: 5, name: 'Keyboard Mechanical', category: 'Accessories', price: 89.99, stock: 120, status: 'Active' },
  ];

  const mockProductsColumns = [
    { name: 'id', type: 'INTEGER', nullable: false, primaryKey: true },
    { name: 'name', type: 'VARCHAR(255)', nullable: false, primaryKey: false },
    { name: 'category', type: 'VARCHAR(100)', nullable: false, primaryKey: false },
    { name: 'price', type: 'DECIMAL(10,2)', nullable: false, primaryKey: false },
    { name: 'stock', type: 'INTEGER', nullable: false, primaryKey: false },
    { name: 'status', type: 'VARCHAR(50)', nullable: false, primaryKey: false },
  ];

  const handleTableSelect = (tableName) => {
    setSelectedTable(tableName);
    // Mock loading data
    if (tableName === 'products') {
      setTableData(mockProductsData);
      setTableColumns(mockProductsColumns);
    } else {
      setTableData([]);
      setTableColumns([]);
    }
    setSearchQuery('');
  };

  const handleCreateRecord = () => {
    setSelectedRecord(null);
    setCreateDialogOpen(true);
  };

  const handleEditRecord = (record) => {
    setSelectedRecord(record);
    setEditDialogOpen(true);
  };

  const handleDeleteRecord = (record) => {
    setRecordToDelete(record);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteRecord = () => {
    if (recordToDelete) {
      setTableData(tableData.filter(r => r.id !== recordToDelete.id));
      setDeleteDialogOpen(false);
      setRecordToDelete(null);
    }
  };

  const handleSaveRecord = () => {
    // Mock save
    setEditDialogOpen(false);
    setCreateDialogOpen(false);
  };

  const handleRunQuery = () => {
    // Mock query execution
    const executionTime = (Math.random() * 0.05 + 0.01).toFixed(3) + 's';
    setQueryResult({
      success: true,
      rowsAffected: 5,
      executionTime: executionTime,
      data: mockProductsData.slice(0, 3)
    });
    
    // Add to query history
    const newHistoryItem = {
      id: queryHistory.length + 1,
      query: sqlQuery,
      timestamp: new Date().toLocaleString('en-US', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      executionTime: executionTime
    };
    setQueryHistory([newHistoryItem, ...queryHistory].slice(0, 20)); // Keep last 20 queries
  };

  // SQL Editor handlers
  const handleSaveQuery = () => {
    if (!currentQueryName.trim()) {
      alert('Please enter a query name');
      return;
    }
    const newQuery = {
      id: savedQueries.length + 1,
      name: currentQueryName,
      query: sqlQuery,
      created: new Date().toISOString().split('T')[0]
    };
    setSavedQueries([...savedQueries, newQuery]);
    setSaveQueryDialogOpen(false);
    setCurrentQueryName('');
  };

  const handleLoadSavedQuery = (query) => {
    setSqlQuery(query.query);
  };

  const handleDeleteSavedQuery = (query) => {
    setQueryToDelete(query);
    setDeleteSavedQueryOpen(true);
  };

  const confirmDeleteSavedQuery = () => {
    if (queryToDelete) {
      setSavedQueries(savedQueries.filter(q => q.id !== queryToDelete.id));
      setDeleteSavedQueryOpen(false);
      setQueryToDelete(null);
    }
  };

  const handleLoadFromHistory = (historyItem) => {
    setSqlQuery(historyItem.query);
  };

  // Parameter Queries handlers
  const handleCreateParamQuery = () => {
    setSelectedParamQuery(null);
    setCurrentParamQueryName('');
    setCurrentParamQuerySQL('');
    setCurrentParameters([]);
    setParamQueryDialogOpen(true);
  };

  const handleEditParamQuery = (query) => {
    setSelectedParamQuery(query);
    setCurrentParamQueryName(query.name);
    setCurrentParamQuerySQL(query.query);
    setCurrentParameters(query.parameters);
    setParamQueryDialogOpen(true);
  };

  const handleDeleteParamQuery = (query) => {
    setParamQueryToDelete(query);
    setDeleteParamQueryOpen(true);
  };

  const confirmDeleteParamQuery = () => {
    if (paramQueryToDelete) {
      setParameterQueries(parameterQueries.filter(q => q.id !== paramQueryToDelete.id));
      setDeleteParamQueryOpen(false);
      setParamQueryToDelete(null);
    }
  };

  const handleSaveParamQuery = () => {
    if (!currentParamQueryName.trim()) {
      alert('Please enter a query name');
      return;
    }
    if (!currentParamQuerySQL.trim()) {
      alert('Please enter a SQL query');
      return;
    }
    
    if (selectedParamQuery) {
      // Update existing
      setParameterQueries(parameterQueries.map(q => 
        q.id === selectedParamQuery.id 
          ? { ...q, name: currentParamQueryName, query: currentParamQuerySQL, parameters: currentParameters }
          : q
      ));
    } else {
      // Create new
      const newQuery = {
        id: parameterQueries.length + 1,
        name: currentParamQueryName,
        query: currentParamQuerySQL,
        parameters: currentParameters,
        created: new Date().toISOString().split('T')[0]
      };
      setParameterQueries([...parameterQueries, newQuery]);
    }
    setParamQueryDialogOpen(false);
  };

  const handleAddParameter = () => {
    const newParam = {
      name: `param${currentParameters.length + 1}`,
      type: 'text',
      defaultValue: '',
      description: ''
    };
    setCurrentParameters([...currentParameters, newParam]);
  };

  const handleRemoveParameter = (index) => {
    setCurrentParameters(currentParameters.filter((_, i) => i !== index));
  };

  const handleUpdateParameter = (index, field, value) => {
    const updated = [...currentParameters];
    updated[index] = { ...updated[index], [field]: value };
    setCurrentParameters(updated);
  };

  const handleExecuteParamQuery = (query) => {
    setParamQueryToExecute(query);
    // Initialize parameter values with defaults
    const initialValues = {};
    query.parameters.forEach(param => {
      initialValues[param.name] = param.defaultValue;
    });
    setParameterValues(initialValues);
    setExecuteParamQueryOpen(true);
  };

  const handleRunParamQuery = () => {
    // Replace parameters in query with actual values
    let finalQuery = paramQueryToExecute.query;
    Object.keys(parameterValues).forEach(paramName => {
      const value = parameterValues[paramName];
      const param = paramQueryToExecute.parameters.find(p => p.name === paramName);
      
      // Format value based on type
      let formattedValue = value;
      if (param.type === 'text') {
        formattedValue = `'${value}'`;
      }
      
      finalQuery = finalQuery.replace(new RegExp(`:${paramName}`, 'g'), formattedValue);
    });
    
    setSqlQuery(finalQuery);
    setExecuteParamQueryOpen(false);
    
    // Execute the query
    setTimeout(() => {
      handleRunQuery();
    }, 100);
  };

  const handleExportTable = () => {
    alert('Exporting table data...');
  };

  const handleImportTable = () => {
    alert('Import table data...');
  };

  const handleAddRelationship = () => {
    setSelectedRelationship(null);
    setAddRelationshipOpen(true);
  };

  const handleEditRelationship = (relationship) => {
    setSelectedRelationship(relationship);
    setEditRelationshipOpen(true);
  };

  const handleDeleteRelationship = (relationship) => {
    setSelectedRelationship(relationship);
    setDeleteRelationshipOpen(true);
  };

  const confirmDeleteRelationship = () => {
    if (selectedRelationship) {
      setRelationships(relationships.filter(r => r.id !== selectedRelationship.id));
      setDeleteRelationshipOpen(false);
      setSelectedRelationship(null);
    }
  };

  const handleSaveRelationship = () => {
    // Mock save
    setAddRelationshipOpen(false);
    setEditRelationshipOpen(false);
    setSelectedRelationship(null);
  };

  const handleAddColumn = () => {
    setEditingColumn(null);
    setColumnFormOpen(true);
  };

  const handleEditColumn = (column) => {
    setEditingColumn(column);
    setColumnFormOpen(true);
  };

  const handleDeleteColumn = (columnId) => {
    setNewTableColumns(newTableColumns.filter(c => c.id !== columnId));
  };

  const handleSaveColumn = (columnData) => {
    if (editingColumn) {
      // Edit existing column
      setNewTableColumns(newTableColumns.map(c => 
        c.id === editingColumn.id ? { ...columnData, id: editingColumn.id } : c
      ));
    } else {
      // Add new column
      setNewTableColumns([...newTableColumns, { ...columnData, id: Date.now() }]);
    }
    setColumnFormOpen(false);
    setEditingColumn(null);
  };

  const handleSaveTable = () => {
    // Mock save table
    alert('Table saved successfully!');
    setTableDesignerOpen(false);
    setNewTableColumns([]);
  };

  const handleEditTable = (tableName) => {
    // Mock: Load table structure
    const mockColumns = [
      { id: 1, name: 'id', dataType: 'INTEGER', length: '', primaryKey: true, nullable: false, unique: true, autoIncrement: true, defaultValue: '' },
      { id: 2, name: 'name', dataType: 'VARCHAR', length: '255', primaryKey: false, nullable: false, unique: false, autoIncrement: false, defaultValue: '' },
      { id: 3, name: 'created_at', dataType: 'TIMESTAMP', length: '', primaryKey: false, nullable: true, unique: false, autoIncrement: false, defaultValue: 'CURRENT_TIMESTAMP' },
    ];
    setSelectedTable(tableName);
    setNewTableColumns(mockColumns);
    setTableDesignerOpen(true);
  };

  const handleDeleteTable = (table) => {
    setTableToDelete(table);
    setDeleteTableOpen(true);
  };

  const confirmDeleteTable = () => {
    if (tableToDelete) {
      setTables(tables.filter(t => t.name !== tableToDelete.name));
      if (selectedTable === tableToDelete.name) {
        setSelectedTable(null);
        setTableData([]);
      }
      setDeleteTableOpen(false);
      setTableToDelete(null);
    }
  };

  // Forms Builder Handlers
  const handleCreateForm = () => {
    setSelectedForm(null);
    setCurrentFormName('');
    setCurrentFormTable('');
    setFormFields([]);
    setFormDialogOpen(true);
  };

  const handleEditForm = (form) => {
    setSelectedForm(form);
    setCurrentFormName(form.name);
    setCurrentFormTable(form.targetTable);
    setFormFields(form.formFields || []);
    setFormDialogOpen(true);
  };

  const handleDeleteForm = (form) => {
    setFormToDelete(form);
    setDeleteFormOpen(true);
  };

  const confirmDeleteForm = () => {
    if (formToDelete) {
      setForms(forms.filter(f => f.id !== formToDelete.id));
      setDeleteFormOpen(false);
      setFormToDelete(null);
    }
  };

  const handleSaveForm = () => {
    if (!currentFormName || !currentFormTable) {
      alert('Please fill in form name and target table');
      return;
    }

    if (selectedForm) {
      // Update existing form
      setForms(forms.map(f => 
        f.id === selectedForm.id 
          ? { ...f, name: currentFormName, targetTable: currentFormTable, formFields: formFields, fields: formFields.length }
          : f
      ));
    } else {
      // Create new form
      const newForm = {
        id: Date.now(),
        name: currentFormName,
        targetTable: currentFormTable,
        formFields: formFields,
        fields: formFields.length,
        created: new Date().toISOString().split('T')[0]
      };
      setForms([...forms, newForm]);
    }
    
    setFormDialogOpen(false);
    setCurrentFormName('');
    setCurrentFormTable('');
    setFormFields([]);
  };

  const handleAddFormField = (fieldType) => {
    const newField = {
      id: Date.now(),
      type: fieldType,
      label: `Field ${formFields.length + 1}`,
      required: false
    };
    setFormFields([...formFields, newField]);
  };

  const handleRemoveFormField = (fieldId) => {
    setFormFields(formFields.filter(f => f.id !== fieldId));
  };

  // Reports Builder Handlers
  const handleCreateReport = () => {
    setSelectedReport(null);
    setCurrentReportName('');
    setCurrentReportSource('');
    setCurrentReportType('');
    setReportDialogOpen(true);
  };

  const handleEditReport = (report) => {
    setSelectedReport(report);
    setCurrentReportName(report.name);
    setCurrentReportSource(report.dataSource);
    setCurrentReportType(report.type);
    setReportDialogOpen(true);
  };

  const handleDeleteReport = (report) => {
    setReportToDelete(report);
    setDeleteReportOpen(true);
  };

  const confirmDeleteReport = () => {
    if (reportToDelete) {
      setReports(reports.filter(r => r.id !== reportToDelete.id));
      setDeleteReportOpen(false);
      setReportToDelete(null);
    }
  };

  const handleSaveReport = () => {
    if (!currentReportName || !currentReportSource || !currentReportType) {
      alert('Please fill in all report fields');
      return;
    }

    if (selectedReport) {
      // Update existing report
      setReports(reports.map(r => 
        r.id === selectedReport.id 
          ? { ...r, name: currentReportName, dataSource: currentReportSource, type: currentReportType }
          : r
      ));
    } else {
      // Create new report
      const newReport = {
        id: Date.now(),
        name: currentReportName,
        dataSource: currentReportSource,
        type: currentReportType,
        created: new Date().toISOString().split('T')[0]
      };
      setReports([...reports, newReport]);
    }
    
    setReportDialogOpen(false);
    setCurrentReportName('');
    setCurrentReportSource('');
    setCurrentReportType('');
  };

  // Macros Handlers
  const handleCreateMacro = () => {
    setSelectedMacro(null);
    setCurrentMacroName('');
    setCurrentMacroTrigger('');
    setMacroActions([]);
    setMacroDialogOpen(true);
  };

  const handleEditMacro = (macro) => {
    setSelectedMacro(macro);
    setCurrentMacroName(macro.name);
    setCurrentMacroTrigger(macro.trigger);
    setMacroActions(macro.actionsList || []);
    setMacroDialogOpen(true);
  };

  const handleDeleteMacro = (macro) => {
    setMacroToDelete(macro);
    setDeleteMacroOpen(true);
  };

  const confirmDeleteMacro = () => {
    if (macroToDelete) {
      setMacros(macros.filter(m => m.id !== macroToDelete.id));
      setDeleteMacroOpen(false);
      setMacroToDelete(null);
    }
  };

  const handleSaveMacro = () => {
    if (!currentMacroName || !currentMacroTrigger) {
      alert('Please fill in macro name and trigger');
      return;
    }

    if (selectedMacro) {
      // Update existing macro
      setMacros(macros.map(m => 
        m.id === selectedMacro.id 
          ? { ...m, name: currentMacroName, trigger: currentMacroTrigger, actionsList: macroActions, actions: macroActions.length }
          : m
      ));
    } else {
      // Create new macro
      const newMacro = {
        id: Date.now(),
        name: currentMacroName,
        trigger: currentMacroTrigger,
        actionsList: macroActions,
        actions: macroActions.length,
        created: new Date().toISOString().split('T')[0],
        enabled: true
      };
      setMacros([...macros, newMacro]);
    }
    
    setMacroDialogOpen(false);
    setCurrentMacroName('');
    setCurrentMacroTrigger('');
    setMacroActions([]);
  };

  const handleAddMacroAction = (actionType) => {
    const newAction = {
      id: Date.now(),
      type: actionType,
      description: `Action ${macroActions.length + 1}`
    };
    setMacroActions([...macroActions, newAction]);
  };

  const handleRemoveMacroAction = (actionId) => {
    setMacroActions(macroActions.filter(a => a.id !== actionId));
  };

  const handleToggleMacro = (macroId) => {
    setMacros(macros.map(m => 
      m.id === macroId ? { ...m, enabled: !m.enabled } : m
    ));
  };

  // Modules Handlers
  const handleCreateModule = () => {
    setSelectedModule(null);
    setCurrentModuleName('');
    setCurrentModuleType('Function');
    setCurrentModuleCode('// Write your code here\nfunction myFunction() {\n  \n}');
    setModuleDialogOpen(true);
  };

  const handleEditModule = (module) => {
    setSelectedModule(module);
    setCurrentModuleName(module.name);
    setCurrentModuleType(module.type);
    setCurrentModuleCode(module.code);
    setModuleDialogOpen(true);
  };

  const handleDeleteModule = (module) => {
    setModuleToDelete(module);
    setDeleteModuleOpen(true);
  };

  const confirmDeleteModule = () => {
    if (moduleToDelete) {
      setModules(modules.filter(m => m.id !== moduleToDelete.id));
      setDeleteModuleOpen(false);
      setModuleToDelete(null);
    }
  };

  const handleSaveModule = () => {
    if (!currentModuleName || !currentModuleCode) {
      alert('Please fill in module name and code');
      return;
    }

    if (selectedModule) {
      // Update existing module
      setModules(modules.map(m => 
        m.id === selectedModule.id 
          ? { ...m, name: currentModuleName, type: currentModuleType, code: currentModuleCode }
          : m
      ));
    } else {
      // Create new module
      const newModule = {
        id: Date.now(),
        name: currentModuleName,
        type: currentModuleType,
        code: currentModuleCode,
        created: new Date().toISOString().split('T')[0]
      };
      setModules([...modules, newModule]);
    }
    
    setModuleDialogOpen(false);
    setCurrentModuleName('');
    setCurrentModuleType('');
    setCurrentModuleCode('');
  };

  const handleRunModule = (module) => {
    try {
      // eslint-disable-next-line no-eval
      eval(module.code);
      alert(`Module "${module.name}" executed successfully!`);
    } catch (error) {
      alert(`Error running module: ${error.message}`);
    }
  };

  // Data Validation Handlers
  const handleCreateValidation = () => {
    setSelectedValidation(null);
    setCurrentValidationTable('');
    setCurrentValidationField('');
    setCurrentValidationRule('');
    setCurrentValidationMessage('');
    setValidationDialogOpen(true);
  };

  const handleEditValidation = (validation) => {
    setSelectedValidation(validation);
    setCurrentValidationTable(validation.table);
    setCurrentValidationField(validation.field);
    setCurrentValidationRule(validation.rule);
    setCurrentValidationMessage(validation.message);
    setValidationDialogOpen(true);
  };

  const handleDeleteValidation = (validation) => {
    setValidationToDelete(validation);
    setDeleteValidationOpen(true);
  };

  const confirmDeleteValidation = () => {
    if (validationToDelete) {
      setValidationRules(validationRules.filter(v => v.id !== validationToDelete.id));
      setDeleteValidationOpen(false);
      setValidationToDelete(null);
    }
  };

  const handleSaveValidation = () => {
    if (!currentValidationTable || !currentValidationField || !currentValidationRule) {
      alert('Please fill in all required fields');
      return;
    }

    if (selectedValidation) {
      // Update existing validation
      setValidationRules(validationRules.map(v => 
        v.id === selectedValidation.id 
          ? { ...v, table: currentValidationTable, field: currentValidationField, rule: currentValidationRule, message: currentValidationMessage }
          : v
      ));
    } else {
      // Create new validation
      const newValidation = {
        id: Date.now(),
        table: currentValidationTable,
        field: currentValidationField,
        rule: currentValidationRule,
        message: currentValidationMessage,
        created: new Date().toISOString().split('T')[0]
      };
      setValidationRules([...validationRules, newValidation]);
    }
    
    setValidationDialogOpen(false);
    setCurrentValidationTable('');
    setCurrentValidationField('');
    setCurrentValidationRule('');
    setCurrentValidationMessage('');
  };

  // Switchboard Handlers
  const handleCreateSwitchboard = () => {
    setSelectedSwitchboard(null);
    setCurrentSwitchboardName('');
    setSwitchboardItems([]);
    setSwitchboardDialogOpen(true);
  };

  const handleEditSwitchboard = (switchboard) => {
    setSelectedSwitchboard(switchboard);
    setCurrentSwitchboardName(switchboard.name);
    setSwitchboardItems(switchboard.switchboardItems || []);
    setSwitchboardDialogOpen(true);
  };

  const handleDeleteSwitchboard = (switchboard) => {
    setSwitchboardToDelete(switchboard);
    setDeleteSwitchboardOpen(true);
  };

  const confirmDeleteSwitchboard = () => {
    if (switchboardToDelete) {
      setSwitchboards(switchboards.filter(s => s.id !== switchboardToDelete.id));
      setDeleteSwitchboardOpen(false);
      setSwitchboardToDelete(null);
    }
  };

  const handleSaveSwitchboard = () => {
    if (!currentSwitchboardName) {
      alert('Please enter switchboard name');
      return;
    }

    if (selectedSwitchboard) {
      // Update existing switchboard
      setSwitchboards(switchboards.map(s => 
        s.id === selectedSwitchboard.id 
          ? { ...s, name: currentSwitchboardName, items: switchboardItems.length, switchboardItems }
          : s
      ));
    } else {
      // Create new switchboard
      const newSwitchboard = {
        id: Date.now(),
        name: currentSwitchboardName,
        items: switchboardItems.length,
        created: new Date().toISOString().split('T')[0],
        isDefault: false,
        switchboardItems
      };
      setSwitchboards([...switchboards, newSwitchboard]);
    }
    
    setSwitchboardDialogOpen(false);
    setCurrentSwitchboardName('');
    setSwitchboardItems([]);
  };

  const handleAddSwitchboardItem = (type) => {
    const newItem = {
      id: Date.now(),
      type: type,
      label: `New ${type}`,
      target: ''
    };
    setSwitchboardItems([...switchboardItems, newItem]);
  };

  const handleRemoveSwitchboardItem = (id) => {
    setSwitchboardItems(switchboardItems.filter(item => item.id !== id));
  };

  // Subforms Handlers (NEW FEATURE)
  const handleAddSubform = (form) => {
    setEditingFormForSubform(form);
    setSelectedSubform(null);
    setCurrentSubformName('');
    setCurrentSubformTable('');
    setCurrentSubformLinkField('');
    setCurrentSubformParentField('');
    setCurrentSubformFields([]);
    setCurrentSubformDisplayType('table');
    setSubformDialogOpen(true);
  };

  const handleEditSubform = (form, subform) => {
    setEditingFormForSubform(form);
    setSelectedSubform(subform);
    setCurrentSubformName(subform.name);
    setCurrentSubformTable(subform.targetTable);
    setCurrentSubformLinkField(subform.linkField);
    setCurrentSubformParentField(subform.parentField);
    setCurrentSubformFields(subform.fields);
    setCurrentSubformDisplayType(subform.displayType);
    setSubformDialogOpen(true);
  };

  const handleDeleteSubform = (form, subformId) => {
    setForms(forms.map(f => 
      f.id === form.id 
        ? { ...f, subforms: f.subforms.filter(sf => sf.id !== subformId) }
        : f
    ));
  };

  const handleSaveSubform = () => {
    if (!currentSubformName || !currentSubformTable || !currentSubformLinkField || !currentSubformParentField) {
      alert('Please fill in all required fields');
      return;
    }

    const subformData = {
      id: selectedSubform ? selectedSubform.id : Date.now(),
      name: currentSubformName,
      targetTable: currentSubformTable,
      linkField: currentSubformLinkField,
      parentField: currentSubformParentField,
      fields: currentSubformFields,
      displayType: currentSubformDisplayType
    };

    setForms(forms.map(f => {
      if (f.id === editingFormForSubform.id) {
        if (selectedSubform) {
          // Update existing subform
          return { ...f, subforms: f.subforms.map(sf => sf.id === selectedSubform.id ? subformData : sf) };
        } else {
          // Add new subform
          return { ...f, subforms: [...(f.subforms || []), subformData] };
        }
      }
      return f;
    }));

    setSubformDialogOpen(false);
  };

  // Subreports Handlers (NEW FEATURE)
  const handleAddSubreport = (report) => {
    setEditingReportForSubreport(report);
    setSelectedSubreport(null);
    setCurrentSubreportName('');
    setCurrentSubreportSource('');
    setCurrentSubreportLinkField('');
    setCurrentSubreportParentField('');
    setCurrentSubreportDisplayType('table');
    setCurrentSubreportAggregations([]);
    setSubreportDialogOpen(true);
  };

  const handleEditSubreport = (report, subreport) => {
    setEditingReportForSubreport(report);
    setSelectedSubreport(subreport);
    setCurrentSubreportName(subreport.name);
    setCurrentSubreportSource(subreport.dataSource);
    setCurrentSubreportLinkField(subreport.linkField);
    setCurrentSubreportParentField(subreport.parentField);
    setCurrentSubreportDisplayType(subreport.displayType);
    setCurrentSubreportAggregations(subreport.aggregations || []);
    setSubreportDialogOpen(true);
  };

  const handleDeleteSubreport = (report, subreportId) => {
    setReports(reports.map(r => 
      r.id === report.id 
        ? { ...r, subreports: r.subreports.filter(sr => sr.id !== subreportId) }
        : r
    ));
  };

  const handleSaveSubreport = () => {
    if (!currentSubreportName || !currentSubreportSource || !currentSubreportLinkField || !currentSubreportParentField) {
      alert('Please fill in all required fields');
      return;
    }

    const subreportData = {
      id: selectedSubreport ? selectedSubreport.id : Date.now(),
      name: currentSubreportName,
      dataSource: currentSubreportSource,
      linkField: currentSubreportLinkField,
      parentField: currentSubreportParentField,
      displayType: currentSubreportDisplayType,
      aggregations: currentSubreportAggregations
    };

    setReports(reports.map(r => {
      if (r.id === editingReportForSubreport.id) {
        if (selectedSubreport) {
          // Update existing subreport
          return { ...r, subreports: r.subreports.map(sr => sr.id === selectedSubreport.id ? subreportData : sr) };
        } else {
          // Add new subreport
          return { ...r, subreports: [...(r.subreports || []), subreportData] };
        }
      }
      return r;
    }));

    setSubreportDialogOpen(false);
  };

  const handleAddAggregation = () => {
    setCurrentSubreportAggregations([...currentSubreportAggregations, 'count']);
  };

  const handleRemoveAggregation = (index) => {
    setCurrentSubreportAggregations(currentSubreportAggregations.filter((_, i) => i !== index));
  };

  const handleUpdateAggregation = (index, value) => {
    const updated = [...currentSubreportAggregations];
    updated[index] = value;
    setCurrentSubreportAggregations(updated);
  };

  // Expression Builder Handlers (NEW FEATURE)
  const handleCreateExpression = () => {
    setSelectedExpression(null);
    setCurrentExpressionTable('');
    setCurrentExpressionFieldName('');
    setCurrentExpressionFormula('');
    setCurrentExpressionDataType('text');
    setCurrentExpressionDescription('');
    setExpressionBuilderMode('visual');
    setExpressionDialogOpen(true);
  };

  const handleEditExpression = (expression) => {
    setSelectedExpression(expression);
    setCurrentExpressionTable(expression.table);
    setCurrentExpressionFieldName(expression.fieldName);
    setCurrentExpressionFormula(expression.expression);
    setCurrentExpressionDataType(expression.dataType);
    setCurrentExpressionDescription(expression.description);
    setExpressionBuilderMode('text');
    setExpressionDialogOpen(true);
  };

  const handleDeleteExpression = (expression) => {
    setExpressionToDelete(expression);
    setDeleteExpressionOpen(true);
  };

  const confirmDeleteExpression = () => {
    if (expressionToDelete) {
      setCalculatedFields(calculatedFields.filter(e => e.id !== expressionToDelete.id));
      setDeleteExpressionOpen(false);
      setExpressionToDelete(null);
    }
  };

  const handleSaveExpression = () => {
    if (!currentExpressionTable || !currentExpressionFieldName || !currentExpressionFormula) {
      alert('Please fill in all required fields');
      return;
    }

    if (selectedExpression) {
      // Update existing
      setCalculatedFields(calculatedFields.map(e => 
        e.id === selectedExpression.id 
          ? { 
              ...e, 
              table: currentExpressionTable,
              fieldName: currentExpressionFieldName,
              expression: currentExpressionFormula,
              dataType: currentExpressionDataType,
              description: currentExpressionDescription
            }
          : e
      ));
    } else {
      // Create new
      const newExpression = {
        id: Date.now(),
        table: currentExpressionTable,
        fieldName: currentExpressionFieldName,
        expression: currentExpressionFormula,
        dataType: currentExpressionDataType,
        description: currentExpressionDescription,
        created: new Date().toISOString().split('T')[0]
      };
      setCalculatedFields([...calculatedFields, newExpression]);
    }
    
    setExpressionDialogOpen(false);
  };

  const handleInsertField = (fieldName) => {
    setCurrentExpressionFormula(currentExpressionFormula + `[${fieldName}]`);
  };

  const handleInsertOperator = (operator) => {
    setCurrentExpressionFormula(currentExpressionFormula + ` ${operator} `);
  };

  const handleInsertFunction = (func) => {
    setCurrentExpressionFormula(currentExpressionFormula + `${func}()`);
  };

  // Pivot Tables Handlers (NEW FEATURE)
  const handleCreatePivot = () => {
    setSelectedPivot(null);
    setCurrentPivotName('');
    setCurrentPivotSource('');
    setCurrentPivotRowFields([]);
    setCurrentPivotColumnFields([]);
    setCurrentPivotValueFields([]);
    setCurrentPivotFilters([]);
    setPivotDialogOpen(true);
  };

  const handleEditPivot = (pivot) => {
    setSelectedPivot(pivot);
    setCurrentPivotName(pivot.name);
    setCurrentPivotSource(pivot.dataSource);
    setCurrentPivotRowFields(pivot.rowFields);
    setCurrentPivotColumnFields(pivot.columnFields);
    setCurrentPivotValueFields(pivot.valueFields);
    setCurrentPivotFilters(pivot.filters || []);
    setPivotDialogOpen(true);
  };

  const handleDeletePivot = (pivot) => {
    setPivotToDelete(pivot);
    setDeletePivotOpen(true);
  };

  const confirmDeletePivot = () => {
    if (pivotToDelete) {
      setPivotTables(pivotTables.filter(p => p.id !== pivotToDelete.id));
      setDeletePivotOpen(false);
      setPivotToDelete(null);
    }
  };

  const handleSavePivot = () => {
    if (!currentPivotName || !currentPivotSource) {
      alert('Please enter pivot name and select data source');
      return;
    }

    if (currentPivotRowFields.length === 0 && currentPivotColumnFields.length === 0) {
      alert('Please select at least one row or column field');
      return;
    }

    if (currentPivotValueFields.length === 0) {
      alert('Please add at least one value field');
      return;
    }

    if (selectedPivot) {
      // Update existing
      setPivotTables(pivotTables.map(p => 
        p.id === selectedPivot.id 
          ? {
              ...p,
              name: currentPivotName,
              dataSource: currentPivotSource,
              rowFields: currentPivotRowFields,
              columnFields: currentPivotColumnFields,
              valueFields: currentPivotValueFields,
              filters: currentPivotFilters
            }
          : p
      ));
    } else {
      // Create new
      const newPivot = {
        id: Date.now(),
        name: currentPivotName,
        dataSource: currentPivotSource,
        rowFields: currentPivotRowFields,
        columnFields: currentPivotColumnFields,
        valueFields: currentPivotValueFields,
        filters: currentPivotFilters,
        created: new Date().toISOString().split('T')[0]
      };
      setPivotTables([...pivotTables, newPivot]);
    }
    
    setPivotDialogOpen(false);
  };

  const handleAddRowField = (field) => {
    if (!currentPivotRowFields.includes(field)) {
      setCurrentPivotRowFields([...currentPivotRowFields, field]);
    }
  };

  const handleRemoveRowField = (field) => {
    setCurrentPivotRowFields(currentPivotRowFields.filter(f => f !== field));
  };

  const handleAddColumnField = (field) => {
    if (!currentPivotColumnFields.includes(field)) {
      setCurrentPivotColumnFields([...currentPivotColumnFields, field]);
    }
  };

  const handleRemoveColumnField = (field) => {
    setCurrentPivotColumnFields(currentPivotColumnFields.filter(f => f !== field));
  };

  const handleAddValueField = () => {
    setCurrentPivotValueFields([...currentPivotValueFields, { field: '', aggregation: 'sum' }]);
  };

  const handleRemoveValueField = (index) => {
    setCurrentPivotValueFields(currentPivotValueFields.filter((_, i) => i !== index));
  };

  const handleUpdateValueField = (index, key, value) => {
    const updated = [...currentPivotValueFields];
    updated[index][key] = value;
    setCurrentPivotValueFields(updated);
  };

  const handlePreviewPivot = (pivot) => {
    setPivotToPreview(pivot);
    setPivotPreviewOpen(true);
  };

  const filteredData = tableData.filter(record => {
    if (!searchQuery) return true;
    return Object.values(record).some(value => 
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dynamic DB Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage database tables and records like MS Access
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setTableDesignerOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Table
          </Button>
          <Button size="sm" variant="outline" onClick={handleImportTable}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar - Tables List */}
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Database Tables</CardTitle>
              <CardDescription>{tables.length} tables</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {tables.map((table) => (
                  <div
                    key={table.name}
                    className={`group relative px-4 py-3 hover:bg-muted transition-colors ${
                      selectedTable === table.name ? 'bg-muted border-l-4 border-primary' : ''
                    }`}
                  >
                    <div 
                      onClick={() => handleTableSelect(table.name)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Table className="w-4 h-4" />
                      <div className="flex-1">
                        <p className="font-medium">{table.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {table.records.toLocaleString()} records
                        </p>
                      </div>
                    </div>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTable(table.name);
                        }}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTable(table);
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="col-span-9">
          {!selectedTable ? (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <Database className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Table Selected</h3>
                <p className="text-muted-foreground">
                  Select a table from the left sidebar to view and manage its data
                </p>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="data" className="w-full">
              <TabsList className="flex-wrap h-auto">
                <TabsTrigger value="data">
                  <Eye className="w-4 h-4 mr-2" />
                  Data View
                </TabsTrigger>
                <TabsTrigger value="structure">
                  <Table className="w-4 h-4 mr-2" />
                  Structure
                </TabsTrigger>
                <TabsTrigger value="relationships">
                  <GitBranch className="w-4 h-4 mr-2" />
                  Relationships
                </TabsTrigger>
                <TabsTrigger value="querybuilder">
                  <Workflow className="w-4 h-4 mr-2" />
                  Query Builder
                </TabsTrigger>
                <TabsTrigger value="forms">
                  <Layout className="w-4 h-4 mr-2" />
                  Forms Builder
                </TabsTrigger>
                <TabsTrigger value="reports">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Reports Builder
                </TabsTrigger>
                <TabsTrigger value="query">
                  <Code className="w-4 h-4 mr-2" />
                  SQL Editor
                </TabsTrigger>
                <TabsTrigger value="paramqueries">
                  <FileCode className="w-4 h-4 mr-2" />
                  Parameter Queries
                </TabsTrigger>
                <TabsTrigger value="macros">
                  <Workflow className="w-4 h-4 mr-2" />
                  Macros
                </TabsTrigger>
                <TabsTrigger value="templates">
                  <Save className="w-4 h-4 mr-2" />
                  Templates
                </TabsTrigger>
                <TabsTrigger value="modules">
                  <Code className="w-4 h-4 mr-2" />
                  Modules
                </TabsTrigger>
                <TabsTrigger value="validation">
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Data Validation
                </TabsTrigger>
                <TabsTrigger value="expressions">
                  <Calculator className="w-4 h-4 mr-2" />
                  Expression Builder
                </TabsTrigger>
                <TabsTrigger value="pivot">
                  <Table className="w-4 h-4 mr-2" />
                  Pivot Tables
                </TabsTrigger>
                <TabsTrigger value="switchboard">
                  <Layout className="w-4 h-4 mr-2" />
                  Switchboard
                </TabsTrigger>
              </TabsList>

              {/* Data View Tab */}
              <TabsContent value="data" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="capitalize">{selectedTable}</CardTitle>
                        <CardDescription>
                          {filteredData.length} of {tableData.length} records
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleCreateRecord}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Record
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleExportTable}>
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleTableSelect(selectedTable)}>
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Search Bar */}
                    <div className="mb-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Search records..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Data Table */}
                    {tableData.length > 0 ? (
                      <div className="border rounded-lg overflow-hidden">
                        <UITable>
                          <TableHeader>
                            <TableRow>
                              {Object.keys(tableData[0]).map((key) => (
                                <TableHead key={key} className="capitalize">
                                  {key}
                                </TableHead>
                              ))}
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredData.map((record, index) => (
                              <TableRow key={index} className="cursor-pointer hover:bg-muted/50">
                                {Object.values(record).map((value, i) => (
                                  <TableCell key={i}>
                                    {typeof value === 'number' && value > 100 ? value.toLocaleString() : value}
                                  </TableCell>
                                ))}
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleEditRecord(record)}
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleDeleteRecord(record)}
                                    >
                                      <Trash2 className="w-4 h-4 text-destructive" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </UITable>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        No data available for this table
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Structure Tab */}
              <TabsContent value="structure">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Table Structure</CardTitle>
                        <CardDescription className="capitalize">
                          {selectedTable} - {tableColumns.length} columns
                        </CardDescription>
                      </div>
                      <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => setTableDesignerOpen(true)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Modify Structure
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {tableColumns.length > 0 ? (
                      <div className="border rounded-lg overflow-hidden">
                        <UITable>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Column Name</TableHead>
                              <TableHead>Data Type</TableHead>
                              <TableHead>Nullable</TableHead>
                              <TableHead>Primary Key</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {tableColumns.map((column, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-mono">{column.name}</TableCell>
                                <TableCell>
                                  <Badge variant="secondary">{column.type}</Badge>
                                </TableCell>
                                <TableCell>
                                  {column.nullable ? (
                                    <Badge variant="outline">Yes</Badge>
                                  ) : (
                                    <Badge variant="destructive">No</Badge>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {column.primaryKey && (
                                    <Badge className="bg-blue-500">PK</Badge>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </UITable>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        No structure information available
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Relationships Tab */}
              <TabsContent value="relationships">
                <Card>
                  <CardHeader>
                    <CardTitle>Database Relationships</CardTitle>
                    <CardDescription>
                      Visual representation of table relationships and foreign keys
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg p-8 bg-muted/30 min-h-[500px] relative">
                      {/* Relationship Diagram */}
                      <div className="space-y-8">
                        {/* Products Table */}
                        <div className="absolute top-8 left-8 w-64 border-2 border-blue-500 rounded-lg bg-background shadow-lg">
                          <div className="bg-blue-500 text-white px-4 py-2 font-semibold flex items-center gap-2">
                            <Table className="w-4 h-4" />
                            products
                          </div>
                          <div className="p-3 space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-yellow-500 text-xs">PK</Badge>
                              <span className="font-mono">id</span>
                              <span className="text-muted-foreground">INTEGER</span>
                            </div>
                            <div className="flex items-center gap-2 pl-8">
                              <span className="font-mono">name</span>
                              <span className="text-muted-foreground">VARCHAR</span>
                            </div>
                            <div className="flex items-center gap-2 pl-8">
                              <span className="font-mono">category_id</span>
                              <span className="text-muted-foreground">INTEGER</span>
                              <Badge variant="outline" className="text-xs">FK</Badge>
                            </div>
                            <div className="flex items-center gap-2 pl-8">
                              <span className="font-mono">price</span>
                              <span className="text-muted-foreground">DECIMAL</span>
                            </div>
                          </div>
                        </div>

                        {/* Orders Table */}
                        <div className="absolute top-8 right-8 w-64 border-2 border-green-500 rounded-lg bg-background shadow-lg">
                          <div className="bg-green-500 text-white px-4 py-2 font-semibold flex items-center gap-2">
                            <Table className="w-4 h-4" />
                            orders
                          </div>
                          <div className="p-3 space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-yellow-500 text-xs">PK</Badge>
                              <span className="font-mono">id</span>
                              <span className="text-muted-foreground">INTEGER</span>
                            </div>
                            <div className="flex items-center gap-2 pl-8">
                              <span className="font-mono">customer_id</span>
                              <span className="text-muted-foreground">INTEGER</span>
                              <Badge variant="outline" className="text-xs">FK</Badge>
                            </div>
                            <div className="flex items-center gap-2 pl-8">
                              <span className="font-mono">product_id</span>
                              <span className="text-muted-foreground">INTEGER</span>
                              <Badge variant="outline" className="text-xs">FK</Badge>
                            </div>
                            <div className="flex items-center gap-2 pl-8">
                              <span className="font-mono">total</span>
                              <span className="text-muted-foreground">DECIMAL</span>
                            </div>
                          </div>
                        </div>

                        {/* Categories Table */}
                        <div className="absolute bottom-8 left-8 w-64 border-2 border-purple-500 rounded-lg bg-background shadow-lg">
                          <div className="bg-purple-500 text-white px-4 py-2 font-semibold flex items-center gap-2">
                            <Table className="w-4 h-4" />
                            categories
                          </div>
                          <div className="p-3 space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-yellow-500 text-xs">PK</Badge>
                              <span className="font-mono">id</span>
                              <span className="text-muted-foreground">INTEGER</span>
                            </div>
                            <div className="flex items-center gap-2 pl-8">
                              <span className="font-mono">name</span>
                              <span className="text-muted-foreground">VARCHAR</span>
                            </div>
                          </div>
                        </div>

                        {/* Customers Table */}
                        <div className="absolute bottom-8 right-8 w-64 border-2 border-orange-500 rounded-lg bg-background shadow-lg">
                          <div className="bg-orange-500 text-white px-4 py-2 font-semibold flex items-center gap-2">
                            <Table className="w-4 h-4" />
                            customers
                          </div>
                          <div className="p-3 space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-yellow-500 text-xs">PK</Badge>
                              <span className="font-mono">id</span>
                              <span className="text-muted-foreground">INTEGER</span>
                            </div>
                            <div className="flex items-center gap-2 pl-8">
                              <span className="font-mono">name</span>
                              <span className="text-muted-foreground">VARCHAR</span>
                            </div>
                            <div className="flex items-center gap-2 pl-8">
                              <span className="font-mono">email</span>
                              <span className="text-muted-foreground">VARCHAR</span>
                            </div>
                          </div>
                        </div>

                        {/* Relationship Lines */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                          {/* Products -> Categories */}
                          <line x1="140" y1="120" x2="140" y2="400" stroke="#8b5cf6" strokeWidth="2" markerEnd="url(#arrowhead)" />
                          
                          {/* Orders -> Products */}
                          <line x1="600" y1="100" x2="300" y2="100" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowhead)" />
                          
                          {/* Orders -> Customers */}
                          <line x1="730" y1="180" x2="730" y2="400" stroke="#f97316" strokeWidth="2" markerEnd="url(#arrowhead)" />
                          
                          <defs>
                            <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                              <polygon points="0 0, 10 3, 0 6" fill="#666" />
                            </marker>
                          </defs>
                        </svg>
                      </div>

                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <Button size="sm" variant="outline" onClick={handleAddRelationship}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Relationship
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => toast({ title: 'Export', description: 'Exporting data...' })}>
                          <Download className="w-4 h-4 mr-2" />
                          Export Diagram
                        </Button>
                      </div>
                    </div>

                    {/* Relationships List */}
                    <div className="mt-6">
                      <h3 className="font-semibold mb-4">Defined Relationships</h3>
                      <div className="border rounded-lg overflow-hidden">
                        <UITable>
                          <TableHeader>
                            <TableRow>
                              <TableHead>From Table</TableHead>
                              <TableHead>From Column</TableHead>
                              <TableHead>To Table</TableHead>
                              <TableHead>To Column</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {relationships.map((rel) => (
                              <TableRow key={rel.id} className="cursor-pointer hover:bg-muted/50">
                                <TableCell className="font-mono">{rel.fromTable}</TableCell>
                                <TableCell className="font-mono">{rel.fromColumn}</TableCell>
                                <TableCell className="font-mono">{rel.toTable}</TableCell>
                                <TableCell className="font-mono">{rel.toColumn}</TableCell>
                                <TableCell><Badge variant="secondary">{rel.type}</Badge></TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="ghost" onClick={() => handleEditRelationship(rel)}>
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => handleDeleteRelationship(rel)}>
                                      <Trash2 className="w-4 h-4 text-destructive" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </UITable>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Query Builder Tab */}
              <TabsContent value="querybuilder">
                <Card>
                  <CardHeader>
                    <CardTitle>Visual Query Builder</CardTitle>
                    <CardDescription>
                      Build queries visually without writing SQL
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Select Tables */}
                    <div className="border rounded-lg p-4 space-y-4">
                      <h3 className="font-semibold">1. Select Tables</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {tables.map((table) => (
                          <div
                            key={table.name}
                            className="border rounded-lg p-3 hover:bg-muted cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <input type="checkbox" id={`qb-${table.name}`} className="cursor-pointer" />
                              <Label htmlFor={`qb-${table.name}`} className="cursor-pointer capitalize">
                                <div className="flex items-center gap-2">
                                  <Table className="w-4 h-4" />
                                  {table.name}
                                </div>
                              </Label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Select Columns */}
                    <div className="border rounded-lg p-4 space-y-4">
                      <h3 className="font-semibold">2. Select Columns</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Available Columns</Label>
                          <div className="mt-2 border rounded-lg p-3 h-48 overflow-y-auto space-y-2">
                            {mockProductsColumns.map((col) => (
                              <div key={col.name} className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer">
                                <input type="checkbox" id={`col-${col.name}`} className="cursor-pointer" />
                                <Label htmlFor={`col-${col.name}`} className="cursor-pointer font-mono text-sm">
                                  products.{col.name}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label>Selected Columns</Label>
                          <div className="mt-2 border rounded-lg p-3 h-48 overflow-y-auto bg-muted/30">
                            <p className="text-sm text-muted-foreground text-center py-8">
                              No columns selected
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Joins */}
                    <div className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">3. Define Joins</h3>
                        <Button size="sm" variant="outline" onClick={() => toast({ title: 'Added', description: 'Data added successfully' })}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Join
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="border rounded-lg p-3 bg-muted/30">
                          <div className="grid grid-cols-5 gap-2 items-center">
                            <Select defaultValue="inner">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="inner">INNER JOIN</SelectItem>
                                <SelectItem value="left">LEFT JOIN</SelectItem>
                                <SelectItem value="right">RIGHT JOIN</SelectItem>
                                <SelectItem value="full">FULL JOIN</SelectItem>
                              </SelectContent>
                            </Select>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Table" />
                              </SelectTrigger>
                              <SelectContent>
                                {tables.map(t => (
                                  <SelectItem key={t.name} value={t.name}>{t.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <span className="text-center text-sm text-muted-foreground">ON</span>
                            <Input placeholder="column1 = column2" />
                            <Button size="sm" variant="ghost" onClick={() => toast({ title: 'Deleted', description: 'Data deleted successfully', variant: 'destructive' })}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Filters */}
                    <div className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">4. Add Filters (WHERE)</h3>
                        <Button size="sm" variant="outline" onClick={() => toast({ title: 'Added', description: 'Data added successfully' })}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Filter
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="border rounded-lg p-3 bg-muted/30">
                          <div className="grid grid-cols-5 gap-2 items-center">
                            <Input placeholder="Column" />
                            <Select defaultValue="equals">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="equals">=</SelectItem>
                                <SelectItem value="notequals">!=</SelectItem>
                                <SelectItem value="greater">&gt;</SelectItem>
                                <SelectItem value="less">&lt;</SelectItem>
                                <SelectItem value="like">LIKE</SelectItem>
                                <SelectItem value="in">IN</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input placeholder="Value" />
                            <Select defaultValue="and">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="and">AND</SelectItem>
                                <SelectItem value="or">OR</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button size="sm" variant="ghost" onClick={() => toast({ title: 'Deleted', description: 'Data deleted successfully', variant: 'destructive' })}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order By */}
                    <div className="border rounded-lg p-4 space-y-4">
                      <h3 className="font-semibold">5. Sort Results (ORDER BY)</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Column</Label>
                          <Input placeholder="Column name" className="mt-2" />
                        </div>
                        <div>
                          <Label>Direction</Label>
                          <Select defaultValue="asc">
                            <SelectTrigger className="mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="asc">ASC (Ascending)</SelectItem>
                              <SelectItem value="desc">DESC (Descending)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Limit</Label>
                          <Input type="number" placeholder="100" defaultValue="100" className="mt-2" />
                        </div>
                      </div>
                    </div>

                    {/* Generated SQL Preview */}
                    <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
                      <h3 className="font-semibold">Generated SQL Query</h3>
                      <Textarea
                        value="SELECT * FROM products WHERE status = 'Active' ORDER BY name ASC LIMIT 100"
                        readOnly
                        className="font-mono text-sm bg-background"
                        rows={4}
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => toast({ title: 'Executed', description: 'Command executed successfully' })}>
                        <Play className="w-4 h-4 mr-2" />
                        Run Query
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleSaveSettings}>
                        <Download className="w-4 h-4 mr-2" />
                        Save Query
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleRefresh}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* SQL Query Tab */}
              {/* SQL Editor Tab - Enhanced with Syntax Highlighting */}
              <TabsContent value="query">
                <div className="grid grid-cols-12 gap-4">
                  {/* Main Editor */}
                  <div className="col-span-8 space-y-4">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>SQL Editor</CardTitle>
                            <CardDescription>
                              Write and execute SQL queries with syntax highlighting
                            </CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => setSaveQueryDialogOpen(true)}>
                              <Save className="w-4 h-4 mr-2" />
                              Save Query
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label>SQL Query</Label>
                          <div className="mt-2 border rounded-lg overflow-hidden">
                            <CodeMirror
                              value={sqlQuery}
                              height="200px"
                              extensions={[sql()]}
                              theme={oneDark}
                              onChange={(value) => setSqlQuery(value)}
                              placeholder={`SELECT * FROM ${selectedTable} WHERE ...`}
                            />
                          </div>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                          <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleRunQuery} disabled={!sqlQuery.trim()}>
                            <Play className="w-4 h-4 mr-2" />
                            Run Query
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setSqlQuery('')}>
                            Clear
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setSqlQuery(`SELECT * FROM ${selectedTable} LIMIT 10`)}>
                            Load Sample
                          </Button>
                        </div>

                        {queryResult && (
                          <div className="border rounded-lg p-4 bg-muted/50">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <p className="font-semibold text-green-600">Query executed successfully</p>
                                <p className="text-sm text-muted-foreground">
                                  {queryResult.rowsAffected} rows affected • Execution time: {queryResult.executionTime}
                                </p>
                              </div>
                            </div>

                            {queryResult.data && queryResult.data.length > 0 && (
                              <div className="border rounded-lg overflow-hidden bg-background">
                                <UITable>
                                  <TableHeader>
                                    <TableRow>
                                      {Object.keys(queryResult.data[0]).map((key) => (
                                        <TableHead key={key} className="capitalize">
                                          {key}
                                        </TableHead>
                                      ))}
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {queryResult.data.map((record, index) => (
                                      <TableRow key={index}>
                                        {Object.values(record).map((value, i) => (
                                          <TableCell key={i}>{String(value)}</TableCell>
                                        ))}
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </UITable>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Sidebar - Saved Queries & History */}
                  <div className="col-span-4 space-y-4">
                    {/* Saved Queries */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Saved Queries</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {savedQueries.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">No saved queries</p>
                        ) : (
                          savedQueries.map((query) => (
                            <div key={query.id} className="group border rounded-lg p-3 hover:border-primary cursor-pointer transition-colors">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0" onClick={() => handleLoadSavedQuery(query)}>
                                  <p className="font-medium text-sm truncate">{query.name}</p>
                                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 font-mono">
                                    {query.query}
                                  </p>
                                </div>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => handleDeleteSavedQuery(query)}
                                >
                                  <Trash2 className="w-3 h-3 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          ))
                        )}
                      </CardContent>
                    </Card>

                    {/* Query History */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Query History
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                        {queryHistory.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">No query history</p>
                        ) : (
                          queryHistory.map((item) => (
                            <div key={item.id} className="border rounded-lg p-3 hover:border-primary cursor-pointer transition-colors" onClick={() => handleLoadFromHistory(item)}>
                              <p className="text-xs text-muted-foreground mb-1">
                                {item.timestamp} • {item.executionTime}
                              </p>
                              <p className="text-xs font-mono line-clamp-2">
                                {item.query}
                              </p>
                            </div>
                          ))
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Parameter Queries Tab - NEW FEATURE */}
              <TabsContent value="paramqueries" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Parameter Queries</CardTitle>
                        <CardDescription>
                          Create reusable queries with parameters that can be filled in at runtime
                        </CardDescription>
                      </div>
                      <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleCreateParamQuery}>
                        <Plus className="w-4 h-4 mr-2" />
                        New Parameter Query
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Parameter Queries List */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Saved Parameter Queries ({parameterQueries.length})</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {parameterQueries.map((query) => (
                          <Card key={query.id} className="hover:border-primary transition-colors">
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <FileCode className="w-8 h-8 text-primary" />
                                <div className="flex gap-1">
                                  <Button size="icon" variant="ghost" onClick={() => handleEditParamQuery(query)}>
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDeleteParamQuery(query)}>
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              <CardTitle className="text-base mt-2">{query.name}</CardTitle>
                              <CardDescription className="line-clamp-2 font-mono text-xs">
                                {query.query}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Badge variant="outline">{query.parameters.length} parameters</Badge>
                                  <span>•</span>
                                  <span className="text-xs">Created {query.created}</span>
                                </div>
                                <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white w-full" onClick={() => handleExecuteParamQuery(query)}>
                                  <Play className="w-4 h-4 mr-2" />
                                  Execute Query
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Info Box */}
                    <div className="border rounded-lg p-6 bg-muted/30">
                      <h3 className="font-semibold mb-3">How to use Parameter Queries</h3>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>• Use <code className="bg-background px-2 py-1 rounded">:parameterName</code> syntax in your SQL queries</p>
                        <p>• Example: <code className="bg-background px-2 py-1 rounded">SELECT * FROM products WHERE price &gt;= :minPrice</code></p>
                        <p>• Define parameters with types (text, number, date) and default values</p>
                        <p>• Execute queries by filling in parameter values at runtime</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Forms Builder Tab */}
              <TabsContent value="forms" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Forms Builder</CardTitle>
                    <CardDescription>
                      Create custom forms for data entry
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Form List */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Saved Forms ({forms.length})</h3>
                        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleCreateForm}>
                          <Plus className="w-4 h-4 mr-2" />
                          New Form
                        </Button>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {forms.map((form) => (
                          <Card key={form.id} className="hover:border-primary cursor-pointer transition-colors">
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <FileText className="w-8 h-8 text-primary" />
                                <div className="flex gap-1">
                                  <Button size="icon" variant="ghost" onClick={() => handleEditForm(form)}>
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDeleteForm(form)}>
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              <CardTitle className="text-base mt-2">{form.name}</CardTitle>
                              <CardDescription>
                                {form.fields} fields • Table: {form.targetTable}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  {form.subforms && form.subforms.length > 0 && (
                                    <Badge variant="secondary">{form.subforms.length} subform(s)</Badge>
                                  )}
                                  <span className="text-xs">Created {form.created}</span>
                                </div>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="w-full" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddSubform(form);
                                  }}
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add Subform
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Subforms Section (NEW) */}
                    {forms.some(f => f.subforms && f.subforms.length > 0) && (
                      <div className="border rounded-lg p-6 bg-muted/30">
                        <h3 className="text-lg font-semibold mb-4">Configured Subforms</h3>
                        <div className="space-y-4">
                          {forms.filter(f => f.subforms && f.subforms.length > 0).map((form) => (
                            <div key={form.id} className="border rounded-lg p-4 bg-background">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <p className="font-semibold">{form.name}</p>
                                  <p className="text-sm text-muted-foreground">Master Form</p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                {form.subforms.map((subform) => (
                                  <div key={subform.id} className="flex items-center justify-between border rounded p-3 bg-muted/50">
                                    <div className="flex-1">
                                      <p className="font-medium text-sm">{subform.name}</p>
                                      <p className="text-xs text-muted-foreground">
                                        Table: {subform.targetTable} • Link: {subform.linkField} → {subform.parentField}
                                      </p>
                                    </div>
                                    <div className="flex gap-1">
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-7 w-7"
                                        onClick={() => handleEditSubform(form, subform)}
                                      >
                                        <Edit className="w-3 h-3" />
                                      </Button>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-7 w-7 text-destructive"
                                        onClick={() => handleDeleteSubform(form, subform.id)}
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Form Designer */}
                    <div className="border rounded-lg p-6 bg-muted/30">
                      <h3 className="text-lg font-semibold mb-4">Form Designer</h3>
                      
                      {/* Form Properties */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <Label>Form Name</Label>
                          <Input placeholder="Enter form name" className="mt-2" />
                        </div>
                        <div>
                          <Label>Target Table</Label>
                          <Select>
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select table" />
                            </SelectTrigger>
                            <SelectContent>
                              {tables.map((table) => (
                                <SelectItem key={table.name} value={table.name}>
                                  {table.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Available Fields */}
                      <div className="mb-6">
                        <h4 className="font-semibold mb-3">Available Field Types</h4>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { icon: Type, label: 'Text Input' },
                            { icon: FileText, label: 'Text Area' },
                            { icon: CheckSquare, label: 'Checkbox' },
                            { icon: Filter, label: 'Dropdown' },
                            { icon: Calendar, label: 'Date Picker' },
                            { icon: ImageIcon, label: 'File Upload' },
                          ].map((field, index) => (
                            <Button size="sm" onClick={() => toast({ title: 'Action Completed', description: 'Completed' })}
                              key={index}
                              variant="outline"
                              className="justify-start"
                            >
                              <field.icon className="w-4 h-4 mr-2" />
                              {field.label}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Form Preview */}
                      <div className="border rounded-lg p-6 bg-background">
                        <h4 className="font-semibold mb-4">Form Preview</h4>
                        <div className="space-y-4">
                          <div className="text-center text-muted-foreground py-12">
                            <Layout className="w-12 h-12 mx-auto mb-3" />
                            <p>Drag and drop fields here to build your form</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-6">
                        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSaveSettings}>
                          <Download className="w-4 h-4 mr-2" />
                          Save Form
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => toast({ title: 'View Details', description: 'Loading details...' })}>
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => toast({ title: 'Action Completed', description: 'Completed' })}>
                          Clear
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Reports Builder Tab */}
              <TabsContent value="reports" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Reports Builder</CardTitle>
                    <CardDescription>
                      Create custom reports and visualizations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Report List */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Saved Reports ({reports.length})</h3>
                        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleCreateReport}>
                          <Plus className="w-4 h-4 mr-2" />
                          New Report
                        </Button>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {reports.map((report) => (
                          <Card key={report.id} className="hover:border-primary cursor-pointer transition-colors">
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <BarChart3 className="w-8 h-8 text-primary" />
                                <div className="flex gap-1">
                                  <Button size="icon" variant="ghost" onClick={() => handleEditReport(report)}>
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDeleteReport(report)}>
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              <CardTitle className="text-base mt-2">{report.name}</CardTitle>
                              <CardDescription>
                                {report.type} • Source: {report.dataSource}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  {report.subreports && report.subreports.length > 0 && (
                                    <Badge variant="secondary">{report.subreports.length} subreport(s)</Badge>
                                  )}
                                  <span className="text-xs">Created {report.created}</span>
                                </div>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="w-full" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddSubreport(report);
                                  }}
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add Subreport
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Subreports Section (NEW) */}
                    {reports.some(r => r.subreports && r.subreports.length > 0) && (
                      <div className="border rounded-lg p-6 bg-muted/30">
                        <h3 className="text-lg font-semibold mb-4">Configured Subreports</h3>
                        <div className="space-y-4">
                          {reports.filter(r => r.subreports && r.subreports.length > 0).map((report) => (
                            <div key={report.id} className="border rounded-lg p-4 bg-background">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <p className="font-semibold">{report.name}</p>
                                  <p className="text-sm text-muted-foreground">Master Report</p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                {report.subreports.map((subreport) => (
                                  <div key={subreport.id} className="flex items-center justify-between border rounded p-3 bg-muted/50">
                                    <div className="flex-1">
                                      <p className="font-medium text-sm">{subreport.name}</p>
                                      <p className="text-xs text-muted-foreground">
                                        Source: {subreport.dataSource} • Link: {subreport.linkField} → {subreport.parentField}
                                        {subreport.aggregations && subreport.aggregations.length > 0 && (
                                          <> • Agg: {subreport.aggregations.join(', ')}</>
                                        )}
                                      </p>
                                    </div>
                                    <div className="flex gap-1">
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-7 w-7"
                                        onClick={() => handleEditSubreport(report, subreport)}
                                      >
                                        <Edit className="w-3 h-3" />
                                      </Button>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-7 w-7 text-destructive"
                                        onClick={() => handleDeleteSubreport(report, subreport.id)}
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Report Designer */}
                    <div className="border rounded-lg p-6 bg-muted/30">
                      <h3 className="text-lg font-semibold mb-4">Report Designer</h3>
                      
                      {/* Report Properties */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div>
                          <Label>Report Name</Label>
                          <Input placeholder="Enter report name" className="mt-2" />
                        </div>
                        <div>
                          <Label>Data Source</Label>
                          <Select>
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select table" />
                            </SelectTrigger>
                            <SelectContent>
                              {tables.map((table) => (
                                <SelectItem key={table.name} value={table.name}>
                                  {table.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Report Type</Label>
                          <Select>
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="table">Table</SelectItem>
                              <SelectItem value="chart">Chart</SelectItem>
                              <SelectItem value="dashboard">Dashboard</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Fields Selection */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <Label>Select Fields</Label>
                          <div className="border rounded-lg p-4 mt-2 space-y-2 max-h-48 overflow-y-auto">
                            {tableColumns.map((col) => (
                              <div key={col.name} className="flex items-center space-x-2">
                                <input type="checkbox" id={col.name} className="rounded cursor-pointer" />
                                <label htmlFor={col.name} className="text-sm capitalize cursor-pointer">
                                  {col.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label>Grouping & Aggregation</Label>
                          <div className="border rounded-lg p-4 mt-2 space-y-3">
                            <div>
                              <Label className="text-sm">Group By</Label>
                              <Select>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select field" />
                                </SelectTrigger>
                                <SelectContent>
                                  {tableColumns.map((col) => (
                                    <SelectItem key={col.name} value={col.name}>
                                      {col.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-sm">Aggregate Function</Label>
                              <Select>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select function" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="sum">SUM</SelectItem>
                                  <SelectItem value="avg">AVG</SelectItem>
                                  <SelectItem value="count">COUNT</SelectItem>
                                  <SelectItem value="min">MIN</SelectItem>
                                  <SelectItem value="max">MAX</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Sorting & Filtering */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <Label>Sort By</Label>
                          <div className="flex gap-2 mt-2">
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select field" />
                              </SelectTrigger>
                              <SelectContent>
                                {tableColumns.map((col) => (
                                  <SelectItem key={col.name} value={col.name}>
                                    {col.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Select>
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Order" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="asc">ASC</SelectItem>
                                <SelectItem value="desc">DESC</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label>Limit Results</Label>
                          <Input type="number" placeholder="e.g., 100" className="mt-2" />
                        </div>
                      </div>

                      {/* Report Preview */}
                      <div className="border rounded-lg p-6 bg-background">
                        <h4 className="font-semibold mb-4">Report Preview</h4>
                        <div className="text-center text-muted-foreground py-12">
                          <BarChart3 className="w-12 h-12 mx-auto mb-3" />
                          <p>Configure report settings to see preview</p>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-6">
                        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSaveSettings}>
                          <Download className="w-4 h-4 mr-2" />
                          Save Report
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => toast({ title: 'Executed', description: 'Command executed successfully' })}>
                          <Play className="w-4 h-4 mr-2" />
                          Run Report
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => toast({ title: 'Export', description: 'Exporting data...' })}>
                          <Download className="w-4 h-4 mr-2" />
                          Export PDF
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => toast({ title: 'Action Completed', description: 'Completed' })}>
                          Clear
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Macros Tab */}
              <TabsContent value="macros" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Macros & Automation</CardTitle>
                    <CardDescription>
                      Create automated workflows with event triggers and actions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Macro List */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Saved Macros ({macros.length})</h3>
                        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleCreateMacro}>
                          <Plus className="w-4 h-4 mr-2" />
                          New Macro
                        </Button>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {macros.map((macro) => (
                          <Card key={macro.id} className="hover:border-primary cursor-pointer transition-colors">
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <Workflow className={`w-8 h-8 ${macro.enabled ? 'text-primary' : 'text-muted-foreground'}`} />
                                <div className="flex gap-1">
                                  <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    onClick={() => handleToggleMacro(macro.id)}
                                    title={macro.enabled ? 'Disable' : 'Enable'}
                                  >
                                    <Play className={`w-4 h-4 ${macro.enabled ? 'text-green-500' : 'text-muted-foreground'}`} />
                                  </Button>
                                  <Button size="icon" variant="ghost" onClick={() => handleEditMacro(macro)}>
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDeleteMacro(macro)}>
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              <CardTitle className="text-base mt-2">{macro.name}</CardTitle>
                              <CardDescription>
                                Trigger: {macro.trigger} • {macro.actions} actions • {macro.enabled ? 'Enabled' : 'Disabled'}
                              </CardDescription>
                            </CardHeader>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Macro Info */}
                    <div className="border rounded-lg p-6 bg-muted/30">
                      <h3 className="text-lg font-semibold mb-4">About Macros</h3>
                      <div className="space-y-3 text-sm">
                        <p><strong>Event Triggers:</strong> OnClick, OnLoad, OnChange, OnSave, OnDelete, OnOrderComplete, OnCustomerCreate, etc.</p>
                        <p><strong>Available Actions:</strong> OpenForm, CloseForm, RunQuery, ShowMessage, SetValue, SendEmail, UpdateRecord, etc.</p>
                        <p><strong>Use Cases:</strong> Automate repetitive tasks, enforce business rules, send notifications, update related records</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Modules Tab */}
              <TabsContent value="modules" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Modules (Custom Code)</CardTitle>
                    <CardDescription>
                      Write custom JavaScript functions and business logic
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Module List */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Saved Modules ({modules.length})</h3>
                        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleCreateModule}>
                          <Plus className="w-4 h-4 mr-2" />
                          New Module
                        </Button>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {modules.map((module) => (
                          <Card key={module.id} className="hover:border-primary cursor-pointer transition-colors">
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <Code className="w-8 h-8 text-primary" />
                                <div className="flex gap-1">
                                  <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    onClick={() => handleRunModule(module)}
                                    title="Run Module"
                                  >
                                    <Play className="w-4 h-4 text-green-500" />
                                  </Button>
                                  <Button size="icon" variant="ghost" onClick={() => handleEditModule(module)}>
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDeleteModule(module)}>
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              <CardTitle className="text-base mt-2">{module.name}</CardTitle>
                              <CardDescription>
                                Type: {module.type} • Created {module.created}
                              </CardDescription>
                            </CardHeader>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Module Info */}
                    <div className="border rounded-lg p-6 bg-muted/30">
                      <h3 className="text-lg font-semibold mb-4">About Modules</h3>
                      <div className="space-y-3 text-sm">
                        <p><strong>Functions:</strong> Create reusable functions for calculations, validations, and transformations</p>
                        <p><strong>Business Logic:</strong> Implement complex business rules and workflows</p>
                        <p><strong>Language:</strong> Write in JavaScript (similar to VBA in MS Access)</p>
                        <p><strong>Examples:</strong> calculateTax(), validateEmail(), processOrder(), generateInvoice()</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Data Validation Tab */}
              <TabsContent value="validation" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Data Validation Rules</CardTitle>
                        <CardDescription>Define validation rules for your database fields</CardDescription>
                      </div>
                      <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleCreateValidation}>
                        <Plus className="w-4 h-4 mr-2" />
                        New Rule
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Validation Rules ({validationRules.length})
                      </p>
                      
                      <div className="grid grid-cols-1 gap-4">
                        {validationRules.map((validation) => (
                          <Card key={validation.id} className="border">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline">{validation.table}</Badge>
                                    <span className="text-sm font-medium">{validation.field}</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-1">
                                    <strong>Rule:</strong> {validation.rule}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    <strong>Message:</strong> {validation.message}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-2">
                                    Created: {validation.created}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleEditValidation(validation)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="text-destructive"
                                    onClick={() => handleDeleteValidation(validation)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-2">About Data Validation</h4>
                      <div className="space-y-3 text-sm">
                        <p><strong>Validation Rules:</strong> Define conditions that data must meet before being saved</p>
                        <p><strong>Input Masks:</strong> Control the format of data entry (e.g., phone numbers, dates)</p>
                        <p><strong>Lookup Fields:</strong> Create dropdown lists from related tables</p>
                        <p><strong>Calculated Fields:</strong> Automatically calculate values based on other fields</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Expression Builder Tab (NEW FEATURE) */}
              <TabsContent value="expressions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Expression Builder</CardTitle>
                    <CardDescription>
                      Create calculated fields using visual expression builder
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Calculated Fields List */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Calculated Fields ({calculatedFields.length})</h3>
                        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleCreateExpression}>
                          <Plus className="w-4 h-4 mr-2" />
                          New Calculated Field
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {calculatedFields.map((field) => (
                          <Card key={field.id} className="hover:border-primary cursor-pointer transition-colors">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Calculator className="w-5 h-5 text-primary" />
                                    <h4 className="font-semibold">{field.fieldName}</h4>
                                    <Badge variant="outline">{field.dataType}</Badge>
                                    <Badge variant="secondary">{field.table}</Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2">{field.description}</p>
                                  <div className="bg-muted/50 rounded p-2 font-mono text-sm">
                                    {field.expression}
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-2">Created {field.created}</p>
                                </div>
                                <div className="flex gap-1 ml-4">
                                  <Button size="icon" variant="ghost" onClick={() => handleEditExpression(field)}>
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDeleteExpression(field)}>
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Expression Builder Info */}
                    <div className="border rounded-lg p-6 bg-muted/30">
                      <h3 className="text-lg font-semibold mb-4">Expression Builder Guide</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2 text-sm">Field References</h4>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p><code className="bg-muted px-1 rounded">[field_name]</code> - Reference a field</p>
                            <p><code className="bg-muted px-1 rounded">[table.field]</code> - Qualified reference</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2 text-sm">Operators</h4>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p><code className="bg-muted px-1 rounded">+ - * /</code> - Arithmetic</p>
                            <p><code className="bg-muted px-1 rounded">&</code> - String concatenation</p>
                            <p><code className="bg-muted px-1 rounded">{'= < > <= >='}</code> - Comparison</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2 text-sm">Functions</h4>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p><code className="bg-muted px-1 rounded">SUM()</code> - Sum values</p>
                            <p><code className="bg-muted px-1 rounded">AVG()</code> - Average</p>
                            <p><code className="bg-muted px-1 rounded">COUNT()</code> - Count records</p>
                            <p><code className="bg-muted px-1 rounded">IF()</code> - Conditional</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <h4 className="font-semibold mb-2 text-sm flex items-center gap-2">
                          <Calculator className="w-4 h-4" />
                          Example Expressions
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <p className="font-medium">Calculate total with tax:</p>
                            <code className="bg-muted px-2 py-1 rounded block mt-1">[subtotal] * 1.07</code>
                          </div>
                          <div>
                            <p className="font-medium">Profit margin percentage:</p>
                            <code className="bg-muted px-2 py-1 rounded block mt-1">([price] - [cost]) / [price] * 100</code>
                          </div>
                          <div>
                            <p className="font-medium">Full name concatenation:</p>
                            <code className="bg-muted px-2 py-1 rounded block mt-1">[first_name] & " " & [last_name]</code>
                          </div>
                          <div>
                            <p className="font-medium">Conditional discount:</p>
                            <code className="bg-muted px-2 py-1 rounded block mt-1">IF([quantity] &gt;= 10, [price] * 0.9, [price])</code>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Pivot Tables Tab (NEW FEATURE) */}
              <TabsContent value="pivot" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Pivot Tables & Crosstab Analysis</CardTitle>
                    <CardDescription>
                      Create pivot tables to analyze and summarize your data
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Pivot Tables List */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Saved Pivot Tables ({pivotTables.length})</h3>
                        <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleCreatePivot}>
                          <Plus className="w-4 h-4 mr-2" />
                          New Pivot Table
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {pivotTables.map((pivot) => (
                          <Card key={pivot.id} className="hover:border-primary cursor-pointer transition-colors">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Table className="w-5 h-5 text-primary" />
                                    <h4 className="font-semibold">{pivot.name}</h4>
                                    <Badge variant="secondary">{pivot.dataSource}</Badge>
                                  </div>
                                  <div className="grid grid-cols-3 gap-4 text-sm mb-2">
                                    <div>
                                      <p className="text-muted-foreground text-xs mb-1">Row Fields</p>
                                      <div className="flex flex-wrap gap-1">
                                        {pivot.rowFields.map((field, idx) => (
                                          <Badge key={idx} variant="outline" className="text-xs">
                                            {field}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground text-xs mb-1">Column Fields</p>
                                      <div className="flex flex-wrap gap-1">
                                        {pivot.columnFields.map((field, idx) => (
                                          <Badge key={idx} variant="outline" className="text-xs">
                                            {field}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground text-xs mb-1">Value Fields</p>
                                      <div className="flex flex-wrap gap-1">
                                        {pivot.valueFields.map((vf, idx) => (
                                          <Badge key={idx} variant="outline" className="text-xs">
                                            {vf.aggregation}({vf.field})
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                  <p className="text-xs text-muted-foreground">Created {pivot.created}</p>
                                </div>
                                <div className="flex gap-1 ml-4">
                                  <Button size="icon" variant="ghost" onClick={() => handlePreviewPivot(pivot)}>
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button size="icon" variant="ghost" onClick={() => handleEditPivot(pivot)}>
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDeletePivot(pivot)}>
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Pivot Table Guide */}
                    <div className="border rounded-lg p-6 bg-muted/30">
                      <h3 className="text-lg font-semibold mb-4">How Pivot Tables Work</h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
                            <Table className="w-4 h-4" />
                            Pivot Table Structure
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex gap-2">
                              <Badge variant="outline">Rows</Badge>
                              <p className="text-muted-foreground">Fields to group by vertically (e.g., Category, Product)</p>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="outline">Columns</Badge>
                              <p className="text-muted-foreground">Fields to group by horizontally (e.g., Month, Quarter)</p>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="outline">Values</Badge>
                              <p className="text-muted-foreground">Fields to aggregate (e.g., Sum of Sales, Count of Orders)</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
                            <Calculator className="w-4 h-4" />
                            Aggregation Functions
                          </h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              <code className="bg-muted px-2 py-1 rounded text-xs">SUM</code>
                              <span className="text-muted-foreground text-xs">Total sum</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <code className="bg-muted px-2 py-1 rounded text-xs">COUNT</code>
                              <span className="text-muted-foreground text-xs">Count records</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <code className="bg-muted px-2 py-1 rounded text-xs">AVG</code>
                              <span className="text-muted-foreground text-xs">Average value</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <code className="bg-muted px-2 py-1 rounded text-xs">MIN</code>
                              <span className="text-muted-foreground text-xs">Minimum value</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <code className="bg-muted px-2 py-1 rounded text-xs">MAX</code>
                              <span className="text-muted-foreground text-xs">Maximum value</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <h4 className="font-semibold mb-3 text-sm">Example: Sales Pivot Table</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm border-collapse">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left p-2 font-semibold">Category</th>
                                <th className="text-right p-2 font-semibold">Jan</th>
                                <th className="text-right p-2 font-semibold">Feb</th>
                                <th className="text-right p-2 font-semibold">Mar</th>
                                <th className="text-right p-2 font-semibold bg-muted">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b">
                                <td className="p-2">Electronics</td>
                                <td className="text-right p-2">$5,000</td>
                                <td className="text-right p-2">$6,000</td>
                                <td className="text-right p-2">$5,500</td>
                                <td className="text-right p-2 bg-muted font-semibold">$16,500</td>
                              </tr>
                              <tr className="border-b">
                                <td className="p-2">Clothing</td>
                                <td className="text-right p-2">$3,000</td>
                                <td className="text-right p-2">$3,500</td>
                                <td className="text-right p-2">$4,000</td>
                                <td className="text-right p-2 bg-muted font-semibold">$10,500</td>
                              </tr>
                              <tr className="bg-muted font-semibold">
                                <td className="p-2">Total</td>
                                <td className="text-right p-2">$8,000</td>
                                <td className="text-right p-2">$9,500</td>
                                <td className="text-right p-2">$9,500</td>
                                <td className="text-right p-2">$27,000</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <p className="text-xs text-muted-foreground mt-3">
                          <strong>Configuration:</strong> Rows: Category • Columns: Month • Values: SUM(sales_amount)
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Switchboard Tab */}
              <TabsContent value="switchboard" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Switchboards & Navigation</CardTitle>
                        <CardDescription>Create custom navigation menus for your application</CardDescription>
                      </div>
                      <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleCreateSwitchboard}>
                        <Plus className="w-4 h-4 mr-2" />
                        New Switchboard
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Switchboards ({switchboards.length})
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {switchboards.map((switchboard) => (
                          <Card key={switchboard.id} className="border">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <Layout className="w-8 h-8 text-primary" />
                                <div className="flex gap-1">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleEditSwitchboard(switchboard)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="text-destructive"
                                    onClick={() => handleDeleteSwitchboard(switchboard)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              <h3 className="font-semibold mb-1">{switchboard.name}</h3>
                              {switchboard.isDefault && (
                                <Badge className="bg-gray-700 hover:bg-gray-600 text-white mb-2">Default</Badge>
                              )}
                              <p className="text-sm text-muted-foreground mb-2">
                                {switchboard.items} menu items
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Created: {switchboard.created}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-2">About Switchboards</h4>
                      <div className="space-y-3 text-sm">
                        <p><strong>Switchboards:</strong> Create custom navigation menus with buttons to access forms, reports, and other features</p>
                        <p><strong>Navigation Forms:</strong> Design custom navigation interfaces for your application</p>
                        <p><strong>Menu Items:</strong> Add buttons for tables, forms, reports, macros, and external links</p>
                        <p><strong>Default Menu:</strong> Set a switchboard as the default startup screen</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Templates Tab */}
              <TabsContent value="templates" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Data Templates</CardTitle>
                        <CardDescription>Save and reuse table structures and data patterns</CardDescription>
                      </div>
                      <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => alert('Save current table as template')}>
                        <Plus className="w-4 h-4 mr-2" />
                        Save as Template
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Template Cards */}
                      {[
                        {
                          name: 'E-commerce Product',
                          description: 'Standard product table with inventory tracking',
                          columns: 12,
                          category: 'E-commerce',
                          icon: '🛍️'
                        },
                        {
                          name: 'Customer Profile',
                          description: 'Customer information with contact details',
                          columns: 10,
                          category: 'CRM',
                          icon: '👤'
                        },
                        {
                          name: 'Order Management',
                          description: 'Order tracking with status and payment info',
                          columns: 15,
                          category: 'E-commerce',
                          icon: '📦'
                        },
                        {
                          name: 'Blog Post',
                          description: 'Content management for blog articles',
                          columns: 8,
                          category: 'Content',
                          icon: '📝'
                        },
                        {
                          name: 'User Authentication',
                          description: 'User accounts with roles and permissions',
                          columns: 9,
                          category: 'Security',
                          icon: '🔐'
                        },
                        {
                          name: 'Event Calendar',
                          description: 'Event scheduling with attendees',
                          columns: 11,
                          category: 'Scheduling',
                          icon: '📅'
                        }
                      ].map((template, index) => (
                        <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <div className="text-3xl">{template.icon}</div>
                                <Badge variant="secondary">{template.category}</Badge>
                              </div>
                              <div>
                                <h3 className="font-semibold">{template.name}</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {template.description}
                                </p>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                  {template.columns} columns
                                </span>
                                <div className="flex gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => alert(`Preview ${template.name} template`)}
                                  >
                                    <Eye className="w-3 h-3 mr-1" />
                                    Preview
                                  </Button>
                                  <Button className="bg-gray-700 hover:bg-gray-600 text-white" 
                                    size="sm"
                                    onClick={() => alert(`Creating table from ${template.name} template`)}
                                  >
                                    <Plus className="w-3 h-3 mr-1" />
                                    Use
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Custom Templates Section */}
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-4">My Custom Templates</h3>
                      <div className="space-y-3">
                        {[
                          {
                            name: 'My Product Template',
                            table: 'products',
                            columns: 14,
                            created: '2025-10-05',
                            uses: 5
                          },
                          {
                            name: 'Custom Order Flow',
                            table: 'orders',
                            columns: 18,
                            created: '2025-10-03',
                            uses: 3
                          }
                        ].map((template, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-4">
                              <Save className="w-8 h-8 text-primary" />
                              <div>
                                <p className="font-medium">{template.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  Based on {template.table} • {template.columns} columns • Created {template.created}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">{template.uses} uses</Badge>
                              <Button variant="outline" size="sm" onClick={() => toast({ title: 'View Details', description: 'Loading details...' })}>
                                <Eye className="w-3 h-3 mr-1" />
                                View
                              </Button>
                              <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => toast({ title: 'Action Completed', description: 'Completed' })}>
                                <Plus className="w-3 h-3 mr-1" />
                                Use
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => toast({ title: 'Updated', description: 'Data updated successfully' })}>
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => toast({ title: 'Action Completed', description: 'Completed' })}>
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Template Categories */}
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-4">Browse by Category</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['E-commerce', 'CRM', 'Content', 'Security', 'Scheduling', 'Analytics', 'Finance', 'HR'].map((category) => (
                          <Button size="sm" key={category} variant="outline" className="justify-start" onClick={() => toast({ title: 'Action Completed', description: 'Completed' })}>
                            <Database className="w-4 h-4 mr-2" />
                            {category}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>

      {/* Edit Record Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Record</DialogTitle>
            <DialogDescription>
              Modify the record data below
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {selectedRecord && Object.entries(selectedRecord).map(([key, value]) => (
              <div key={key}>
                <Label className="capitalize">{key}</Label>
                <Input
                  defaultValue={value}
                  className="mt-2"
                  disabled={key === 'id'}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSaveRecord}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Record Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Record</DialogTitle>
            <DialogDescription>
              Add a new record to {selectedTable}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {tableColumns.filter(col => col.name !== 'id').map((column) => (
              <div key={column.name}>
                <Label className="capitalize">{column.name}</Label>
                <Input
                  placeholder={`Enter ${column.name}`}
                  className="mt-2"
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSaveRecord}>
              Create Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Record?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this record? This action cannot be undone.
              {recordToDelete && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="font-semibold">Record Details:</p>
                  <pre className="text-xs mt-2">
                    {JSON.stringify(recordToDelete, null, 2)}
                  </pre>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteRecord}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Record
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Table Designer Dialog */}
      <Dialog open={tableDesignerOpen} onOpenChange={setTableDesignerOpen}>
        <DialogContent className="overflow-y-auto" style={{ maxWidth: '95vw', width: '2400px', maxHeight: '85vh' }}>
          <DialogHeader>
            <DialogTitle className="text-2xl">Table Designer</DialogTitle>
            <DialogDescription className="text-base">
              Create or modify table structure
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold">Table Name</Label>
              <Input
                placeholder="Enter table name"
                defaultValue={selectedTable || ''}
                className="mt-2 text-lg h-12"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-base font-semibold">Columns</Label>
                <Button className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleAddColumn} size="lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Column
                </Button>
              </div>
              
              {newTableColumns.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <UITable>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-[420px] text-base font-semibold">Column Name</TableHead>
                        <TableHead className="w-[300px] text-base font-semibold">Data Type</TableHead>
                        <TableHead className="w-[210px] text-base font-semibold">Length</TableHead>
                        <TableHead className="w-[150px] text-center text-base font-semibold">PK</TableHead>
                        <TableHead className="w-[180px] text-center text-base font-semibold">Nullable</TableHead>
                        <TableHead className="w-[180px] text-center text-base font-semibold">Unique</TableHead>
                        <TableHead className="w-[420px] text-base font-semibold">Default Value</TableHead>
                        <TableHead className="w-[210px] text-center text-base font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {newTableColumns.map((column) => (
                        <TableRow key={column.id} className="h-14 cursor-pointer hover:bg-muted/50">
                          <TableCell className="font-mono text-base font-medium">{column.name}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-sm px-3 py-1">{column.dataType}</Badge>
                          </TableCell>
                          <TableCell className="text-base">{column.length || '-'}</TableCell>
                          <TableCell className="text-center">
                            {column.primaryKey && <Badge className="bg-yellow-500 text-sm px-2 py-1">PK</Badge>}
                          </TableCell>
                          <TableCell className="text-center">
                            {column.nullable ? (
                              <Badge variant="outline" className="text-sm px-2 py-1">Yes</Badge>
                            ) : (
                              <Badge variant="destructive" className="text-sm px-2 py-1">No</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {column.unique && <Badge variant="outline" className="text-sm px-2 py-1">Yes</Badge>}
                          </TableCell>
                          <TableCell className="font-mono text-base">
                            {column.defaultValue || '-'}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2 justify-center">
                              <Button
                                size="default"
                                variant="ghost"
                                onClick={() => handleEditColumn(column)}
                                className="h-9"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="default"
                                variant="ghost"
                                onClick={() => handleDeleteColumn(column.id)}
                                className="h-9"
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </UITable>
                </div>
              ) : (
                <div className="border rounded-lg p-8 text-center text-muted-foreground">
                  <Database className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No columns defined yet</p>
                  <p className="text-sm mt-1">Click "Add Column" to start building your table</p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setTableDesignerOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSaveTable} disabled={newTableColumns.length === 0}>
              Save Table
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Column Form Dialog */}
      <Dialog open={columnFormOpen} onOpenChange={setColumnFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingColumn ? 'Edit Column' : 'Add Column'}</DialogTitle>
            <DialogDescription>
              Define the column properties
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            handleSaveColumn({
              name: formData.get('name'),
              dataType: formData.get('dataType'),
              length: formData.get('length'),
              primaryKey: formData.get('primaryKey') === 'on',
              nullable: formData.get('nullable') === 'on',
              unique: formData.get('unique') === 'on',
              autoIncrement: formData.get('autoIncrement') === 'on',
              defaultValue: formData.get('defaultValue'),
            });
          }}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Column Name *</Label>
                  <Input
                    name="name"
                    placeholder="e.g., user_id"
                    defaultValue={editingColumn?.name || ''}
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Data Type *</Label>
                  <Select name="dataType" defaultValue={editingColumn?.dataType || 'VARCHAR'} required>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VARCHAR">VARCHAR</SelectItem>
                      <SelectItem value="INTEGER">INTEGER</SelectItem>
                      <SelectItem value="BIGINT">BIGINT</SelectItem>
                      <SelectItem value="DECIMAL">DECIMAL</SelectItem>
                      <SelectItem value="FLOAT">FLOAT</SelectItem>
                      <SelectItem value="DOUBLE">DOUBLE</SelectItem>
                      <SelectItem value="DATE">DATE</SelectItem>
                      <SelectItem value="DATETIME">DATETIME</SelectItem>
                      <SelectItem value="TIMESTAMP">TIMESTAMP</SelectItem>
                      <SelectItem value="TIME">TIME</SelectItem>
                      <SelectItem value="BOOLEAN">BOOLEAN</SelectItem>
                      <SelectItem value="TEXT">TEXT</SelectItem>
                      <SelectItem value="LONGTEXT">LONGTEXT</SelectItem>
                      <SelectItem value="BLOB">BLOB</SelectItem>
                      <SelectItem value="JSON">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Length/Size</Label>
                  <Input
                    name="length"
                    type="number"
                    placeholder="e.g., 255"
                    defaultValue={editingColumn?.length || ''}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    For VARCHAR, DECIMAL(10,2), etc.
                  </p>
                </div>
                <div>
                  <Label>Default Value</Label>
                  <Input
                    name="defaultValue"
                    placeholder="e.g., 0, NULL, CURRENT_TIMESTAMP"
                    defaultValue={editingColumn?.defaultValue || ''}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="border rounded-lg p-4 space-y-3">
                <Label>Column Properties</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="primaryKey"
                      name="primaryKey"
                      defaultChecked={editingColumn?.primaryKey}
                      className="cursor-pointer"
                    />
                    <Label htmlFor="primaryKey" className="cursor-pointer">
                      Primary Key
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="nullable"
                      name="nullable"
                      defaultChecked={editingColumn?.nullable}
                      className="cursor-pointer"
                    />
                    <Label htmlFor="nullable" className="cursor-pointer">
                      Nullable
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="unique"
                      name="unique"
                      defaultChecked={editingColumn?.unique}
                      className="cursor-pointer"
                    />
                    <Label htmlFor="unique" className="cursor-pointer">
                      Unique
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="autoIncrement"
                      name="autoIncrement"
                      defaultChecked={editingColumn?.autoIncrement}
                      className="cursor-pointer"
                    />
                    <Label htmlFor="autoIncrement" className="cursor-pointer">
                      Auto Increment
                    </Label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button size="sm" type="button" variant="outline" onClick={() => setColumnFormOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" type="submit" className="bg-gray-700 hover:bg-gray-600 text-white">
                {editingColumn ? 'Save Changes' : 'Add Column'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Relationship Dialog */}
      <Dialog open={addRelationshipOpen} onOpenChange={setAddRelationshipOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Relationship</DialogTitle>
            <DialogDescription>
              Define a new relationship between tables
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>From Table</Label>
                <Select>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select table" />
                  </SelectTrigger>
                  <SelectContent>
                    {tables.map(t => (
                      <SelectItem key={t.name} value={t.name}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>From Column</Label>
                <Input placeholder="Column name" className="mt-2" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>To Table</Label>
                <Select>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select table" />
                  </SelectTrigger>
                  <SelectContent>
                    {tables.map(t => (
                      <SelectItem key={t.name} value={t.name}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>To Column</Label>
                <Input placeholder="Column name" className="mt-2" />
              </div>
            </div>
            <div>
              <Label>Relationship Type</Label>
              <Select defaultValue="many-to-one">
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one-to-one">One-to-One</SelectItem>
                  <SelectItem value="one-to-many">One-to-Many</SelectItem>
                  <SelectItem value="many-to-one">Many-to-One</SelectItem>
                  <SelectItem value="many-to-many">Many-to-Many</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>On Delete</Label>
                <Select defaultValue="restrict">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restrict">RESTRICT</SelectItem>
                    <SelectItem value="cascade">CASCADE</SelectItem>
                    <SelectItem value="set-null">SET NULL</SelectItem>
                    <SelectItem value="no-action">NO ACTION</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>On Update</Label>
                <Select defaultValue="restrict">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restrict">RESTRICT</SelectItem>
                    <SelectItem value="cascade">CASCADE</SelectItem>
                    <SelectItem value="set-null">SET NULL</SelectItem>
                    <SelectItem value="no-action">NO ACTION</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setAddRelationshipOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSaveRelationship}>
              Create Relationship
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Relationship Dialog */}
      <Dialog open={editRelationshipOpen} onOpenChange={setEditRelationshipOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Relationship</DialogTitle>
            <DialogDescription>
              Modify the relationship between tables
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedRelationship && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>From Table</Label>
                    <Select defaultValue={selectedRelationship.fromTable}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {tables.map(t => (
                          <SelectItem key={t.name} value={t.name}>{t.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>From Column</Label>
                    <Input defaultValue={selectedRelationship.fromColumn} className="mt-2" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>To Table</Label>
                    <Select defaultValue={selectedRelationship.toTable}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {tables.map(t => (
                          <SelectItem key={t.name} value={t.name}>{t.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>To Column</Label>
                    <Input defaultValue={selectedRelationship.toColumn} className="mt-2" />
                  </div>
                </div>
                <div>
                  <Label>Relationship Type</Label>
                  <Select defaultValue="many-to-one">
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="one-to-one">One-to-One</SelectItem>
                      <SelectItem value="one-to-many">One-to-Many</SelectItem>
                      <SelectItem value="many-to-one">Many-to-One</SelectItem>
                      <SelectItem value="many-to-many">Many-to-Many</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setEditRelationshipOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSaveRelationship}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Relationship Confirmation */}
      <AlertDialog open={deleteRelationshipOpen} onOpenChange={setDeleteRelationshipOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Relationship?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this relationship? This action cannot be undone.
              {selectedRelationship && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="font-semibold">Relationship Details:</p>
                  <div className="text-sm mt-2 space-y-1">
                    <p><span className="font-mono">{selectedRelationship.fromTable}.{selectedRelationship.fromColumn}</span></p>
                    <p className="text-center">↓</p>
                    <p><span className="font-mono">{selectedRelationship.toTable}.{selectedRelationship.toColumn}</span></p>
                    <p className="mt-2"><Badge variant="secondary">{selectedRelationship.type}</Badge></p>
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteRelationship}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Relationship
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Table Confirmation */}
      <AlertDialog open={deleteTableOpen} onOpenChange={setDeleteTableOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Table?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this table? This action cannot be undone and will permanently delete all data in the table.
              {tableToDelete && (
                <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-destructive/20 rounded">
                      <Table className="w-5 h-5 text-destructive" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-destructive">Table: {tableToDelete.name}</p>
                      <div className="text-sm mt-2 space-y-1">
                        <p>• <strong>{tableToDelete.records.toLocaleString()}</strong> records will be deleted</p>
                        <p>• <strong>{tableToDelete.columns}</strong> columns</p>
                        <p>• Size: <strong>{tableToDelete.size}</strong></p>
                        <p>• Last modified: {tableToDelete.lastModified}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteTable}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Table
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Form Builder Dialog */}
      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedForm ? 'Edit Form' : 'Create New Form'}</DialogTitle>
            <DialogDescription>
              {selectedForm ? 'Update your form details and fields' : 'Create a custom form for data entry'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Form Name</Label>
                <Input 
                  placeholder="Enter form name" 
                  value={currentFormName}
                  onChange={(e) => setCurrentFormName(e.target.value)}
                  className="mt-2" 
                />
              </div>
              <div>
                <Label>Target Table</Label>
                <Select value={currentFormTable} onValueChange={setCurrentFormTable}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select table" />
                  </SelectTrigger>
                  <SelectContent>
                    {tables.map((table) => (
                      <SelectItem key={table.name} value={table.name}>
                        {table.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Form Fields ({formFields.length})</Label>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleAddFormField('text')}>
                    <Plus className="w-3 h-3 mr-1" />
                    Text
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleAddFormField('textarea')}>
                    <Plus className="w-3 h-3 mr-1" />
                    Textarea
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleAddFormField('select')}>
                    <Plus className="w-3 h-3 mr-1" />
                    Select
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleAddFormField('checkbox')}>
                    <Plus className="w-3 h-3 mr-1" />
                    Checkbox
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 space-y-2 max-h-60 overflow-y-auto">
                {formFields.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No fields added yet. Click the buttons above to add fields.</p>
                ) : (
                  formFields.map((field) => (
                    <div key={field.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Type className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{field.label}</p>
                          <p className="text-sm text-muted-foreground capitalize">{field.type}</p>
                        </div>
                      </div>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="text-destructive"
                        onClick={() => handleRemoveFormField(field.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setFormDialogOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSaveForm}>
              {selectedForm ? 'Update Form' : 'Create Form'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Form Confirmation */}
      <AlertDialog open={deleteFormOpen} onOpenChange={setDeleteFormOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Form?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this form? This action cannot be undone.
              {formToDelete && (
                <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="font-semibold text-destructive">Form: {formToDelete.name}</p>
                  <p className="text-sm mt-2">• {formToDelete.fields} fields</p>
                  <p className="text-sm">• Target table: {formToDelete.targetTable}</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteForm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Form
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Report Builder Dialog */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedReport ? 'Edit Report' : 'Create New Report'}</DialogTitle>
            <DialogDescription>
              {selectedReport ? 'Update your report details' : 'Create a custom report or visualization'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Report Name</Label>
              <Input 
                placeholder="Enter report name" 
                value={currentReportName}
                onChange={(e) => setCurrentReportName(e.target.value)}
                className="mt-2" 
              />
            </div>
            <div>
              <Label>Data Source</Label>
              <Select value={currentReportSource} onValueChange={setCurrentReportSource}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select data source" />
                </SelectTrigger>
                <SelectContent>
                  {tables.map((table) => (
                    <SelectItem key={table.name} value={table.name}>
                      {table.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Report Type</Label>
              <Select value={currentReportType} onValueChange={setCurrentReportType}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Table">Table Report</SelectItem>
                  <SelectItem value="Chart">Chart/Graph</SelectItem>
                  <SelectItem value="Dashboard">Dashboard</SelectItem>
                  <SelectItem value="Summary">Summary Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setReportDialogOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSaveReport}>
              {selectedReport ? 'Update Report' : 'Create Report'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Report Confirmation */}
      <AlertDialog open={deleteReportOpen} onOpenChange={setDeleteReportOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Report?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this report? This action cannot be undone.
              {reportToDelete && (
                <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="font-semibold text-destructive">Report: {reportToDelete.name}</p>
                  <p className="text-sm mt-2">• Type: {reportToDelete.type}</p>
                  <p className="text-sm">• Data source: {reportToDelete.dataSource}</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteReport}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Report
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Macro Builder Dialog */}
      <Dialog open={macroDialogOpen} onOpenChange={setMacroDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedMacro ? 'Edit Macro' : 'Create New Macro'}</DialogTitle>
            <DialogDescription>
              {selectedMacro ? 'Update your macro details and actions' : 'Create an automated workflow with triggers and actions'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Macro Name</Label>
                <Input 
                  placeholder="Enter macro name" 
                  value={currentMacroName}
                  onChange={(e) => setCurrentMacroName(e.target.value)}
                  className="mt-2" 
                />
              </div>
              <div>
                <Label>Event Trigger</Label>
                <Select value={currentMacroTrigger} onValueChange={setCurrentMacroTrigger}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OnClick">OnClick</SelectItem>
                    <SelectItem value="OnLoad">OnLoad</SelectItem>
                    <SelectItem value="OnChange">OnChange</SelectItem>
                    <SelectItem value="OnSave">OnSave</SelectItem>
                    <SelectItem value="OnDelete">OnDelete</SelectItem>
                    <SelectItem value="OnOrderComplete">OnOrderComplete</SelectItem>
                    <SelectItem value="OnCustomerCreate">OnCustomerCreate</SelectItem>
                    <SelectItem value="OnPriceChange">OnPriceChange</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <div className="mb-3">
                <Label className="mb-2 block">Actions ({macroActions.length})</Label>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleAddMacroAction('OpenForm')}>
                    <Plus className="w-3 h-3 mr-1" />
                    Open Form
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleAddMacroAction('RunQuery')}>
                    <Plus className="w-3 h-3 mr-1" />
                    Run Query
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleAddMacroAction('ShowMessage')}>
                    <Plus className="w-3 h-3 mr-1" />
                    Show Message
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleAddMacroAction('SetValue')}>
                    <Plus className="w-3 h-3 mr-1" />
                    Set Value
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 space-y-2 max-h-60 overflow-y-auto">
                {macroActions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No actions added yet. Click the buttons above to add actions.</p>
                ) : (
                  macroActions.map((action, index) => (
                    <div key={action.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium capitalize">{action.type}</p>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                        </div>
                      </div>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="text-destructive"
                        onClick={() => handleRemoveMacroAction(action.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setMacroDialogOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSaveMacro}>
              {selectedMacro ? 'Update Macro' : 'Create Macro'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Macro Confirmation */}
      <AlertDialog open={deleteMacroOpen} onOpenChange={setDeleteMacroOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Macro?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this macro? This action cannot be undone.
              {macroToDelete && (
                <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="font-semibold text-destructive">Macro: {macroToDelete.name}</p>
                  <p className="text-sm mt-2">• Trigger: {macroToDelete.trigger}</p>
                  <p className="text-sm">• {macroToDelete.actions} actions</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteMacro}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Macro
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Module Editor Dialog */}
      <Dialog open={moduleDialogOpen} onOpenChange={setModuleDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedModule ? 'Edit Module' : 'Create New Module'}</DialogTitle>
            <DialogDescription>
              {selectedModule ? 'Update your module code and details' : 'Write custom JavaScript functions and business logic'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Module Name</Label>
                <Input 
                  placeholder="Enter module name" 
                  value={currentModuleName}
                  onChange={(e) => setCurrentModuleName(e.target.value)}
                  className="mt-2" 
                />
              </div>
              <div>
                <Label>Module Type</Label>
                <Select value={currentModuleType} onValueChange={setCurrentModuleType}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Function">Function</SelectItem>
                    <SelectItem value="Module">Module</SelectItem>
                    <SelectItem value="Class">Class</SelectItem>
                    <SelectItem value="Utility">Utility</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Code Editor</Label>
              <Textarea
                placeholder="// Write your JavaScript code here..."
                value={currentModuleCode}
                onChange={(e) => setCurrentModuleCode(e.target.value)}
                className="mt-2 font-mono text-sm min-h-[400px]"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Write JavaScript code. Example: function calculateTax(amount) {'{ return amount * 0.07; }'}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setModuleDialogOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSaveModule}>
              {selectedModule ? 'Update Module' : 'Create Module'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Module Confirmation */}
      <AlertDialog open={deleteModuleOpen} onOpenChange={setDeleteModuleOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Module?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this module? This action cannot be undone.
              {moduleToDelete && (
                <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="font-semibold text-destructive">Module: {moduleToDelete.name}</p>
                  <p className="text-sm mt-2">• Type: {moduleToDelete.type}</p>
                  <p className="text-sm">• Created: {moduleToDelete.created}</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteModule}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Module
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Validation Rule Dialog */}
      <Dialog open={validationDialogOpen} onOpenChange={setValidationDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedValidation ? 'Edit Validation Rule' : 'Create New Validation Rule'}</DialogTitle>
            <DialogDescription>
              {selectedValidation ? 'Update validation rule details' : 'Define a validation rule for a database field'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Table</Label>
                <Select value={currentValidationTable} onValueChange={setCurrentValidationTable}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select table" />
                  </SelectTrigger>
                  <SelectContent>
                    {tables.map((table) => (
                      <SelectItem key={table.name} value={table.name}>{table.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Field</Label>
                <Input
                  placeholder="Enter field name"
                  value={currentValidationField}
                  onChange={(e) => setCurrentValidationField(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label>Validation Rule</Label>
              <Input
                placeholder="e.g., price > 0, quantity >= 1"
                value={currentValidationRule}
                onChange={(e) => setCurrentValidationRule(e.target.value)}
              />
            </div>
            
            <div>
              <Label>Error Message</Label>
              <Input
                placeholder="Message to show when validation fails"
                value={currentValidationMessage}
                onChange={(e) => setCurrentValidationMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setValidationDialogOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSaveValidation}>
              {selectedValidation ? 'Update Rule' : 'Create Rule'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Validation Confirmation */}
      <AlertDialog open={deleteValidationOpen} onOpenChange={setDeleteValidationOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Validation Rule</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this validation rule? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteValidation}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Rule
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Switchboard Dialog */}
      <Dialog open={switchboardDialogOpen} onOpenChange={setSwitchboardDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedSwitchboard ? 'Edit Switchboard' : 'Create New Switchboard'}</DialogTitle>
            <DialogDescription>
              {selectedSwitchboard ? 'Update switchboard details and menu items' : 'Create a custom navigation menu for your application'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Switchboard Name</Label>
              <Input
                placeholder="Enter switchboard name"
                value={currentSwitchboardName}
                onChange={(e) => setCurrentSwitchboardName(e.target.value)}
              />
            </div>
            
            <div>
              <div className="mb-3">
                <Label className="mb-2 block">Menu Items ({switchboardItems.length})</Label>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleAddSwitchboardItem('Form')}>
                    <Plus className="w-3 h-3 mr-1" />
                    Add Form
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleAddSwitchboardItem('Report')}>
                    <Plus className="w-3 h-3 mr-1" />
                    Add Report
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleAddSwitchboardItem('Table')}>
                    <Plus className="w-3 h-3 mr-1" />
                    Add Table
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleAddSwitchboardItem('Macro')}>
                    <Plus className="w-3 h-3 mr-1" />
                    Add Macro
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 space-y-2 max-h-60 overflow-y-auto">
                {switchboardItems.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No menu items added yet. Click the buttons above to add items.</p>
                ) : (
                  switchboardItems.map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium capitalize">{item.type}</p>
                          <p className="text-sm text-muted-foreground">{item.label}</p>
                        </div>
                      </div>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="text-destructive"
                        onClick={() => handleRemoveSwitchboardItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setSwitchboardDialogOpen(false)}>Cancel</Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSaveSwitchboard}>
              {selectedSwitchboard ? 'Update Switchboard' : 'Create Switchboard'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Switchboard Confirmation */}
      <AlertDialog open={deleteSwitchboardOpen} onOpenChange={setDeleteSwitchboardOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Switchboard</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this switchboard? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteSwitchboard}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Switchboard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Save Query Dialog */}
      <Dialog open={saveQueryDialogOpen} onOpenChange={setSaveQueryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Query</DialogTitle>
            <DialogDescription>
              Save this query for later use
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Query Name</Label>
              <Input
                placeholder="Enter query name"
                value={currentQueryName}
                onChange={(e) => setCurrentQueryName(e.target.value)}
              />
            </div>
            <div>
              <Label>SQL Query</Label>
              <Textarea
                value={sqlQuery}
                readOnly
                className="font-mono text-sm"
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setSaveQueryDialogOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSaveQuery}>
              <Save className="w-4 h-4 mr-2" />
              Save Query
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Saved Query Dialog */}
      <AlertDialog open={deleteSavedQueryOpen} onOpenChange={setDeleteSavedQueryOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Saved Query</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{queryToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteSavedQuery}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Query
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Parameter Query Dialog */}
      <Dialog open={paramQueryDialogOpen} onOpenChange={setParamQueryDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedParamQuery ? 'Edit Parameter Query' : 'Create New Parameter Query'}</DialogTitle>
            <DialogDescription>
              {selectedParamQuery ? 'Update query details and parameters' : 'Create a reusable query with parameters'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Query Name</Label>
              <Input
                placeholder="Enter query name"
                value={currentParamQueryName}
                onChange={(e) => setCurrentParamQueryName(e.target.value)}
              />
            </div>
            
            <div>
              <Label>SQL Query (use :paramName for parameters)</Label>
              <div className="mt-2 border rounded-lg overflow-hidden">
                <CodeMirror
                  value={currentParamQuerySQL}
                  height="150px"
                  extensions={[sql()]}
                  theme={oneDark}
                  onChange={(value) => setCurrentParamQuerySQL(value)}
                  placeholder="SELECT * FROM table WHERE column >= :paramName"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Parameters ({currentParameters.length})</Label>
                <Button size="sm" variant="outline" onClick={handleAddParameter}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Parameter
                </Button>
              </div>
              
              <div className="border rounded-lg p-4 space-y-3 max-h-60 overflow-y-auto">
                {currentParameters.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No parameters defined. Click "Add Parameter" to add one.</p>
                ) : (
                  currentParameters.map((param, index) => (
                    <div key={index} className="border rounded-lg p-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold">Parameter {index + 1}</Label>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() => handleRemoveParameter(index)}
                        >
                          <Trash2 className="w-3 h-3 text-destructive" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Parameter Name</Label>
                          <Input
                            placeholder="paramName"
                            value={param.name}
                            onChange={(e) => handleUpdateParameter(index, 'name', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Type</Label>
                          <Select
                            value={param.type}
                            onValueChange={(value) => handleUpdateParameter(index, 'type', value)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="date">Date</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Default Value</Label>
                          <Input
                            placeholder="Default value"
                            value={param.defaultValue}
                            onChange={(e) => handleUpdateParameter(index, 'defaultValue', e.target.value)}
                            type={param.type === 'number' ? 'number' : param.type === 'date' ? 'date' : 'text'}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Description</Label>
                          <Input
                            placeholder="Parameter description"
                            value={param.description}
                            onChange={(e) => handleUpdateParameter(index, 'description', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setParamQueryDialogOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSaveParamQuery}>
              <Save className="w-4 h-4 mr-2" />
              {selectedParamQuery ? 'Update Query' : 'Save Query'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Parameter Query Dialog */}
      <AlertDialog open={deleteParamQueryOpen} onOpenChange={setDeleteParamQueryOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Parameter Query</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{paramQueryToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteParamQuery}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Query
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Execute Parameter Query Dialog */}
      <Dialog open={executeParamQueryOpen} onOpenChange={setExecuteParamQueryOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Execute Parameter Query</DialogTitle>
            <DialogDescription>
              Fill in the parameter values to execute "{paramQueryToExecute?.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-muted/30">
              <Label className="text-sm font-semibold mb-2 block">Query</Label>
              <p className="text-sm font-mono">{paramQueryToExecute?.query}</p>
            </div>

            <div className="space-y-3">
              <Label className="font-semibold">Parameters</Label>
              {paramQueryToExecute?.parameters.map((param) => (
                <div key={param.name}>
                  <Label className="text-sm">
                    {param.name} 
                    {param.description && <span className="text-muted-foreground ml-2">({param.description})</span>}
                  </Label>
                  <Input
                    type={param.type === 'number' ? 'number' : param.type === 'date' ? 'date' : 'text'}
                    value={parameterValues[param.name] || ''}
                    onChange={(e) => setParameterValues({...parameterValues, [param.name]: e.target.value})}
                    placeholder={`Enter ${param.name}`}
                    className="mt-1"
                  />
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setExecuteParamQueryOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleRunParamQuery}>
              <Play className="w-4 h-4 mr-2" />
              Execute Query
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Subform Dialog (NEW FEATURE) */}
      <Dialog open={subformDialogOpen} onOpenChange={setSubformDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedSubform ? 'Edit Subform' : 'Add Subform'}</DialogTitle>
            <DialogDescription>
              Configure a subform to display related records in {editingFormForSubform?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Subform Name</Label>
                <Input
                  placeholder="e.g., Order Items"
                  value={currentSubformName}
                  onChange={(e) => setCurrentSubformName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Target Table</Label>
                <Select value={currentSubformTable} onValueChange={setCurrentSubformTable}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select table" />
                  </SelectTrigger>
                  <SelectContent>
                    {tables.map((table) => (
                      <SelectItem key={table.name} value={table.name}>
                        {table.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Link Field (in subform table)</Label>
                <Input
                  placeholder="e.g., order_id"
                  value={currentSubformLinkField}
                  onChange={(e) => setCurrentSubformLinkField(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Parent Field (in master form)</Label>
                <Input
                  placeholder="e.g., id"
                  value={currentSubformParentField}
                  onChange={(e) => setCurrentSubformParentField(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label>Display Type</Label>
              <Select value={currentSubformDisplayType} onValueChange={setCurrentSubformDisplayType}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="table">Table (Grid)</SelectItem>
                  <SelectItem value="list">List View</SelectItem>
                  <SelectItem value="cards">Card View</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border rounded-lg p-4 bg-muted/30">
              <h4 className="font-semibold mb-2 text-sm">How it works:</h4>
              <p className="text-sm text-muted-foreground">
                The subform will display records from <strong>{currentSubformTable || '[target table]'}</strong> where{' '}
                <code className="bg-muted px-1 rounded">{currentSubformLinkField || '[link field]'}</code> matches the{' '}
                <code className="bg-muted px-1 rounded">{currentSubformParentField || '[parent field]'}</code> value in the master form.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setSubformDialogOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSaveSubform}>
              <Save className="w-4 h-4 mr-2" />
              {selectedSubform ? 'Update' : 'Add'} Subform
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Subreport Dialog (NEW FEATURE) */}
      <Dialog open={subreportDialogOpen} onOpenChange={setSubreportDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedSubreport ? 'Edit Subreport' : 'Add Subreport'}</DialogTitle>
            <DialogDescription>
              Configure a subreport to display related data in {editingReportForSubreport?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Subreport Name</Label>
                <Input
                  placeholder="e.g., Customer Orders"
                  value={currentSubreportName}
                  onChange={(e) => setCurrentSubreportName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Data Source</Label>
                <Select value={currentSubreportSource} onValueChange={setCurrentSubreportSource}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select table" />
                  </SelectTrigger>
                  <SelectContent>
                    {tables.map((table) => (
                      <SelectItem key={table.name} value={table.name}>
                        {table.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Link Field (in subreport)</Label>
                <Input
                  placeholder="e.g., customer_id"
                  value={currentSubreportLinkField}
                  onChange={(e) => setCurrentSubreportLinkField(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Parent Field (in master report)</Label>
                <Input
                  placeholder="e.g., id"
                  value={currentSubreportParentField}
                  onChange={(e) => setCurrentSubreportParentField(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label>Display Type</Label>
              <Select value={currentSubreportDisplayType} onValueChange={setCurrentSubreportDisplayType}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="table">Table</SelectItem>
                  <SelectItem value="chart">Chart</SelectItem>
                  <SelectItem value="summary">Summary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Aggregations</Label>
                <Button size="sm" variant="outline" onClick={handleAddAggregation}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Aggregation
                </Button>
              </div>
              <div className="border rounded-lg p-3 space-y-2">
                {currentSubreportAggregations.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-2">No aggregations added</p>
                ) : (
                  currentSubreportAggregations.map((agg, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Select value={agg} onValueChange={(value) => handleUpdateAggregation(index, value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="count">Count</SelectItem>
                          <SelectItem value="sum:total">Sum (total)</SelectItem>
                          <SelectItem value="avg:price">Average (price)</SelectItem>
                          <SelectItem value="min:date">Min (date)</SelectItem>
                          <SelectItem value="max:date">Max (date)</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleRemoveAggregation(index)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-muted/30">
              <h4 className="font-semibold mb-2 text-sm">How it works:</h4>
              <p className="text-sm text-muted-foreground">
                The subreport will display records from <strong>{currentSubreportSource || '[data source]'}</strong> where{' '}
                <code className="bg-muted px-1 rounded">{currentSubreportLinkField || '[link field]'}</code> matches the{' '}
                <code className="bg-muted px-1 rounded">{currentSubreportParentField || '[parent field]'}</code> value in the master report.
                {currentSubreportAggregations.length > 0 && (
                  <> Aggregations will be calculated and displayed: <strong>{currentSubreportAggregations.join(', ')}</strong>.</>
                )}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setSubreportDialogOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSaveSubreport}>
              <Save className="w-4 h-4 mr-2" />
              {selectedSubreport ? 'Update' : 'Add'} Subreport
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Expression Builder Dialog (NEW FEATURE) */}
      <Dialog open={expressionDialogOpen} onOpenChange={setExpressionDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedExpression ? 'Edit Calculated Field' : 'Create Calculated Field'}</DialogTitle>
            <DialogDescription>
              Build expressions using fields, operators, and functions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Table</Label>
                <Select value={currentExpressionTable} onValueChange={setCurrentExpressionTable}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select table" />
                  </SelectTrigger>
                  <SelectContent>
                    {tables.map((table) => (
                      <SelectItem key={table.name} value={table.name}>
                        {table.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Field Name</Label>
                <Input
                  placeholder="e.g., total_with_tax"
                  value={currentExpressionFieldName}
                  onChange={(e) => setCurrentExpressionFieldName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Data Type</Label>
                <Select value={currentExpressionDataType} onValueChange={setCurrentExpressionDataType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="decimal">Decimal</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="boolean">Boolean</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Input
                placeholder="Describe what this field calculates"
                value={currentExpressionDescription}
                onChange={(e) => setCurrentExpressionDescription(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Expression Formula</Label>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={expressionBuilderMode === 'visual' ? 'default' : 'outline'}
                    onClick={() => setExpressionBuilderMode('visual')}
                  >
                    Visual
                  </Button>
                  <Button
                    size="sm"
                    variant={expressionBuilderMode === 'text' ? 'default' : 'outline'}
                    onClick={() => setExpressionBuilderMode('text')}
                  >
                    Text
                  </Button>
                </div>
              </div>

              {expressionBuilderMode === 'visual' ? (
                <div className="space-y-3">
                  <div className="border rounded-lg p-3 bg-muted/30 font-mono text-sm min-h-[60px]">
                    {currentExpressionFormula || 'Build your expression using the buttons below...'}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label className="text-xs mb-2 block">Fields</Label>
                      <div className="space-y-1">
                        <Button size="sm" variant="outline" className="w-full justify-start" onClick={() => handleInsertField('price')}>
                          [price]
                        </Button>
                        <Button size="sm" variant="outline" className="w-full justify-start" onClick={() => handleInsertField('cost')}>
                          [cost]
                        </Button>
                        <Button size="sm" variant="outline" className="w-full justify-start" onClick={() => handleInsertField('quantity')}>
                          [quantity]
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs mb-2 block">Operators</Label>
                      <div className="grid grid-cols-3 gap-1">
                        <Button size="sm" variant="outline" onClick={() => handleInsertOperator('+')}>+</Button>
                        <Button size="sm" variant="outline" onClick={() => handleInsertOperator('-')}>-</Button>
                        <Button size="sm" variant="outline" onClick={() => handleInsertOperator('*')}>×</Button>
                        <Button size="sm" variant="outline" onClick={() => handleInsertOperator('/')}>÷</Button>
                        <Button size="sm" variant="outline" onClick={() => handleInsertOperator('&')}>&</Button>
                        <Button size="sm" variant="outline" onClick={() => handleInsertOperator('=')}>=</Button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs mb-2 block">Functions</Label>
                      <div className="space-y-1">
                        <Button size="sm" variant="outline" className="w-full justify-start" onClick={() => handleInsertFunction('SUM')}>
                          SUM()
                        </Button>
                        <Button size="sm" variant="outline" className="w-full justify-start" onClick={() => handleInsertFunction('AVG')}>
                          AVG()
                        </Button>
                        <Button size="sm" variant="outline" className="w-full justify-start" onClick={() => handleInsertFunction('IF')}>
                          IF()
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button size="sm" variant="ghost" className="w-full" onClick={() => setCurrentExpressionFormula('')}>
                    Clear Expression
                  </Button>
                </div>
              ) : (
                <Textarea
                  placeholder="Enter expression formula (e.g., [price] * [quantity])"
                  value={currentExpressionFormula}
                  onChange={(e) => setCurrentExpressionFormula(e.target.value)}
                  rows={4}
                  className="font-mono"
                />
              )}
            </div>

            <div className="border rounded-lg p-3 bg-blue-50 dark:bg-blue-950/30">
              <p className="text-sm">
                <strong>Preview:</strong> {currentExpressionFieldName || '[field_name]'} ={' '}
                <code className="bg-muted px-1 rounded">{currentExpressionFormula || '[expression]'}</code>
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setExpressionDialogOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSaveExpression}>
              <Save className="w-4 h-4 mr-2" />
              {selectedExpression ? 'Update' : 'Create'} Field
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Expression Dialog */}
      <AlertDialog open={deleteExpressionOpen} onOpenChange={setDeleteExpressionOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Calculated Field</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{expressionToDelete?.fieldName}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteExpression}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Field
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Pivot Table Dialog (NEW FEATURE) */}
      <Dialog open={pivotDialogOpen} onOpenChange={setPivotDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedPivot ? 'Edit Pivot Table' : 'Create Pivot Table'}</DialogTitle>
            <DialogDescription>
              Configure rows, columns, and values to create a pivot table analysis
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Pivot Table Name</Label>
                <Input
                  placeholder="e.g., Sales by Region and Month"
                  value={currentPivotName}
                  onChange={(e) => setCurrentPivotName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Data Source</Label>
                <Select value={currentPivotSource} onValueChange={setCurrentPivotSource}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select table" />
                  </SelectTrigger>
                  <SelectContent>
                    {tables.map((table) => (
                      <SelectItem key={table.name} value={table.name}>
                        {table.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Row Fields */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-semibold">Row Fields</Label>
                  <Badge variant="secondary">{currentPivotRowFields.length}</Badge>
                </div>
                <div className="space-y-2 mb-3">
                  {currentPivotRowFields.map((field, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-muted p-2 rounded">
                      <span className="text-sm">{field}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => handleRemoveRowField(field)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                  {currentPivotRowFields.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-2">No row fields</p>
                  )}
                </div>
                <Select onValueChange={handleAddRowField}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Add field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="category">category</SelectItem>
                    <SelectItem value="product">product</SelectItem>
                    <SelectItem value="region">region</SelectItem>
                    <SelectItem value="customer">customer</SelectItem>
                    <SelectItem value="brand">brand</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Column Fields */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-semibold">Column Fields</Label>
                  <Badge variant="secondary">{currentPivotColumnFields.length}</Badge>
                </div>
                <div className="space-y-2 mb-3">
                  {currentPivotColumnFields.map((field, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-muted p-2 rounded">
                      <span className="text-sm">{field}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => handleRemoveColumnField(field)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                  {currentPivotColumnFields.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-2">No column fields</p>
                  )}
                </div>
                <Select onValueChange={handleAddColumnField}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Add field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">month</SelectItem>
                    <SelectItem value="quarter">quarter</SelectItem>
                    <SelectItem value="year">year</SelectItem>
                    <SelectItem value="status">status</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Value Fields */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-semibold">Value Fields</Label>
                  <Button size="sm" variant="ghost" className="h-6 px-2" onClick={handleAddValueField}>
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {currentPivotValueFields.map((vf, idx) => (
                    <div key={idx} className="space-y-1 bg-muted p-2 rounded">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">Value {idx + 1}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-5 w-5"
                          onClick={() => handleRemoveValueField(idx)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      <Select
                        value={vf.field}
                        onValueChange={(value) => handleUpdateValueField(idx, 'field', value)}
                      >
                        <SelectTrigger className="h-7 text-xs">
                          <SelectValue placeholder="Field" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="amount">amount</SelectItem>
                          <SelectItem value="sales">sales</SelectItem>
                          <SelectItem value="quantity">quantity</SelectItem>
                          <SelectItem value="price">price</SelectItem>
                          <SelectItem value="cost">cost</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select
                        value={vf.aggregation}
                        onValueChange={(value) => handleUpdateValueField(idx, 'aggregation', value)}
                      >
                        <SelectTrigger className="h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sum">SUM</SelectItem>
                          <SelectItem value="count">COUNT</SelectItem>
                          <SelectItem value="avg">AVERAGE</SelectItem>
                          <SelectItem value="min">MIN</SelectItem>
                          <SelectItem value="max">MAX</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                  {currentPivotValueFields.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-2">No value fields</p>
                  )}
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-muted/30">
              <h4 className="font-semibold mb-2 text-sm">Preview Configuration</h4>
              <div className="text-sm space-y-1">
                <p>
                  <strong>Rows:</strong>{' '}
                  {currentPivotRowFields.length > 0 ? currentPivotRowFields.join(', ') : 'None'}
                </p>
                <p>
                  <strong>Columns:</strong>{' '}
                  {currentPivotColumnFields.length > 0 ? currentPivotColumnFields.join(', ') : 'None'}
                </p>
                <p>
                  <strong>Values:</strong>{' '}
                  {currentPivotValueFields.length > 0
                    ? currentPivotValueFields.map(vf => `${vf.aggregation}(${vf.field})`).join(', ')
                    : 'None'}
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setPivotDialogOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={handleSavePivot}>
              <Save className="w-4 h-4 mr-2" />
              {selectedPivot ? 'Update' : 'Create'} Pivot Table
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pivot Preview Dialog (NEW FEATURE) */}
      <Dialog open={pivotPreviewOpen} onOpenChange={setPivotPreviewOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{pivotToPreview?.name}</DialogTitle>
            <DialogDescription>
              Pivot table preview with sample data
            </DialogDescription>
          </DialogHeader>
          {pivotToPreview && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="text-sm">
                  <p><strong>Data Source:</strong> {pivotToPreview.dataSource}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Rows: {pivotToPreview.rowFields.join(', ')} • 
                    Columns: {pivotToPreview.columnFields.join(', ')} • 
                    Values: {pivotToPreview.valueFields.map(vf => `${vf.aggregation}(${vf.field})`).join(', ')}
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={() => toast({ title: 'Export', description: 'Exporting data...' })}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>

              <div className="border rounded-lg overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3 font-semibold border-r">
                        {pivotToPreview.rowFields[0] || 'Row'}
                      </th>
                      <th className="text-right p-3 font-semibold">Q1</th>
                      <th className="text-right p-3 font-semibold">Q2</th>
                      <th className="text-right p-3 font-semibold">Q3</th>
                      <th className="text-right p-3 font-semibold">Q4</th>
                      <th className="text-right p-3 font-semibold bg-primary/10 border-l">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t hover:bg-muted/50">
                      <td className="p-3 font-medium border-r">Electronics</td>
                      <td className="text-right p-3">$45,200</td>
                      <td className="text-right p-3">$52,100</td>
                      <td className="text-right p-3">$48,900</td>
                      <td className="text-right p-3">$61,300</td>
                      <td className="text-right p-3 font-semibold bg-primary/5 border-l">$207,500</td>
                    </tr>
                    <tr className="border-t hover:bg-muted/50">
                      <td className="p-3 font-medium border-r">Clothing</td>
                      <td className="text-right p-3">$28,400</td>
                      <td className="text-right p-3">$31,200</td>
                      <td className="text-right p-3">$29,800</td>
                      <td className="text-right p-3">$35,600</td>
                      <td className="text-right p-3 font-semibold bg-primary/5 border-l">$125,000</td>
                    </tr>
                    <tr className="border-t hover:bg-muted/50">
                      <td className="p-3 font-medium border-r">Home & Garden</td>
                      <td className="text-right p-3">$19,500</td>
                      <td className="text-right p-3">$22,300</td>
                      <td className="text-right p-3">$21,100</td>
                      <td className="text-right p-3">$24,800</td>
                      <td className="text-right p-3 font-semibold bg-primary/5 border-l">$87,700</td>
                    </tr>
                    <tr className="border-t bg-muted font-semibold">
                      <td className="p-3 border-r">Total</td>
                      <td className="text-right p-3">$93,100</td>
                      <td className="text-right p-3">$105,600</td>
                      <td className="text-right p-3">$99,800</td>
                      <td className="text-right p-3">$121,700</td>
                      <td className="text-right p-3 bg-primary/10 border-l">$420,200</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm">
                  <strong>Note:</strong> This is a preview with sample data. 
                  In production, this would display actual aggregated data from your database based on the configured fields and aggregations.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button size="sm" className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => setPivotPreviewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Pivot Dialog */}
      <AlertDialog open={deletePivotOpen} onOpenChange={setDeletePivotOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Pivot Table</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{pivotToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeletePivot}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Pivot Table
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
