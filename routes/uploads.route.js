

const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarArchivo } = require('../middlewares');
const { colleccionesPermitidas, usuarioExistePorId } = require('../helpers');
const { cargarArchivo, actualizarImagen, cargarImagen, actualizarImagenCloudinary } = require('../controllers/uploads.controller');

const route = Router();


route.post('/', validarArchivo, cargarArchivo);

route.put('/:coleccion/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('coleccion').custom( c => colleccionesPermitidas( c, ['usuarios', 'productos'])),
    validarCampos,
    validarArchivo
], actualizarImagenCloudinary)
// ], actualizarImagen)



route.get('/:coleccion/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('coleccion').custom( c => colleccionesPermitidas( c, ['usuarios', 'productos'])),
    validarCampos,
], cargarImagen)

module.exports = route;