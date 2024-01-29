import fs from 'node:fs'
import path from 'node:path'
import fastify from 'fastify'
import cookie from '@fastify/cookie';

const app = fastify({
  // logger: true,
  http2: true,
  https: {
    key: fs.readFileSync(path.resolve(__dirname, '../key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, '../cert.pem')),
  }
})

app.register(cookie, {
  secret: "my-secret",
});

app.get('/', (request, reply) => {
  const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), { encoding: 'utf-8' })

  reply.type('text/html')
  reply.send(html)
})

app.get('/3rd', (request, reply) => {
  const referer = request.headers.referer || '';
  const userId = request.cookies.userId || '';

  const trackUserId = trackUser(userId, referer);
  if (trackUserId) {
    reply.header('set-cookie', `userId=${trackUserId}; Max-Age=${7 * 24 * 60 * 60}; SameSite=None; Secure`)
  }

  const html = fs.readFileSync(path.resolve(__dirname, '3rd.html'), { encoding: 'utf-8' });

  reply.type('text/html')
  reply.send(html)
})

let nextID = 1;
const USER_TABLE  = new Map<string, Set<string>>();

function trackUser(userId: string, referer: string) {
  console.log('[本次访问来源] ', referer);

  const isTracked = USER_TABLE.has(userId);
  if (isTracked) {
    const records = USER_TABLE.get(userId) as Set<string>;

    console.log('[用户已被追踪] 该用户曾访问过：');
    records.forEach((site) => {
      console.log('  - ', site);
    });

    records.add(referer);
  } else {
    const id = nextID++;
    console.warn('[用户未被追踪] 设置追踪ID：', id);
    USER_TABLE.set(id.toString(), new Set([referer]));
    return id;
  }
}

app.get('/image.jpeg', (request, reply) => {
  const referer = request.headers.referer || '';
  const userId = request.cookies.userId || '';

  const trackUserId = trackUser(userId, referer);
  if (trackUserId) {
    reply.header('set-cookie', `userId=${trackUserId}; Max-Age=${7 * 24 * 60 * 60}; SameSite=None; Secure`)
  }

  const image = fs.readFileSync(path.resolve(__dirname, '../assets', 'image.jpeg'))

  reply.type('image/jpeg');
  reply.send(image)
})

app.listen({ port: 3003 }, (err, address) => {
  if (err) throw err
  console.log(`Server is now listening on ${address}`)
})