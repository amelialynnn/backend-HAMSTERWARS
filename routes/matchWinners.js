import express from 'express'
const router = express.Router()

import { collection, getDocs } from 'firebase/firestore'
import { db } from '../database/firebase.js'

const colRef = collection(db, 'matches')

//GET	/matchWinners/:id	Body: ingen
// Respons: Array med matchobjekt för alla matcher, som hamstern med id har vunnit.
// Statuskod 404 om id inte matchar en hamster som vunnit någon match.
router.get('/:id', async (req, res) => {
  let matches = []
  const snapshot = await getDocs(colRef)
  snapshot.docs.forEach((docSnapshot) => {
    matches.push({ ...docSnapshot.data(), id: docSnapshot.id })
  })

  let isMatchWinner = matches.filter(
    (match) => match.winnerId === req.params.id
  )

  if (isMatchWinner.length > 0) {
    res.status(200).send(isMatchWinner)
    return
  } else {
    res.sendStatus(404)
  }
})

export default router
