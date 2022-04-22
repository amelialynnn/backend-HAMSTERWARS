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
  orderBy,
  query,
} from 'firebase/firestore'
import { db } from '../database/firebase.js'

// Data hämtas från Firestore!
const colRefHamsters = collection(db, 'hamsters')

//GET	/hamsters	Body: inget, Respons:	Array med alla hamsterobjekt
router.get('/', async (req, res) => {
  let hamsters = []
  const snapshot = await getDocs(colRefHamsters)
  snapshot.docs.forEach((docSnapshot) => {
    hamsters.push({ ...docSnapshot.data(), id: docSnapshot.id })
  })

  res.status(200).send(hamsters)
})

//GET	/hamsters/random	Body: inget, Respons: Ett slumpat hamsterobjekt
router.get('/random', async (req, res) => {
  let hamsters = []
  const snapshot = await getDocs(colRefHamsters)
  snapshot.docs.forEach((docSnapshot) => {
    hamsters.push({ ...docSnapshot.data(), id: docSnapshot.id })
  })

  res.status(200).send(hamsters[Math.floor(Math.random() * hamsters.length)])
})

//GET	/hamsters/cutest	Body: ingen,	Respons: Array med objekt för de hamstrar som vunnit flest matcher.
router.get('/cutest', async (req, res) => {
  let hamsters = []
  let cutest = []

  const colRefHamsters = query(
    collection(db, 'hamsters'),
    orderBy('wins', 'desc')
  )

  const snapshot = await getDocs(colRefHamsters)
  snapshot.docs.forEach((docSnapshot) => {
    hamsters.push({ ...docSnapshot.data(), id: docSnapshot.id })
  })

  let difference = hamsters[0].wins - hamsters[0].defeats

  hamsters.forEach((hamster) => {
    let currentDifference = hamster.wins - hamster.defeats

    if (currentDifference > difference) {
      difference = currentDifference
      cutest = [hamster]
    } else if (currentDifference === difference) {
      cutest.push(hamster)
    }
  })

  res.status(200).send(cutest)
})

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
