
const { Router } = require('express');
const { check } = require('express-validator');

const { login, googleSignin } = require('../controllers/auth.controller');
const { validarCampos } = require('../middlewares/validar-campos');

const route = Router();

route.post('/login',[
    check('correo', 'El correo no es valido').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login);

route.post('/google',[
    check('id_token', 'El id_token es necesario').not().isEmpty(),
    validarCampos
], googleSignin);



module.exports = route;