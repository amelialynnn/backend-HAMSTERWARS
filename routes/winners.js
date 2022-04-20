import express from 'express'
const router = express.Router()

import { collection, getDocs, getDoc, doc } from 'firebase/firestore'
import { db } from '../database/firebase.js'

const colRefMatches = collection(db, 'matches')
const colRefHamsters = collection(db, 'hamsters')

//GET	/winners	Body: ingen, Respons:	En array med hamsterobjekt för de 5 som vunnit flest matcher

router.get('/', async (req, res) => {
  // ta fram alla matcher
  let matches = []
  const matchWinners = []

  const snapshot = await getDocs(colRefMatches)
  snapshot.docs.forEach((docSnapshot) => {
    matches.push({ ...docSnapshot.data(), id: docSnapshot.id })
  })

  // hitta de fem hamstrarna som vunnit flest matcher
  // dvs där den med flest winnerId
  // lägg ihop samma winnerId i en array

  matches.forEach((element) => matchWinners.push(element.winnerId))

  const matchWinnerOcc = matchWinners.reduce(function (acc, curr) {
    return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc
  }, {})

  console.log(matchWinnerOcc)

  const topFiveId = Object.keys(matchWinnerOcc)
    .sort((a, b) => matchWinnerOcc[b] - matchWinnerOcc[a])
    .slice(0, 5)

  console.log(topFiveId)

  // hitta de hamstrarna i db hamsters - dvs arrayen topFiveHamsters

  let topFiveHamsters = []

  for (let i = 0; i < topFiveId.length; i++) {
    let docRef = doc(colRefHamsters, topFiveId[i])
    let snapshot2 = await getDoc(docRef)
    topFiveHamsters.push(snapshot2.data())
  }

  console.log(topFiveHamsters)

  res.status(200).send(topFiveHamsters)
})

export default router
