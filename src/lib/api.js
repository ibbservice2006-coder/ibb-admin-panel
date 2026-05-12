import axios from 'axios'

const BASE_URL = import.meta.env.VITE_ADMIN_API_URL || 'https://ibb-admin-api.ibb-service2006.workers.dev'

// ─── Axios instance ───────────────────────────────────────────────────────────
export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ibb_admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ibb_admin_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  login:  (email, password)     => api.post('/admin/auth/login', { email, password }),
  me:     ()                    => api.get('/admin/auth/me'),
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const dashboardApi = {
  stats:  ()                    => api.get('/admin/dashboard'),
}

// ─── Bookings ─────────────────────────────────────────────────────────────────
export const bookingsApi = {
  list:   (params = {})         => api.get('/admin/bookings', { params }),
  get:    (id)                  => api.get(`/admin/bookings/${id}`),
  confirm:(id)                  => api.patch(`/admin/bookings/${id}/confirm`),
  cancel: (id, reason)          => api.patch(`/admin/bookings/${id}/cancel`, { reason }),
}

// ─── Customers ────────────────────────────────────────────────────────────────
export const customersApi = {
  list:   (params = {})         => api.get('/admin/customers', { params }),
  get:    (id)                  => api.get(`/admin/customers/${id}`),
  update: (id, data)            => api.patch(`/admin/customers/${id}`, data),
}

// ─── Pricing ──────────────────────────────────────────────────────────────────
export const pricingApi = {
  list:       (params = {})     => api.get('/admin/prices', { params }),
  update:     (id, data)        => api.put(`/admin/prices/${id}`, data),
  // Festival
  festivals:  ()                => api.get('/admin/prices/festivals'),
  createFest: (data)            => api.post('/admin/prices/festivals', data),
  updateFest: (id, data)        => api.put(`/admin/prices/festivals/${id}`, data),
  deleteFest: (id)              => api.delete(`/admin/prices/festivals/${id}`),
}

// ─── Currency ─────────────────────────────────────────────────────────────────
export const currencyApi = {
  list:       ()                => api.get('/admin/prices/currencies'),
  updateRate: (code, data)      => api.put(`/admin/prices/currencies/${code}/rate`, data),
}

// ─── Fleet ────────────────────────────────────────────────────────────────────
export const fleetApi = {
  // Drivers
  drivers:      (params = {})   => api.get('/admin/fleet/drivers', { params }),
  createDriver: (data)          => api.post('/admin/fleet/drivers', data),
  updateDriver: (id, data)      => api.patch(`/admin/fleet/drivers/${id}`, data),
  // Vehicles
  vehicles:     (params = {})   => api.get('/admin/fleet/vehicles', { params }),
  createVehicle:(data)          => api.post('/admin/fleet/vehicles', data),
  updateVehicle:(id, data)      => api.patch(`/admin/fleet/vehicles/${id}`, data),
}

// ─── Routes ───────────────────────────────────────────────────────────────────
export const routesApi = {
  list:   (params = {})         => api.get('/admin/routes', { params }),
  get:    (id)                  => api.get(`/admin/routes/${id}`),
}
