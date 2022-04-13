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
} from 'firebase/firestore'
import { db } from '../database/firebase.js'

// Data hämtas från Firestore!

const colRef = collection(db, 'hamsters')
let hamsters = []

//GET	/hamsters	-	Array med alla hamsterobjekt
router.get('/', async (req, res) => {
  const snapshot = await getDocs(colRef)
  snapshot.docs.forEach((docSnapshot) => {
    hamsters.push({ ...docSnapshot.data(), id: docSnapshot.id })
  })

  res.status(200).send(hamsters)
})

//GET	/hamsters/random	-	Ett slumpat hamsterobjekt
router.get('/random', async (req, res) => {
  const snapshot = await getDocs(colRef)
  snapshot.docs.forEach((docSnapshot) => {
    hamsters.push({ ...docSnapshot.data(), id: docSnapshot.id })
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

  const matchedHamster = hamsters.find(({ id }) => id === paramId)

  if (matchedHamster) {
    res.status(200).send(matchedHamster)
    return
  } else {
    res.sendStatus(404)
  }

  //ALTERNATIVT
  /*   const docRef = doc(colRef, req.params.id)
  const snapshot = await getDoc(docRef)
  const data = snapshot.data()
  if (snapshot.exists()) {
    res.status(200).send(data)
    return
  }
  res.sendStatus(404) */
})

//POST	/hamsters	Hamster-objekt (utan id)	Id för det nya objekt som skapats i databasen. Ska returneras inuti ett objekt: { id: "..." }.
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
    const addedHamster = await addDoc(colRef, newHamster)
    res.status(200).send({ id: addedHamster.id })
  }
})

//PUT	/hamsters/:id	Body: Ett objekt med ändringar.	Respons: Bara statuskod.
//Obs! Exempel på ändringsobjekt för PUT: för att sätta antalet vinster till 10 och antalet matcher till 12 ska du använda ändringsobjektet { wins: 10, games: 12 }.

router.put('/:id', async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    res.sendStatus(400)
    return
  }

  const docRef = doc(colRef, req.params.id)
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

export default router
