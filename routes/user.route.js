const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');

const { esRoleValido, emailExiste, usuarioExistePorId } = require('../helpers/db-validators');

const {
	usuariosGet,
	usuariosPost,
	usuariosPut,
	usuariosDelete
} = require('../controllers/user.controller');

const route = Router();

route.get('/', usuariosGet);

route.get('/:id', [
	check('id', 'El id no es valido').isMongoId(),
	check('id').custom( usuarioExistePorId ),
	validarCampos
], usuariosGetById)

route.post('/', [
	check('nombre', 'El nombre es obligatorio').not().isEmpty(),
	check('password', 'El password debe ser mas de 6 letras').isLength({ min: 6 }),
	check('correo', 'El correo no es valido').isEmail(),
	check('correo').custom( emailExiste ),
	// check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
	check('rol').custom( esRoleValido ),
	validarCampos
], usuariosPost );

route.put('/:id', [
	check('id', 'El id no es valido').isMongoId(),
	check('id').custom( usuarioExistePorId ),
	check('rol').custom( esRoleValido ),
	validarCampos
], usuariosPut);

route.delete('/:id', [
	check('id', 'El id no es valido').isMongoId(),
	check('id').custom( usuarioExistePorId ),
	validarCampos
], usuariosDelete);

module.exports = route;
