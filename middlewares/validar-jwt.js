
const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');


const validarJWT = async( req = request, res = response, next ) => {

    // extraer parametros que vinen en el headers
    const token = req.header('x-token');

    if ( !token ) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        });
    }

    try {

        // const payload

        // Verificar si es un token valido
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY);

        const usuario = await Usuario.findById( uid );

        // Verifcar si el usuario es null o undefined

        if ( !usuario ) {
            return res.status(401).json({
                msg: 'Token no valido - usuario no existe en la DB'
            })
        }

        // Verificar si el uid tiene estado en true

        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Token no valido - usuario con estado: false'
            })
        }

        req.usuario = usuario;

        // req.uid = uid;


        next();


        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'   
        });
    }

    console.log(token);
}

module.exports = {
    validarJWT
}