const path = require('path');
const fs   = require('fs');

// Cloudinary

const cloudinary = require('cloudinary').v2;
// CONFIG
cloudinary.config( process.env.CLOUDINARY_URL );


const { response } = require('express');
const { subirArchivo } = require('../helpers');

const { Usuario, Producto } = require('../models')


const cargarArchivo = async( req, res = response ) => {


  try {
    // const nombre = await subirArchivo( req.files, ['txt', 'md'], 'textos' );
    const nombre = await subirArchivo( req.files, undefined, 'imgs' );


    res.json({
      nombre
    });

  } catch (msg) {
    
    res.status(400).json({ msg })
  }

 
}


const actualizarImagen = async( req, res = response ) => {

  const { id, coleccion } = req.params;

  let modelo;

  switch ( coleccion ) {
    case 'usuarios':
        modelo = await Usuario.findById( id );

        if ( !modelo ) {
          return res.status(400).json({
            msg: `No existe un usuario con el id ${ id }`
          });
        }

      break;

    case 'productos':
        modelo = await Producto.findById( id );

        if ( !modelo ) {
          return res.status(400).json({
            msg: `No existe un producto con el id ${ id }`
          });
        }

      break;    
  
    default:
      return res.status(500).json({ msg: `Se me olvido validar eso`})
  }


  // Limpiar imagenes previas 

  if( modelo.img ) {
    // Hay que borrar la imagen del servidor

    const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img );
    if ( fs.existsSync( pathImagen )) {
      fs.unlinkSync( pathImagen ); // Nos permite borrar la imagen
    }
  }

  const nombre = await subirArchivo( req.files, undefined, coleccion );
        modelo.img = nombre;

        await modelo.save();

      res.json({
        modelo
      })
}


const actualizarImagenCloudinary = async( req, res = response ) => {

  const { id, coleccion } = req.params;

  let modelo;

  switch ( coleccion ) {
    case 'usuarios':
        modelo = await Usuario.findById( id );

        if ( !modelo ) {
          return res.status(400).json({
            msg: `No existe un usuario con el id ${ id }`
          });
        }

      break;

    case 'productos':
        modelo = await Producto.findById( id );

        if ( !modelo ) {
          return res.status(400).json({
            msg: `No existe un producto con el id ${ id }`
          });
        }

      break;    
  
    default:
      return res.status(500).json({ msg: `Se me olvido validar eso`})
  }


  // Limpiar imagenes previas 

  if( modelo.img ) {
    // Hay que borrar la imagen de cloudinary
    const nombreArr = modelo.img.split('/');
    const nombre = nombreArr[ nombreArr.length -1 ];
    const [ public_id ] = nombre.split('.');

    // Eliminandola de cloudinary
    cloudinary.uploader.destroy( public_id );

  }

  const { tempFilePath } = req.files.archivo; // Extrayendo la ruta temporal del archivo
  const { secure_url } = await cloudinary.uploader.upload( tempFilePath ); // extrayendo de la res de cloudinary el secure_url
  modelo.img = secure_url;

   await modelo.save();

      res.json({
        modelo
      });
}


const cargarImagen = async( req, res = response ) => {

  const { id, coleccion } = req.params;

  let modelo;

  switch ( coleccion ) {
    case 'usuarios':
        modelo = await Usuario.findById( id );

        if ( !modelo ) {
          return res.status(400).json({
            msg: `No existe un usuario con el id ${ id }`
          });
        }

      break;

    case 'productos':
        modelo = await Producto.findById( id );

        if ( !modelo ) {
          return res.status(400).json({
            msg: `No existe un producto con el id ${ id }`
          });
        }

      break;    
  
    default:
      return res.status(500).json({ msg: `Se me olvido validar eso`})
  }


  // Limpiar imagenes previas 

  if( modelo.img ) {

    const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img );
    if ( fs.existsSync( pathImagen )) {
      return res.sendFile(pathImagen);
    }
  }

  const pathNoImage = path.join(__dirname, '../assets/no-image.jpg',)
      res.sendFile(pathNoImage);
}


module.exports = {
    cargarArchivo,
    actualizarImagen,
    cargarImagen,
    actualizarImagenCloudinary
}