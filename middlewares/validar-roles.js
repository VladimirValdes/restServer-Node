
const { response } = require('express');

const esadminRole = ( req, res = response, next ) => {

    if ( !req.usuario ) {
        return res.status(500).json({
            msg: `Se require verificar el rol sin validar el token primero`
        });
    }

    const { rol, nombre } = req.usuario;

    if ( rol !== 'ADMIN_ROLE' ) {
        
        return res.status(401).json({
            msg: `${ nombre } no es administrado - No puede hacer esto`
        });
    }

    next();
}

//...roles  👇
// el operador spread nos permite obtener todos los parametros que nos envien pormedio de la funcion y
// nos los devuelve en forma de array

const tieneRole = ( ...roles ) => {

    return ( req, res = response, next ) => {

        if ( !req.usuario ) {
            return res.status(500).json({
                msg: `Se require verificar el rol sin validar el token primero`
            });
        }

        if ( !roles.includes( req.usuario.rol )) {
            return res.status(401).json({
                msg: `El servicio require uno de los siguientes roles ${ roles }`
            })
        }

        next();
    }
}

module.exports = {
    esadminRole,
    tieneRole
}