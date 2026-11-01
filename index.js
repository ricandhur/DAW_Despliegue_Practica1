// Cargo las variables de entorno
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';

// Importo los enrutadores
import recintos from './routes/recintos.js';
import eventos from './routes/eventos.js';

// Conecto con la base de datos
mongoose.connect(process.env.URL_BD);

// Creo el servidor Express y habilito JSON
let app = express();
app.use(express.json());

// Cargo los enrutadores con sus rutas
app.use('/recintos', recintos);
app.use('/eventos', eventos);

// Pongo en marcha el servidor
app.listen(process.env.PUERTO);
