// Mock data for sync logs
export const mockLogs = [
  {
    id: 1,
    timestamp: '2024-10-03T08:45:00',
    platform: 'Amazon Seller',
    type: 'Product Sync',
    status: 'success',
    level: 'info',
    message: 'Successfully synced 45 products',
    duration: '2.3s',
    durationSeconds: 2.3,
    details: { synced: 45, failed: 0, skipped: 0 },
    errorDetails: null,
    requestId: 'req_amazon_prod_001',
    endpoint: '/api/v1/products/sync',
    retryable: false,
    requestData: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ***' },
      payload: { products: ['SKU-001', 'SKU-002', 'SKU-003'] }
    },
    responseData: {
      statusCode: 200,
      body: { success: true, synced: 45, message: 'Sync completed' },
      headers: { 'Content-Type': 'application/json' }
    },
    performanceMetrics: {
      networkLatency: 0.5,
      processingTime: 1.8,
      queueTime: 0
    }
  },
  {
    id: 2,
    timestamp: '2024-10-03T08:30:00',
    platform: 'Shopee Thailand',
    type: 'Order Sync',
    status: 'success',
    level: 'info',
    message: 'Successfully synced 12 orders',
    duration: '1.8s',
    durationSeconds: 1.8,
    details: { synced: 12, failed: 0, skipped: 0 },
    errorDetails: null,
    requestId: 'req_shopee_order_002',
    endpoint: '/api/v1/orders/sync',
    retryable: false,
    requestData: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      payload: { orders: ['ORD-001', 'ORD-002'] }
    },
    responseData: {
      statusCode: 200,
      body: { success: true, synced: 12 }
    },
    performanceMetrics: {
      networkLatency: 0.3,
      processingTime: 1.5,
      queueTime: 0
    }
  },
  {
    id: 3,
    timestamp: '2024-10-03T08:15:00',
    platform: 'Lazada Official Store',
    type: 'Inventory Sync',
    status: 'warning',
    level: 'warning',
    message: 'Synced with warnings: 3 items out of stock',
    duration: '3.1s',
    durationSeconds: 3.1,
    details: { synced: 28, failed: 0, skipped: 3 },
    errorDetails: {
      warnings: [
        'Product SKU-001: Out of stock',
        'Product SKU-045: Out of stock',
        'Product SKU-089: Out of stock'
      ]
    },
    requestId: 'req_lazada_inv_003',
    endpoint: '/api/v1/inventory/sync',
    retryable: false,
    requestData: {
      method: 'POST',
      payload: { items: 31 }
    },
    responseData: {
      statusCode: 200,
      body: { success: true, warnings: 3 }
    },
    performanceMetrics: {
      networkLatency: 0.8,
      processingTime: 2.3,
      queueTime: 0
    }
  },
  {
    id: 4,
    timestamp: '2024-10-03T08:00:00',
    platform: 'LINE Shopping',
    type: 'Product Sync',
    status: 'error',
    level: 'error',
    message: 'Failed to sync: API rate limit exceeded',
    duration: '0.5s',
    durationSeconds: 0.5,
    details: { synced: 0, failed: 15, skipped: 0 },
    errorDetails: {
      error: 'RateLimitExceeded',
      message: 'API rate limit exceeded. Please try again in 60 seconds.',
      code: 429,
      retryAfter: 60
    },
    requestId: 'req_line_prod_004',
    endpoint: '/api/v1/products/sync',
    retryable: true,
    requestData: {
      method: 'POST',
      payload: { products: 15 }
    },
    responseData: {
      statusCode: 429,
      body: { error: 'Rate limit exceeded' }
    },
    performanceMetrics: {
      networkLatency: 0.2,
      processingTime: 0.3,
      queueTime: 0
    }
  },
  {
    id: 5,
    timestamp: '2024-10-03T07:45:00',
    platform: 'Stripe Production',
    type: 'Payment Sync',
    status: 'success',
    level: 'info',
    message: 'Successfully synced 8 payments',
    duration: '1.2s',
    durationSeconds: 1.2,
    details: { synced: 8, failed: 0, skipped: 0 },
    errorDetails: null,
    requestId: 'req_stripe_pay_005',
    endpoint: '/api/v1/payments/sync',
    retryable: false,
    requestData: {
      method: 'GET',
      params: { limit: 100, status: 'succeeded' }
    },
    responseData: {
      statusCode: 200,
      body: { data: [], has_more: false }
    },
    performanceMetrics: {
      networkLatency: 0.4,
      processingTime: 0.8,
      queueTime: 0
    }
  },
  {
    id: 6,
    timestamp: '2024-10-03T07:30:00',
    platform: 'PayPal Business',
    type: 'Payment Sync',
    status: 'error',
    level: 'critical',
    message: 'Critical: Payment gateway connection failed',
    duration: '0.2s',
    durationSeconds: 0.2,
    details: { synced: 0, failed: 5, skipped: 0 },
    errorDetails: {
      error: 'ConnectionTimeout',
      message: 'Unable to connect to PayPal API gateway',
      code: 'ETIMEDOUT',
      stackTrace: 'Error: connect ETIMEDOUT\n    at TCPConnectWrap.afterConnect'
    },
    requestId: 'req_paypal_pay_006',
    endpoint: '/api/v1/payments/sync',
    retryable: true,
    requestData: {
      method: 'GET',
      timeout: 5000
    },
    responseData: null,
    performanceMetrics: {
      networkLatency: null,
      processingTime: 0.2,
      queueTime: 0
    }
  },
  {
    id: 7,
    timestamp: '2024-10-03T07:15:00',
    platform: 'TikTok Shop',
    type: 'Order Sync',
    status: 'success',
    level: 'debug',
    message: 'Debug: Synced 3 orders with detailed logging',
    duration: '2.5s',
    durationSeconds: 2.5,
    details: { synced: 3, failed: 0, skipped: 0 },
    errorDetails: null,
    requestId: 'req_tiktok_order_007',
    endpoint: '/api/v1/orders/sync',
    retryable: false,
    requestData: {
      method: 'POST',
      payload: { debug: true }
    },
    responseData: {
      statusCode: 200,
      body: { success: true, debug_info: {} }
    },
    performanceMetrics: {
      networkLatency: 0.6,
      processingTime: 1.9,
      queueTime: 0
    }
  },
  {
    id: 8,
    timestamp: '2024-10-03T07:00:00',
    platform: 'Facebook Marketplace',
    type: 'Product Sync',
    status: 'warning',
    level: 'warning',
    message: 'Synced with warnings: 2 products need review',
    duration: '4.2s',
    durationSeconds: 4.2,
    details: { synced: 18, failed: 0, skipped: 2 },
    errorDetails: {
      warnings: [
        'Product FB-001: Missing required field "description"',
        'Product FB-002: Image URL invalid'
      ]
    },
    requestId: 'req_fb_prod_008',
    endpoint: '/api/v1/products/sync',
    retryable: false,
    requestData: {
      method: 'POST',
      payload: { products: 20 }
    },
    responseData: {
      statusCode: 200,
      body: { success: true, warnings: 2 }
    },
    performanceMetrics: {
      networkLatency: 1.2,
      processingTime: 3.0,
      queueTime: 0
    }
  }
]

