const { Router } = require('express');
const {
	usuariosGet,
	usuariosPost,
	usuariosPut,
	usuariosDelete
} = require('../controllers/user.controller');

const route = Router();

route.get('/', usuariosGet);

route.post('/', usuariosPost);

route.put('/:id', usuariosPut);

route.delete('/', usuariosDelete);

module.exports = route;
