
const { response } = require('express');
const { Producto } = require('../models');


const productosGet = async( req, res = response )=> {

    const { limite = 5, desde = 0, categoria = "" } = req.query;
    const query = { 
        estado: true,
        // categoria
    };


    // query.categoria = categoria;

    console.log(query);

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments( query ),
        Producto.find( query )
                 .skip( Number( desde ))
                 .limit( Number( limite ))
                 .populate('usuario', 'nombre')
                 .populate('categoria', 'nombre')
    ]);

    res.json({
        total,
        productos
    });
}

const productosGetById = async( req, res = response )=> {

    const { id } = req.params;

    const producto = await Producto.findById( id )
                                     .populate('usuario', 'nombre')
                                     .populate('categoria', 'nombre');

    if ( !producto.estado ) {
        res.status(400).json({
            msg: `El producto no esta activo - estado false`
        })
    }

    res.json({
        producto
    });

    
}

const productosPost = async( req, res = response )=> {

    // Poner el nombre en UpperCase
    const { estado, nombre, descripcion, categoria, precio, disponible } = req.body;

    const productoDB = await Producto.findOne({ nombre });

    if ( productoDB ) {
        return res.status(400).json({
            msg: `El producto ${ nombre } ya existe`
        });
    }
    

    // Generar data a guardar 

    const data = {
        nombre,
        precio,
        descripcion,
        disponible,
        categoria,
        usuario : req.usuario._id
    };

    const producto = new Producto( data );

    // Guardar DB
    await producto.save();

    res.status(201).json({
        producto
    });
}

const productosPut = async( req, res = response ) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.usuario = req.usuario._id;


    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.json({
        producto
    });
}


const productosDelete = async( req, res = response ) => {

    const { id } = req.params;

    const producto = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true })
    res.json({
        producto
    })
}



module.exports = {
    productosGet,
    productosGetById,
    productosPost,
    productosPut,
    productosDelete
}