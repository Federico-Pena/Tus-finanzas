import express from 'express'
import morgan from 'morgan'
import { connectToDatabase } from './src/database'
import { categoriesRoutes } from './src/routes/categories.routes'
import { userRoutes } from './src/routes/users.routes'
import { transactionsRoutes } from './src/routes/transactions.routes'
import { statsRoutes } from './src/routes/stats.routes'
import { notificationRoutes } from './src/routes/notification.routes'
const app = express()
app.disable('x-powered-by')
const port = process.env.PORT ?? 3000
app.use(express.json())
app.use(morgan('dev'))
connectToDatabase()
app.use(notificationRoutes)
app.use(userRoutes)
app.use(categoriesRoutes)
app.use(transactionsRoutes)
app.use(statsRoutes)
app.listen(port, () => console.log(`http://localhost:${port}`))
