
const { Router } = require('express');
const { check } = require('express-validator');

const { login } = require('../controllers/auth.controller');
const { validarCampos } = require('../middlewares/validar-campos');

const route = Router();

route.post('/login',[
    check('correo', 'El correo no es valido').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login)



module.exports = route;