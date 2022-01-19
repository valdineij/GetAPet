const router = require('express').Router()

const PetController = require('../controllers/PetController')
//helpers
const verifyToken = require('../helpers/verify-token')
const { imageUpload } = require('../helpers/image-upload')

router.post('/create', verifyToken, imageUpload.array('images'), PetController.create)
//router.post('/create', verifyToken, PetController.create)
router.get('/', PetController.getAll)
router.get('/mypets', verifyToken, PetController.getMyPets)
router.get('/myadoptions', verifyToken, PetController.getMyAdoptions)
router.get('/:id', PetController.getPetById)
router.delete('/:id', verifyToken, PetController.removePetById)
router.patch('/:id', verifyToken, imageUpload.array('images'), PetController.updatePet)
router.patch('/schedule/:id', verifyToken, PetController.schedule)
router.patch('/conclude/:id', verifyToken, PetController.concludeAdoption)

module.exports = router

