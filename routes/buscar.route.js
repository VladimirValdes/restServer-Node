
const { Router } = require('express');
const { buscar, buscarProductXCat } = require('../controllers/buscar.controller');

const router = Router();


router.get('/producto/:categoria', buscarProductXCat);
router.get('/:coleccion/:termino', buscar);


module.exports = router;