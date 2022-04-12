//	Array med alla hamsterobjekt
// GET

import express from 'express'
const router = express.Router()

import { collection, getDocs, addDoc } from 'firebase/firestore'
import { db } from '../database/firebase.js'

import Joi from 'joi'

// Data hämtas från Firestore!

const colRef = collection(db, 'hamsters')
let hamsters = []

//GET	/hamsters	-	Array med alla hamsterobjekt
router.get('/', async (req, res) => {
  const snapshot = await getDocs(colRef)
  snapshot.docs.forEach((docSnapshot) => {
    hamsters.push({ ...docSnapshot.data() })
  })

  res.status(200).send(hamsters)
})

//GET	/hamsters/random	-	Ett slumpat hamsterobjekt
router.get('/random', async (req, res) => {
  const snapshot = await getDocs(colRef)
  snapshot.docs.forEach((docSnapshot) => {
    hamsters.push({ ...docSnapshot.data() })
  })

  res.status(200).send(hamsters[Math.floor(Math.random() * hamsters.length)])
})

//GET	/hamsters/:id	-	Hamsterobjekt med ett specifikt id.
//404 om inget objekt med detta id finns.
router.get('/:id', async (req, res) => {
  const paramId = req.params.id

  const snapshot = await getDocs(colRef)
  snapshot.docs.forEach((docSnapshot) => {
    hamsters.push({ ...docSnapshot.data(), id: docSnapshot.id })
  })
  //varför funkar det inte med uid i rättningsscriptet
  const matchedHamster = hamsters.find(({ id }) => id === paramId)

  if (matchedHamster) {
    res.status(200).send(matchedHamster)
    return
  } else {
    res.sendStatus(404)
  }
})

//POST	/hamsters	Hamster-objekt (utan id)	Id för det nya objekt som skapats i databasen. Ska returneras inuti ett objekt: { id: "..." }.

router.post('/', async (req, res) => {
  const schema = Joi.object({
    loves: Joi.string().min(3).max(30).required(),
    games: Joi.number().min(0).required(),
    imgName: Joi.string().min(3).max(30).required(),
    name: Joi.string().min(3).max(30).required(),
    wins: Joi.number().min(0).required(),
    favFood: Joi.string().min(3).max(30).required(),
    age: Joi.number().min(0).required(),
    defeats: Joi.number().min(0).required(),
  })

  const dataToValidate = {
    loves: req.body.loves,
    games: Number(req.body.games),
    imgName: req.body.imgName,
    name: req.body.name,
    wins: Number(req.body.wins),
    favFood: req.body.favFood,
    age: Number(req.body.age),
    defeats: Number(req.body.defeats),
  }

  try {
    const newHamster = await schema.validateAsync(dataToValidate)
    const addedHamster = await addDoc(colRef, newHamster)
    res.status(200).send({ id: addedHamster.id })
    return
  } catch (err) {
    res.status(400).send(err.details[0].message)
  }
})

export default router
