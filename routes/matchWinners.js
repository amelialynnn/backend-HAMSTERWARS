import express from 'express'
const router = express.Router()

import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'
import { db } from '../database/firebase.js'

const colRef = collection(db, 'matches')
let matches = []

//GET	/matchWinners/:id	Body: ingen
// Respons: Array med matchobjekt för alla matcher, som hamstern med id har vunnit.
// Statuskod 404 om id inte matchar en hamster som vunnit någon match.

///matchWinners/040Vr4a9797JI9

router.get('/:id', async (req, res) => {
  // ta fram alla matcher
  // hitta id på hamster - req.params.id
  // som matchar med winnerId
  const snapshot = await getDocs(colRef)
  snapshot.docs.forEach((docSnapshot) => {
    matches.push({ ...docSnapshot.data(), id: docSnapshot.id })
  })

  //blir dubbelt????
  let matchWinner = matches.filter((match) => match.winnerId === req.params.id)

  if (matchWinner.length > 0) {
    res.status(200).send(matchWinner)
    return
  } else {
    res.sendStatus(404)
  }
})

export default router
