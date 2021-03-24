
const { Router } = require('express');
const { check } = require('express-validator');

const {
	validarCampos,
	validarJWT,
	esadminRole,
} = require('../middlewares');

const { existeCategoria, existeProducto } = require('../helpers/db-validators');


const {
    productosGet,
    productosGetById,
    productosPost,
    productosPut,
    productosDelete
} = require('../controllers/productos.controller');

const route = Router();

// Obtener todos los productos
route.get('/', productosGet);

// Obtener productos por id

route.get('/:id',[
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos
], productosGetById);

// Crear un producto por id - Privado

route.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoria es obligatoria').not().isEmpty(),
    check('categoria', 'No es una categoria valida').isMongoId(),
    check('categoria').custom(existeCategoria),
    validarCampos
],productosPost);


route.put('/:id',[
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos
], productosPut );

// Borrar una categoria por id - privado
route.delete('/:id',[
    validarJWT,
	esadminRole,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos
], productosDelete );

module.exports = route;
