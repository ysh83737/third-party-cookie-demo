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

app.listen({ port: 3002 }, (err, address) => {
  if (err) throw err
  console.log(`Server is now listening on ${address}`)
})