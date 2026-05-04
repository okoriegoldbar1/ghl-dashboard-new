// Access control via URL query param
// Admin:  ?key=lwfnMVXQD3qQ8g96
// Viewer: ?key=b4iebkOwqsnXpKE9

const ADMIN_KEY  = import.meta.env.VITE_ADMIN_KEY  || 'lwfnMVXQD3qQ8g96'
const VIEWER_KEY = import.meta.env.VITE_VIEWER_KEY || 'b4iebkOwqsnXpKE9'

export function useAuth() {
  const params = new URLSearchParams(window.location.search)
  const key = params.get('key') || ''

  if (key === ADMIN_KEY)  return { role: 'admin',  allowed: true }
  if (key === VIEWER_KEY) return { role: 'viewer', allowed: true }
  return { role: null, allowed: false }
}