export const platformStatus = {
  'Amazon Seller': { connected: true, lastSync: '2 min ago', health: 'healthy' },
  'Shopee Thailand': { connected: true, lastSync: '15 min ago', health: 'healthy' },
  'Lazada Official Store': { connected: true, lastSync: '30 min ago', health: 'degraded' },
  'LINE Shopping': { connected: false, lastSync: '45 min ago', health: 'down' },
  'Stripe Production': { connected: true, lastSync: '1 hour ago', health: 'healthy' },
  'PayPal Business': { connected: false, lastSync: '1 hour ago', health: 'critical' },
  'TikTok Shop': { connected: true, lastSync: '1.5 hours ago', health: 'healthy' },
  'Facebook Marketplace': { connected: true, lastSync: '2 hours ago', health: 'healthy' }
}

// Analytics mock data
export const analyticsData = {
  successRate: [
    { date: '2024-09-27', rate: 95 },
    { date: '2024-09-28', rate: 92 },
    { date: '2024-09-29', rate: 88 },
    { date: '2024-09-30', rate: 85 },
    { date: '2024-10-01', rate: 90 },
    { date: '2024-10-02', rate: 93 },
    { date: '2024-10-03', rate: 87 }
  ],
  syncDuration: [
    { platform: 'Amazon', avg: 2.3 },
    { platform: 'Shopee', avg: 1.8 },
    { platform: 'Lazada', avg: 3.1 },
    { platform: 'LINE', avg: 0.5 },
    { platform: 'Stripe', avg: 1.2 },
    { platform: 'PayPal', avg: 0.2 },
    { platform: 'TikTok', avg: 2.5 },
    { platform: 'Facebook', avg: 4.2 }
  ],
  errorsByPlatform: [
    { platform: 'LINE Shopping', errors: 15 },
    { platform: 'PayPal Business', errors: 5 },
    { platform: 'Lazada', errors: 3 },
    { platform: 'Facebook', errors: 2 }
  ]
}

// Alert rules mock data
export const mockAlertRules = [
  {
    id: 1,
    name: 'High Error Rate',
    condition: 'error_rate > 10%',
    enabled: true,
    channels: ['email', 'slack']
  },
  {
    id: 2,
    name: 'Platform Down',
    condition: 'platform_status = down',
    enabled: true,
    channels: ['email', 'sms']
  },
  {
    id: 3,
    name: 'Slow Sync',
    condition: 'duration > 10s',
    enabled: false,
    channels: ['slack']
  }
]

// Active alerts mock data
export const mockActiveAlerts = [
  {
    id: 1,
    severity: 'critical',
    platform: 'PayPal Business',
    message: 'Connection Failed - Gateway unreachable',
    timestamp: '2024-10-03T07:30:00',
    acknowledged: false
  },
  {
    id: 2,
    severity: 'warning',
    platform: 'LINE Shopping',
    message: 'Error Rate High - 15 errors in last 10 minutes',
    timestamp: '2024-10-03T08:00:00',
    acknowledged: false
  }
]
