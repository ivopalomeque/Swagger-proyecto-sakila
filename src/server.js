const express = require('express')
const bodyParser = require('body-parser')
const sequelize = require('./config/database')
const actorRoutes = require('./routes/actors')
const filmRoutes = require('./routes/films')
const { swaggerUi, swaggerDocs } = require('./utils/swaggerConfig')

const app = express()
const port = 3000

app.use(bodyParser.json())

// Swagger Config
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

// Routes
app.use('/actors', actorRoutes)
app.use('/films', filmRoutes)

app.get('/', (req, res) => {
  res.send('Hoal mundo !')
})

app.listen(port, async () => {
  await sequelize.authenticate()
  console.log(`server funcando en http://localhost:${port}`)
  console.log(`Docuentación de la API en http://localhost:${port}/api-docs`)
})
