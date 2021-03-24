
const { response } = require('express');
const { Categoria } = require('../models')


const categoriasGet = async( req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments( query ),
        Categoria.find(query)
                 .skip( Number( desde ))
                 .limit( Number( limite ))
                 .populate('usuario', 'nombre')
    ]);

    res.json({
        total,
        categorias
    });
}

const categoriasGetById = async( req, res = response ) => {

    const { id } = req.params;

    const categoria = await Categoria.findById( id )
                                     .populate('usuario', 'nombre');

    if ( !categoria.estado ) {
        res.status(400).json({
            msg: `La categoria no esta activa - estado false`
        })
    }

    res.json({
        msg: 'Desde categoriasGetID',
        categoria
    });
}


const categoriasPost = async( req, res = response ) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if ( categoriaDB ) {
        console.log(categoriaDB);

        if ( !categoriaDB.estado ) {

            const { id, ...resto } = categoriaDB

            const categoria = await Categoria.findByIdAndUpdate(id, { estado: true }, { new: true });

            return res.json({
                msg: 'Lo actualize perro',
                categoria
            });
        }

        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre }, ya existe `
        });
    }

    // Generar data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria  = new Categoria( data );

    // Guardar DB
    await categoria.save();



    res.status(201).json({
        categoria
    });
}


const categoriasPut = async( req, res = response ) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;


    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

    res.json({
        categoria
    });
}


const categoriasDelete = async( req, res = response ) => {

    const { id } = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true })
    res.json({
        categoria
    })
}


module.exports = {
    categoriasGet,
    categoriasGetById,
    categoriasPost,
    categoriasPut,
    categoriasDelete
}