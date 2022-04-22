//	Array med alla hamsterobjekt
// GET

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

// Data hämtas från Firestore!

const colRefHamsters = collection(db, 'hamsters')
const colRefMatches = collection(db, 'matches')
let hamsters = []
let matches = []

//GET	/hamsters	Body: inget, Respons:	Array med alla hamsterobjekt
router.get('/', async (req, res) => {
  const snapshot = await getDocs(colRefHamsters)
  snapshot.docs.forEach((docSnapshot) => {
    hamsters.push({ ...docSnapshot.data(), id: docSnapshot.id })
  })

  res.status(200).send(hamsters)
})

//GET	/hamsters/random	Body: inget, Respons: Ett slumpat hamsterobjekt
router.get('/random', async (req, res) => {
  const snapshot = await getDocs(colRefHamsters)
  snapshot.docs.forEach((docSnapshot) => {
    hamsters.push({ ...docSnapshot.data(), id: docSnapshot.id })
  })

  res.status(200).send(hamsters[Math.floor(Math.random() * hamsters.length)])
})

//GET	/hamsters/cutest	Body: ingen,	Respons: Array med objekt för de hamstrar som vunnit flest matcher.
/* router.get('/cutest', async (req, res) => {
  const snapshot = await getDocs(colRefMatches)
  snapshot.docs.forEach((docSnapshot) => {
    matches.push({ ...docSnapshot.data(), id: docSnapshot.id })
  })

  const matchWinners = []
  const matchLosers = []
  matches.forEach((match) => matchWinners.push(match.winnerId))
  matches.forEach((match) => matchLosers.push(match.loserId))

  const matchWinnerOcc = matchWinners.reduce(function (acc, curr) {
    return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc
  }, {})

  const matchLoserOcc = matchLosers.reduce(function (acc, curr) {
    return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc
  }, {})

  console.log('match winners', matchWinnerOcc)
  console.log('match losers', matchLoserOcc)

  function cutestResult(obj1, obj2) {
    let result = []
    for (let key in obj1) {
      // hamstrar som bara vunnit
      if (!(key in obj2)) {
        result.push({ [key]: obj1[key] })
      }
      // målskillnad (vinst - förlust)
      if (key in obj2) {
        let diff = obj1[key] - obj2[key]
        result.push({ [key]: diff })
      }
    }

    // fixa så inte bara första, utan även hantera två på lika målskillnad
    const resultSorted = result.sort(
      (a, b) => Object.values(b) - Object.values(a)
    )

    let topHamter = []
    let topHamters = []

    for (let i = 0; i < resultSorted.length; i++) {
      if (
        Object.values(resultSorted[i]).join() ===
        Object.values(resultSorted[0]).join()
      ) {
        topHamters.push(resultSorted[i])
      } else {
        topHamter.push(resultSorted[0])
      }
    }
  }

  let cutestId = Object.keys(cutestResult(matchWinnerOcc, matchLoserOcc))
  // behöver då även ändra i anropet till firestore nedan
  // hitta hamsterobjekt och visa på sidan.

  let cutestHamster = []
  let docRef = doc(colRefHamsters, cutestId.join())
  let snapshot2 = await getDoc(docRef)
  cutestHamster.push({ ...snapshot2.data(), id: snapshot2.id })

  res.status(200).send(matches)
}) */

//GET	/hamsters/:id
// Body: inget
// Respons:Hamsterobjekt med ett specifikt id. - 404 om inget objekt med detta id finns.
router.get('/:id', async (req, res) => {
  const docRef = doc(colRefHamsters, req.params.id)
  const snapshot = await getDoc(docRef)
  const data = snapshot.data()
  if (snapshot.exists()) {
    res.status(200).send(data)
    return
  }
  res.sendStatus(404)
})

//POST	/hamsters
// Body: Hamster-objekt (utan id)
// Respons: Id för det nya objekt som skapats i databasen. Ska returneras inuti ett objekt: { id: "..." }.
router.post('/', async (req, res) => {
  if (
    req.body.loves.length === 0 ||
    req.body.games.length === 0 ||
    req.body.imgName.length === 0 ||
    req.body.name.length === 0 ||
    req.body.wins.length === 0 ||
    req.body.favFood.length === 0 ||
    req.body.age.length === 0 ||
    req.body.defeats.length === 0
  ) {
    res.sendStatus(400)
    return
  } else {
    const newHamster = {
      loves: req.body.loves,
      games: Number(req.body.games),
      imgName: req.body.imgName,
      name: req.body.name,
      wins: Number(req.body.wins),
      favFood: req.body.favFood,
      age: Number(req.body.age),
      defeats: Number(req.body.defeats),
    }
    const addedHamster = await addDoc(colRefHamsters, newHamster)
    res.status(200).send({ id: addedHamster.id })
  }
})

//PUT	/hamsters/:id	Body: Ett objekt med ändringar.	Respons: Bara statuskod.
router.put('/:id', async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    res.sendStatus(400)
    return
  }

  const docRef = doc(colRefHamsters, req.params.id)
  const newData = req.body
  const snapshot = await getDoc(docRef)

  if (snapshot.exists()) {
    await updateDoc(docRef, newData)
    res.sendStatus(200)
    //res.status(200).send(newData)
    return
  }
  res.sendStatus(404)
})

// DELETE	/hamsters/:id	Body: inget, Respons: Bara statuskod
router.delete('/:id', async (req, res) => {
  const docRef = doc(colRefHamsters, req.params.id)
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
