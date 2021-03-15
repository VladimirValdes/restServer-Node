
const { response } = require('express');

const usuariosGet = ( req, res = response ) => {
    // res.send('Hola Mundo');

    const { q, nombre = 'No name', pagina = 1, limit = 10 } = req.query;
    
    res.json({
        msg: 'get API - Controlador',
        q,
        nombre,
        pagina,
        limit
    })
}

const usuariosPost = ( req, res = response ) => {
    // res.send('Hola Mundo');
    const { nombre, edad } = req.body;

    res.json({
        msg: 'post API - Controlador',
        nombre,
        edad
    })
}

const usuariosPut =  ( req, res = response ) => {

    const { id } = req.params;

    res.json({
        msg: 'put API - Controlador ',
        id
    })
}

const usuariosDelete = ( req, res = response ) => {
    // res.send('Hola Mundo');
    res.json({
        msg: 'delete API - Controlador '
    })
}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete
}