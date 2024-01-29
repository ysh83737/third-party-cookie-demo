import fs from 'node:fs'
import path from 'node:path'
import fastify from 'fastify'

const app = fastify({
  // logger: true,
  http2: true,
  https: {
    key: fs.readFileSync(path.resolve(__dirname, '../key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, '../cert.pem')),
  }
})

app.get('/', (request, reply) => {
  const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), { encoding: 'utf-8' })

  reply.type('text/html')
  reply.send(html)
})

app.post('/login', (request, reply) => {
  const { username } = request.body as Record<string, string>;

  const token = 'USER_TOKEN';

  reply.header('set-cookie', `usename=${username}; Max-Age=${7 * 24 * 60 * 60}; SameSite=None; Secure`)
  reply.header('set-cookie', `token=${token}; Max-Age=${7 * 24 * 60 * 60}; SameSite=None; Secure`)

  reply.send({ token });
})

app.listen({ port: 3001 }, (err, address) => {
  if (err) throw err
  console.log(`Server is now listening on ${address}`)
})