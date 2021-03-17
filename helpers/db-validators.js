
const Role = require('../models/role');
const Usuario = require('../models/usuario');


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

module.exports = {
    esRoleValido,
    emailExiste,
    usuarioExistePorId
}