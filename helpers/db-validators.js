
const Role = require('../models/role');
const { Usuario, Categoria, Producto } = require('../models');
// const Usuario = require('../models/usuario');


const esRoleValido = async( rol = '') => {

    const existeRol = await Role.findOne({ rol });

    if ( !existeRol ) {
        throw new Error(` El rol  ${ rol } no esta registrado en la DB`);
    }
}

const emailExiste = async( correo = '' ) => {
    
    const correoExiste = await Usuario.findOne({ correo });

    if ( correoExiste ) {
        
      throw new Error(`El correo ${ correo } ya esta registrado`);
    }
}

const usuarioExistePorId = async( id ) => {

    const idExiste = await Usuario.findById(id);

    if ( !idExiste ) {
        throw new Error(`El id ${ id } no existe`)
    }
}

const existeCategoria = async( id ) => {

    if ( id.length > 0) {
        const categoriaExiste = await Categoria.findById( id );
    
        if ( !categoriaExiste ) {
            throw new Error(`La categoria ${ id } no existe `);
        }
    }
   
}

const duplicateCategoria = async( nombre = "" ) => {

    nombre = nombre.toLocaleUpperCase();
    
    const isCategoriaDuplicate = await Categoria.findOne({ nombre });
    
    if ( isCategoriaDuplicate ) {
        console.log(isCategoriaDuplicate);
        throw new Error(`La categoria ${ nombre } ya existe`);
    }
}

const existeProducto = async( id ) => {
    const productoExiste = await Producto.findById( id );

    if ( !productoExiste ) {
        throw new Error(`El producto ${ id } no existe `);
    }
}


const colleccionesPermitidas = ( colecccion = '', colecciones = []) => {


    const incluida = colecciones.includes( colecccion );

    if ( !incluida ) {
        throw new Error(` La coleccion ${ colecccion } no es permitida, ${ colecciones }`);
    }

    return true;
}

module.exports = {
    esRoleValido,
    emailExiste,
    usuarioExistePorId,
    existeCategoria,
    duplicateCategoria,
    existeProducto,
    colleccionesPermitidas
}