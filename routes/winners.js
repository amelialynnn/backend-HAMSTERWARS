import express from 'express'
const router = express.Router()

import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../database/firebase.js'

//GET	/winners	Body: ingen, Respons:	En array med hamsterobjekt för de 5 som vunnit flest matcher
router.get('/', async (req, res) => {
  let hamsters = []
  let result = []

  const colRefHamsters = query(
    collection(db, 'hamsters'),
    orderBy('wins', 'desc')
  )

  const snapshot = await getDocs(colRefHamsters)
  snapshot.docs.forEach((docSnapshot) => {
    hamsters.push({ ...docSnapshot.data(), id: docSnapshot.id })
  })

  for (let i = 0; result.length < 5; i++) {
    result.push(hamsters[i])
  }

  res.status(200).send(result)
})

export default router
