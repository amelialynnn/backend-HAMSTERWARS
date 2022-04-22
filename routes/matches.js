import express from 'express'
const router = express.Router()

import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
  deleteDoc,
} from 'firebase/firestore'
import { db } from '../database/firebase.js'

const colRef = collection(db, 'matches')

//GET	/matches	Body: ingen, Respons: Array med alla matchobjekt
router.get('/', async (req, res) => {
  let matches = []
  const snapshot = await getDocs(colRef)
  snapshot.docs.forEach((docSnapshot) => {
    matches.push({ ...docSnapshot.data(), id: docSnapshot.id })
  })

  res.status(200).send(matches)
})

//GET	/matches/:id	Body: ingen,	Respons: Matchobjekt med ett specifikt id.
router.get('/:id', async (req, res) => {
  const docRef = doc(colRef, req.params.id)
  const snapshot = await getDoc(docRef)
  const data = snapshot.data()
  if (snapshot.exists()) {
    res.status(200).send(data)
    return
  }
  res.sendStatus(404)
})

//POST	/matches
//Body: Match-objekt (utan id)
//Respons: Ett objekt med id för det nya objekt som skapats i databasen: { id: "123..." }
router.post('/', async (req, res) => {
  if (req.body.winnerId.length === 0 || req.body.loserId.length === 0) {
    res.sendStatus(400)
    return
  } else {
    const newMatch = {
      winnerId: req.body.winnerId,
      loserId: req.body.loserId,
    }
    const addedMatch = await addDoc(colRef, newMatch)
    res.status(200).send({ id: addedMatch.id })
  }
})

//DELETE	/matches/:id Body: ingen,	Respons: Bara statuskod.
router.delete('/:id', async (req, res) => {
  const docRef = doc(colRef, req.params.id)
  const snapshot = await getDoc(docRef)

  if (snapshot.exists()) {
    await deleteDoc(docRef)
    res.sendStatus(200)
    return
  } else {
    res.sendStatus(404)
  }
})

export default router
