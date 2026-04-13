export default defineEventHandler((event) => {
  const origin = getHeader(event, 'origin')

  const allowedOrigins = [
    'http://localhost:9000',
    'http://127.0.0.1:9000',
    'http://0.0.0.0:9000',
    'http://10.0.2.2:9000'

  ]

  if (origin && allowedOrigins.includes(origin)) {
    setHeader(event, 'Access-Control-Allow-Origin', origin)
    setHeader(event, 'Access-Control-Allow-Credentials', 'true')
    setHeader(event, 'Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }

  if (getMethod(event) === 'OPTIONS') {
    event.node.res.statusCode = 204
    event.node.res.end()
    return
  }
})