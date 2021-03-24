
const { Router } = require('express');
const { check } = require('express-validator');

const {
	validarCampos,
	validarJWT,
	esadminRole,
} = require('../middlewares');

const { existeCategoria, duplicateCategoria } = require('../helpers/db-validators');

const { categoriasGet,
        categoriasGetById,
        categoriasPost,
        categoriasPut,
        categoriasDelete } = require('../controllers/categorias.controller')

const route = Router();

// Obtener todas las categorias - publico
route.get('/', categoriasGet);


// Obtener todas las categorias por ID - publico
route.get('/:id',[
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
], categoriasGetById );

// Crear una categoria - privado - cualquier person con token valido    

route.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], categoriasPost );

// Actulizar una categoria por id - privado
route.put('/:id',[
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom( existeCategoria ),
    check('nombre', 'El nombre es requerido').not().isEmpty(),
    check('nombre').custom(duplicateCategoria),
    validarCampos
], categoriasPut );

// Borrar una categoria por id - privado
route.delete('/:id',[
    validarJWT,
	esadminRole,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
], categoriasDelete );

module.exports = route;