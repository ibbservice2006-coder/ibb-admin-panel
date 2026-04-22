// Mock database schema for ERD demonstration
export const mockSchema = {
  tables: [
    {
      id: 'customers',
      name: 'customers',
      position: { x: 100, y: 100 },
      fields: [
        { name: 'id', type: 'INT', primaryKey: true, nullable: false },
        { name: 'name', type: 'VARCHAR(100)', nullable: false },
        { name: 'email', type: 'VARCHAR(100)', nullable: false, unique: true },
        { name: 'phone', type: 'VARCHAR(20)', nullable: true },
        { name: 'address', type: 'TEXT', nullable: true },
        { name: 'created_at', type: 'DATETIME', nullable: false, default: 'CURRENT_TIMESTAMP' },
        { name: 'updated_at', type: 'DATETIME', nullable: true }
      ]
    },
    {
      id: 'orders',
      name: 'orders',
      position: { x: 500, y: 100 },
      fields: [
        { name: 'id', type: 'INT', primaryKey: true, nullable: false },
        { name: 'customer_id', type: 'INT', nullable: false, foreignKey: { table: 'customers', field: 'id' } },
        { name: 'order_number', type: 'VARCHAR(50)', nullable: false, unique: true },
        { name: 'total_amount', type: 'DECIMAL(10,2)', nullable: false },
        { name: 'status', type: 'ENUM', values: ['pending', 'processing', 'completed', 'cancelled'], nullable: false },
        { name: 'payment_method', type: 'VARCHAR(50)', nullable: true },
        { name: 'shipping_address', type: 'TEXT', nullable: true },
        { name: 'created_at', type: 'DATETIME', nullable: false, default: 'CURRENT_TIMESTAMP' },
        { name: 'updated_at', type: 'DATETIME', nullable: true }
      ]
    },
    {
      id: 'products',
      name: 'products',
      position: { x: 900, y: 100 },
      fields: [
        { name: 'id', type: 'INT', primaryKey: true, nullable: false },
        { name: 'category_id', type: 'INT', nullable: true, foreignKey: { table: 'categories', field: 'id' } },
        { name: 'name', type: 'VARCHAR(200)', nullable: false },
        { name: 'description', type: 'TEXT', nullable: true },
        { name: 'price', type: 'DECIMAL(10,2)', nullable: false },
        { name: 'stock_quantity', type: 'INT', nullable: false, default: '0' },
        { name: 'sku', type: 'VARCHAR(50)', nullable: false, unique: true },
        { name: 'image_url', type: 'VARCHAR(255)', nullable: true },
        { name: 'is_active', type: 'BOOLEAN', nullable: false, default: 'true' },
        { name: 'created_at', type: 'DATETIME', nullable: false, default: 'CURRENT_TIMESTAMP' },
        { name: 'updated_at', type: 'DATETIME', nullable: true }
      ]
    },
    {
      id: 'order_items',
      name: 'order_items',
      position: { x: 500, y: 450 },
      fields: [
        { name: 'id', type: 'INT', primaryKey: true, nullable: false },
        { name: 'order_id', type: 'INT', nullable: false, foreignKey: { table: 'orders', field: 'id' } },
        { name: 'product_id', type: 'INT', nullable: false, foreignKey: { table: 'products', field: 'id' } },
        { name: 'quantity', type: 'INT', nullable: false },
        { name: 'unit_price', type: 'DECIMAL(10,2)', nullable: false },
        { name: 'subtotal', type: 'DECIMAL(10,2)', nullable: false },
        { name: 'discount', type: 'DECIMAL(10,2)', nullable: true, default: '0' }
      ]
    },
    {
      id: 'categories',
      name: 'categories',
      position: { x: 900, y: 450 },
      fields: [
        { name: 'id', type: 'INT', primaryKey: true, nullable: false },
        { name: 'parent_id', type: 'INT', nullable: true, foreignKey: { table: 'categories', field: 'id' } },
        { name: 'name', type: 'VARCHAR(100)', nullable: false },
        { name: 'description', type: 'TEXT', nullable: true },
        { name: 'slug', type: 'VARCHAR(100)', nullable: false, unique: true },
        { name: 'image_url', type: 'VARCHAR(255)', nullable: true },
        { name: 'is_active', type: 'BOOLEAN', nullable: false, default: 'true' },
        { name: 'created_at', type: 'DATETIME', nullable: false, default: 'CURRENT_TIMESTAMP' }
      ]
    },
    {
      id: 'payments',
      name: 'payments',
      position: { x: 100, y: 450 },
      fields: [
        { name: 'id', type: 'INT', primaryKey: true, nullable: false },
        { name: 'order_id', type: 'INT', nullable: false, foreignKey: { table: 'orders', field: 'id' } },
        { name: 'amount', type: 'DECIMAL(10,2)', nullable: false },
        { name: 'payment_method', type: 'VARCHAR(50)', nullable: false },
        { name: 'transaction_id', type: 'VARCHAR(100)', nullable: true, unique: true },
        { name: 'status', type: 'ENUM', values: ['pending', 'completed', 'failed', 'refunded'], nullable: false },
        { name: 'paid_at', type: 'DATETIME', nullable: true },
        { name: 'created_at', type: 'DATETIME', nullable: false, default: 'CURRENT_TIMESTAMP' }
      ]
    }
  ],
  relationships: [
    {
      id: 'rel-1',
      from: 'orders',
      to: 'customers',
      type: 'many-to-one',
      fromField: 'customer_id',
      toField: 'id',
      label: '1:N'
    },
    {
      id: 'rel-2',
      from: 'order_items',
      to: 'orders',
      type: 'many-to-one',
      fromField: 'order_id',
      toField: 'id',
      label: '1:N'
    },
    {
      id: 'rel-3',
      from: 'order_items',
      to: 'products',
      type: 'many-to-one',
      fromField: 'product_id',
      toField: 'id',
      label: '1:N'
    },
    {
      id: 'rel-4',
      from: 'products',
      to: 'categories',
      type: 'many-to-one',
      fromField: 'category_id',
      toField: 'id',
      label: '1:N'
    },
    {
      id: 'rel-5',
      from: 'categories',
      to: 'categories',
      type: 'many-to-one',
      fromField: 'parent_id',
      toField: 'id',
      label: '1:N (self)'
    },
    {
      id: 'rel-6',
      from: 'payments',
      to: 'orders',
      type: 'many-to-one',
      fromField: 'order_id',
      toField: 'id',
      label: '1:N'
    }
  ]
}
