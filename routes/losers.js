import express from 'express'
const router = express.Router()

import { collection, getDocs, getDoc, doc } from 'firebase/firestore'
import { db } from '../database/firebase.js'

const colRefMatches = collection(db, 'matches')
const colRefHamsters = collection(db, 'hamsters')

// GET	/losers	Body: ingen,	Respons: En array med hamsterobjekt för de 5 som förlorat flest matcher

router.get('/', async (req, res) => {
  // ta fram alla matcher
  let matches = []
  const matchLosers = []

  const snapshot = await getDocs(colRefMatches)
  snapshot.docs.forEach((docSnapshot) => {
    matches.push({ ...docSnapshot.data(), id: docSnapshot.id })
  })

  // hitta de fem hamstrarna som vunnit flest matcher
  // dvs där den med flest loserId
  // lägg ihop samma loserId i en array

  matches.forEach((element) => matchLosers.push(element.loserId))

  const matchLoserOcc = matchLosers.reduce(function (acc, curr) {
    return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc
  }, {})

  console.log(matchLoserOcc)

  const bottomFiveId = Object.keys(matchLoserOcc)
    .sort((a, b) => matchLoserOcc[b] - matchLoserOcc[a])
    .slice(0, 5)

  console.log(bottomFiveId)

  // hitta de hamstrarna i db hamsters - dvs arrayen bottomFiveHamsters

  let bottomFiveHamsters = []

  for (let i = 0; i < bottomFiveId.length; i++) {
    let docRef = doc(colRefHamsters, bottomFiveId[i])
    let snapshot2 = await getDoc(docRef)
    bottomFiveHamsters.push(snapshot2.data())
  }

  console.log(bottomFiveHamsters)

  res.status(200).send(bottomFiveHamsters)
})

export default router
