//import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
//import authors from './authors'
import accounts from './accounts'
import categories from './categories'
import transactions from './transactions'
import summary from './summary'

//import { HTTPException } from 'hono/http-exception'

export const runtime = 'edge'

const app = new Hono().basePath('/api')

// to delete
// app.onError((err, c) => {
//  if (err instanceof HTTPException) {
//   return err.getResponse()
//  }

//  return c.json({ error: 'Internal server error' }, 500)
// })

// using a separate router for each route is a bit more verbose but allows for better type inference
//app.route('/authors', authors)

// app.get('/hello', clerkMiddleware(), (c) => {
//  const auth = getAuth(c)
//  if (!auth?.userId) {
//   return c.json({ error: 'Unauthorized' })
//  }

//  return c.json({ message: 'Hello, Nextjs!', userId: auth.userId })
// })

// done to generate rpc type
const routes = app
 .route('/accounts', accounts)
 .route('/categories', categories)
 .route('/transactions', transactions)
 .route('/summary', summary)

export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)

export type AppType = typeof routes
