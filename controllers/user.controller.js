
const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGet = async( req, res = response ) => {
    // res.send('Hola Mundo');

    // const { q, nombre = 'No name', pagina = 1, limit = 10 } = req.query;

    // Realizar validacion si no es un numero !!!
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    // const usuarios = await Usuario.find(query)
    //       .skip(Number(desde))
    //       .limit(Number(limite));

    // const total = await Usuario.countDocuments(query);

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
               .skip(Number(desde))
               .limit(Number(limite))
    ])
    
    res.json({
        total,
        usuarios
    });
}


usuariosGetById = async( req, res = response ) => {

    const { id } = req.params;

    const usuario = await Usuario.findById( id );

    res.json({
        usuario,
        msg: 'Desde usuario por id'
    })
}

const usuariosPost = async( req, res = response ) => {


    const { nombre, password, correo, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

  

    // Encriptar la password

    const salt = bcryptjs.genSaltSync();

    usuario.password = bcryptjs.hashSync(password, salt);


    // Guardar en la DB
    await usuario.save();

    res.json({
        usuario
    })
}

const usuariosPut =  async( req, res = response ) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    if ( password ) {
        const salt = bcryptjs.genSaltSync();

        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto, { new: true } );

    res.json({
        usuario
    })
}

const usuariosDelete = async( req, res = response ) => {

    const {  id } = req.params;

    // Borrar Fisicamente
    // const usuario = await Usuario.findByIdAndRemove(id);

    //
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false }, { new: true });

    res.json({
        usuario
    })
}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete
}

