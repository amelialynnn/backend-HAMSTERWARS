import express from 'express'
const router = express.Router()

import { collection, getDocs, getDoc, doc } from 'firebase/firestore'
import { db } from '../database/firebase.js'

const colRefMatches = collection(db, 'matches')
const colRefHamsters = collection(db, 'hamsters')

// GET	/losers	Body: ingen,	Respons: En array med hamsterobjekt för de 5 som förlorat flest matcher

router.get('/', (req, res) => {
  res.status(200).send('/losers funkar')
})

export default router
