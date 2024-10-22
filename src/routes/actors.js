const express = require('express')
const Actor = require('../models/Actor')
const FilmActor = require('../models/FilmActor')

const router = express.Router()

/**
 * @swagger
 * /actors:
 *   get:
 *     summary: Obtener todos los actores
 *     description: Endpoint para obtener una lista de todos los actores en la base de datos.
 *     responses:
 *       200:
 *         description: Respuesta exitosa. Devuelve una lista de actores.
 *         content:
 *           application/json:
 *               example:
 *                 $ref: '#/components/schemas/Actor'  # Referencia al esquema Actor definido en swagger.config.js
 *       404:
 *         description: No se encontraron actores para listar.
 *         content:
 *           application/json:
 *             example:
 *               error: No se encontraron actores para listar.
 *       500:
 *         description: Error en el servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: Error en el servidor
 *               description: Mensaje de error detallado.
 */
router.get('/', async (req, res) => {
  try {
    const actors = await Actor.findAll()
    if (actors.length > 0) {
      res.json(actors)
    } else {
      res.status(404).send({ error: 'No se encontraron actores para listar' })
    }
  } catch (error) {
    res.status(500).send({ error: 'Error en el servidor', description: "Mensaje de error detallado." })
  }
})

/**
 * @swagger
 * /actors/films:
 *   get:
 *     summary: Obtener todas los actores con sus películas asociadas
 *     responses:
 *       200:
 *         description: Lista de todas los actores con sus películas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Film'
 *       500:
 *         description: Error al traer los actores con películas
 */
router.get('/films', async (req, res) => {
  try {
    const actors = await Actor.findAll(
      {
        include: {
          model: Film
        }
      }
    )
    res.status(200).json(actors)
  } catch (error) {
    res.status(500).send({ error: 'no se pudo crear la peli' })
  }
})

/**
 * @swagger
 * /actors/bulk:
 *   post:
 *     summary: Crear varios actores en bloque
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Actor'
 *     responses:
 *       201:
 *         description: Actores creados exitosamente
 *       500:
 *         description: Error al crear los actores
 */
router.post('/bulk', async (req, res) => {
  try {
    const actors = req.body
    const createdActors = await Actor.bulkCreate(actors)
    res.status(201).json(createdActors)
  } catch (error) {
    res.status(500).send({ error: 'no se pudo crear los actores' })
  }
})

/**
 * @swagger
 * /actors:
 *   post:
 *     summary: Crear un nuevo actor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Actor'
 *     responses:
 *       201:
 *         description: Actor creado exitosamente
 *       500:
 *         description: Error al crear el actor
 */
router.post('/', async (req, res) => {
  try {
    const { first_name, last_name } = req.body
    const actor = await Actor.create({ first_name, last_name })
    res.status(201).json(actor)
  } catch (error) {
    res.status(500).send({ error: 'no se pudo crear el actor' })
  }
})

/**
 * @swagger
 * /actors/{actorId}:
 *   get:
 *     summary: Obtener un actor por ID
 *     parameters:
 *       - in: path
 *         name: actorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del actor
 *     responses:
 *       200:
 *         description: Datos del actor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Actor'
 *       404:
 *         description: Actor no encontrado
 *       500:
 *         description: Error al traer el actor
 */
router.get('/:actorId', async (req, res) => {
  const { actorId } = req.params
  try {
    const actor = await Actor.findByPk(actorId)
    if (!actor) {
      return res.status(404).send({ error: 'Actor no encontrado' })
    }
    res.json(actor)
  } catch (error) {
    res.status(500).send({ error: 'No se pudo obtener el actor' })
  }
})

/**
 * @swagger
 * /actors/{actorId}/films:
 *   get:
 *     summary: Obtener las películas de un actor por su ID
 *     parameters:
 *       - in: path
 *         name: actorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del actor
 *     responses:
 *       200:
 *         description: Lista de películas del actor
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Film'
 *       404:
 *         description: Actor no encontrado
 *       500:
 *         description: Error al obtener las películas del actor
 */
router.get('/:actorId/films', async (req, res) => {
  const { actorId } = req.params
  try {
    const actor = await Actor.findByPk(actorId, {
      include: {
        model: Film
      }
    })
    if (!actor) {
      return res.status(404).send({ error: 'Actor no encontrado' })
    }
    res.status(200).json(actor)
  } catch (error) {
    res.status(500).send({ error: 'no se pudieron obtener las películas del actor' })
  }
})

/**
 * @swagger
 * /actors/{actorId}:
 *   put:
 *     summary: Actualizar un actor
 *     parameters:
 *       - in: path
 *         name: actorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del actor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Actor'
 *     responses:
 *       200:
 *         description: Actor actualizado exitosamente
 *       404:
 *         description: Actor no encontrado
 *       500:
 *         description: Error al actualizar el actor
 */
router.put('/:actorId', async (req, res) => {
  const { actorId } = req.params
  const { first_name, last_name } = req.body
  try {
    const actor = await Actor.findByPk(actorId)
    if (!actor) {
      return res.status(404).send({ error: 'Actor no encontrado' })
    }
    actor.first_name = first_name
    actor.last_name = last_name
    await actor.save()
    res.json(actor)
  } catch (error) {
    res.status(500).send({ error: 'No se pudo actualizar el actor' })
  }
})

/**
 * @swagger
 * /actors/{actorId}:
 *   delete:
 *     summary: Eliminar un actor
 *     parameters:
 *       - in: path
 *         name: actorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del actor
 *     responses:
 *       204:
 *         description: Actor eliminado exitosamente
 *       404:
 *         description: Actor no encontrado
 *       500:
 *         description: Error al eliminar el actor
 */
router.delete('/:actorId', async (req, res) => {
  const { actorId } = req.params
  try {
    const actor = await Actor.findByPk(actorId)
    if (!actor) {
      return res.status(404).send({ error: 'Actor no encontrado' })
    }
    await actor.destroy()
    res.status(204).send() // 204 No Content
  } catch (error) {
    res.status(500).send({ error: 'No se pudo eliminar el actor' })
  }
})

module.exports = router
