
const express = require('express');
const cors = require('cors');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        
        // Paths
        this.usuariosPath = '/api/usuarios';


        // Middlewares 
        this.middlewares();

        // Rutas de mi aplicacion
        this.routes();
    }

    middlewares() {

        // CORS
        this.app.use(cors());

        // Parsear json

        this.app.use(express.json());

        // Directorio Publico
        this.app.use( express.static('public'));
    }

    routes() {


        this.app.use( this.usuariosPath, require('../routes/user.route'));
      

    }

    listen() {
        this.app.listen( this.port, () => {
            console.log(`Servidor corriendo en el puerto ${ this.port }`);
        })
    }
}

module.exports = Server;