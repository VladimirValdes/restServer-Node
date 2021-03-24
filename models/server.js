
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        
        // Paths

        this.paths = {
            auth      : '/api/auth',
            buscar    : '/api/buscar',
            categorias: '/api/categorias',
            productos : '/api/productos',
            usuarios  : '/api/usuarios',
            
        }

        // Conectar DB
        this.conectarDB();

        // Middlewares 
        this.middlewares();

        // Rutas de mi aplicacion
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
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

        this.app.use( this.paths.auth, require('../routes/auth.route'))
        this.app.use( this.paths.usuarios, require('../routes/user.route'));
        this.app.use( this.paths.categorias, require('../routes/categorias.route'));
        this.app.use( this.paths.productos, require('../routes/productos.route'));
        this.app.use( this.paths.buscar, require('../routes/buscar.route'));


    }

    listen() {
        this.app.listen( this.port, () => {
            console.log(`Servidor corriendo en el puerto ${ this.port }`);
        })
    }
}

module.exports = Server;