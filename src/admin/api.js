// Appels à l'API du back-office. Le cookie de session est envoyé automatiquement (même origine).
async function call(path, { method = 'GET', body, headers } = {}) {
  const isJSON = body !== undefined && !(body instanceof Blob)
  const res = await fetch(`/api/${path}`, {
    method,
    credentials: 'same-origin',
    headers: isJSON ? { 'content-type': 'application/json', ...headers } : headers,
    body: isJSON ? JSON.stringify(body) : body,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw Object.assign(new Error(data.error || `Erreur ${res.status}`), { status: res.status })
  return data
}

export const api = {
  me: () => call('me'),
  login: (password) => call('login', { method: 'POST', body: { password } }),
  logout: () => call('logout', { method: 'POST', body: {} }),
  getContent: () => call('content'),
  saveContent: (content) => call('content', { method: 'PUT', body: { content } }),
  history: () => call('history'),
  restore: (key) => call(`history/${encodeURIComponent(key.replace(/^history\//, ''))}/restore`, { method: 'POST', body: {} }),
  upload: (file) => call('upload', { method: 'POST', body: file, headers: { 'content-type': file.type } }),
  leads: () => call('leads'),
  updateLead: (id, patch) => call(`leads/${encodeURIComponent(id)}`, { method: 'PATCH', body: patch }),
  deleteLead: (id) => call(`leads/${encodeURIComponent(id)}`, { method: 'DELETE' }),
}
