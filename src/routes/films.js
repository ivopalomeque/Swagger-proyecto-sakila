const express = require('express')
const Film = require('../models/Film')
const Actor = require('../models/Actor')
const FilmActor = require('../models/FilmActor')

const router = express.Router()

/**
 * @swagger
 * /films:
 *   get:
 *     summary: Obtener todas las películas
 *     responses:
 *       200:
 *         description: Lista de todas las películas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Film'
 *       500:
 *         description: Error al traer las películas
 */
router.get('/', async (req, res) => {
  try {
    const films = await Film.findAll()
    res.json(films)
  } catch (error) {
    res.status(500).send({ error: 'no se pudieron traer las películas' })
  }
})

/**
 * @swagger
 * /films:
 *   post:
 *     summary: Crear una nueva película
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Film'
 *     responses:
 *       201:
 *         description: Película creada exitosamente
 *       500:
 *         description: Error al crear la película
 */
router.post('/', async (req, res) => {
  try {
    const { title, description, release_year } = req.body
    const film = await Film.create({ title, description, release_year })
    res.status(201).json(film)
  } catch (error) {
    res.status(500).send({ error: 'no se pudo crear la película' })
  }
})

/**
 * @swagger
 * /films/actors:
 *   get:
 *     summary: Obtener todas las películas con sus actores asociados
 *     responses:
 *       200:
 *         description: Lista de todas las películas con sus actores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Film'
 *       500:
 *         description: Error al traer las películas con actores
 */
router.get('/actors', async (req, res) => {
  try {
    const films = await Film.findAll(
      {
        include: {
          model: Actor
        }
      }
    )
    res.status(200).json(films)
  } catch (error) {
    res.status(500).send({ error: 'no se pudo crear la peli' })
  }
})

/**
 * @swagger
 * /films/{filmId}:
 *   get:
 *     summary: Obtener una película por ID
 *     parameters:
 *       - in: path
 *         name: filmId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la película
 *     responses:
 *       200:
 *         description: Datos de la película
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Film'
 *       404:
 *         description: Película no encontrada
 *       500:
 *         description: Error al traer la película
 */
router.get('/:filmId', async (req, res) => {
  const { filmId } = req.params
  try {
    const film = await Film.findByPk(filmId)
    if (!film) {
      return res.status(404).send({ error: 'Película no encontrada' })
    }
    res.json(film)
  } catch (error) {
    res.status(500).send({ error: 'no se pudo obtener la película' })
  }
})

/**
 * @swagger
 * /films/{filmId}/actors:
 *   get:
 *     summary: Obtener los actores de una película específica
 *     parameters:
 *       - in: path
 *         name: filmId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la película
 *     responses:
 *       200:
 *         description: Actores de la película
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Actor'
 *       404:
 *         description: Película no encontrada
 *       500:
 *         description: Error al traer los actores de la película
 */
router.get('/:filmId/actors', async (req, res) => {
  const { filmId } = req.params
  try {
    const film = await Film.findByPk(filmId, {
      include: {
        model: Actor
      }
    })
    if (!film) {
      return res.status(404).send({ error: 'Película no encontrada' })
    }
    res.json(film)
  } catch (error) {
    res.status(500).send({ error: 'no se pudieron obtener los actores de la película' })
  }
})

/**
 * @swagger
 * /films/{filmId}:
 *   put:
 *     summary: Actualizar una película
 *     parameters:
 *       - in: path
 *         name: filmId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la película
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Film'
 *     responses:
 *       200:
 *         description: Película actualizada exitosamente
 *       404:
 *         description: Película no encontrada
 *       500:
 *         description: Error al actualizar la película
 */
router.put('/:filmId', async (req, res) => {
  const { filmId } = req.params
  const { title, description, release_year } = req.body
  try {
    const film = await Film.findByPk(filmId)
    if (!film) {
      return res.status(404).send({ error: 'Película no encontrada' })
    }
    film.title = title
    film.description = description
    film.release_year = release_year
    await film.save()
    res.json(film)
  } catch (error) {
    res.status(500).send({ error: 'no se pudo actualizar la película' })
  }
})

/**
 * @swagger
 * /films/{filmId}:
 *   delete:
 *     summary: Eliminar una película
 *     parameters:
 *       - in: path
 *         name: filmId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la película
 *     responses:
 *       204:
 *         description: Película eliminada exitosamente
 *       404:
 *         description: Película no encontrada
 *       500:
 *         description: Error al eliminar la película
 */
router.delete('/:filmId', async (req, res) => {
  const { filmId } = req.params
  try {
    const film = await Film.findByPk(filmId)
    if (!film) {
      return res.status(404).send({ error: 'Película no encontrada' })
    }
    await film.destroy()
    res.status(204).send() // 204 No Content
  } catch (error) {
    res.status(500).send({ error: 'no se pudo eliminar la película' })
  }
})

module.exports = router