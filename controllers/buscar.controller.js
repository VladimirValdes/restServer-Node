const { response } = require('express');
const { ObjectId } = require('mongoose').Types;
const { Usuario, Categoria, Producto } = require('../models');

const coleccionesPermitidas = [
    "productos",
    "categorias",
    "usuarios",
    "roles"
]


const buscarUsuarios = async( termino = '', res = response ) => {
    
    const esMongoID = ObjectId.isValid( termino );

    if ( esMongoID ) {
        const usuario = await Usuario.findById( termino );

        return res.json({
            results : ( usuario ) ? [ usuario ] : []
        });
    } 

    const regex = new RegExp( termino, "i"); // Expresion regular para que no sea sensible a minusculas o Mayus
    const usuario = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });

    res.json({
        results : usuario
    });
    
}

const buscarCategorias = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino );
    
    if ( esMongoID ) {
        const categoria = await Categoria.findById( termino );

        return res.json({
            results : ( categoria ) ? [ categoria ] : []
        });
    } 

    const regex = new RegExp( termino, "i");
    const categoria = await Categoria.find({
        $or: [{ nombre: regex }],
        $and: [{ estado: true }]
    });

    
    res.json({
        results :categoria
    });

}

const buscarProductos = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino );


    if ( esMongoID ) {
        const producto = await Producto.findById( termino )
                                       .populate("categoria", "nombre");

        return res.json({
            results : ( producto ) ? [ producto ] : []
        });
    } 

    const regex = new RegExp( termino, "i");
    const producto = await Producto.find({
        $or: [{ nombre: regex }],
        $and: [{ estado: true }]
    })
    .populate("categoria", "nombre");
    

    res.json({
        results : producto 
    });
}


const buscar = ( req, res = response ) => {

    const { coleccion, termino } = req.params;

    if ( !coleccionesPermitidas.includes( coleccion )) {
        return res.status(400).json({
            msg: `Las condiciones permitidas son: ${ coleccionesPermitidas }`
        });
    }

    switch (coleccion) {
        case "usuarios":
                buscarUsuarios(termino, res );
            break;
        case "categorias":
                buscarCategorias( termino, res );
            break;
        case "productos":
                buscarProductos( termino, res );
            break;
        default:
            res.status(500).json({
                msg: `Esa busqueda aun no esta viejo :P`
            });
            break;
    }

 
}


const buscarProductXCat = async( req, res = response ) => {

    const { categoria } = req.params;

    const esMongoID = ObjectId.isValid( categoria );

    if ( esMongoID ) {
        const producto = await Producto.find({
            $or: [{ categoria: categoria }],
            $and: [{ estado: true }]
        });

       return res.json({
            msg: 'Desde Products*Categoria',
            results : ( producto ) ? [ producto ] : []
        });
    } 

    res.status(400).json({
        msg: `La categoria ${ categoria } no existe`
    });

}


const buscarAllCategoriasProd = async( req, res = response ) => {


    const categorias = await Categoria.find({ estado: true });

    const productosXCategoria = [];

        for (const categoria of categorias) {

            const productos = await Producto.find({
                $or: [{ categoria: categoria._id }],
                $and: [{ estado: true }]
            });
    
            const catg = {
                nombre: categoria.nombre,
                productos
            }
    
            productosXCategoria.push(catg);
        }
        
      
    

    return res.json({
        categorias: productosXCategoria
    });

}


module.exports = {
    buscar,
    buscarProductXCat,
    buscarAllCategoriasProd
}