const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Actores y Películas',
      version: '1.0.0',
      description: 'Documentación generada con Swagger para la API de Actores y Películas',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    components: {
      schemas: {
        Actor: {
          type: 'object',
          properties: {
            actor_id: {
              type: 'integer',
              description: 'ID único del actor',
              example: 1,
            },
            first_name: {
              type: 'string',
              description: 'Nombre del actor',
              example: 'John',
            },
            last_name: {
              type: 'string',
              description: 'Apellido del actor',
              example: 'Doe',
            },
          },
          required: ['first_name', 'last_name'],
        },
        Film: {
          type: 'object',
          properties: {
            film_id: {
              type: 'integer',
              description: 'ID único de la película',
              example: 1,
            },
            title: {
              type: 'string',
              description: 'Título de la película',
              example: 'Avengers',
            },
            description: {
              type: 'string',
              description: 'Descripción de la película',
              example: 'Superhero movie',
            },
            release_year: {
              type: 'integer',
              description: 'Año de lanzamiento de la película',
              example: 2012,
            },
          },
          required: ['title', 'release_year'],
        },
        FilmActor: {
          type: 'object',
          properties: {
            film_id: {
              type: 'integer',
              description: 'ID de la película',
              example: 1,
            },
            actor_id: {
              type: 'integer',
              description: 'ID del actor',
              example: 1,
            },
          },
          required: ['film_id', 'actor_id'],
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
}

const swaggerDocs = swaggerJsdoc(swaggerOptions)

module.exports = { swaggerDocs, swaggerUi }