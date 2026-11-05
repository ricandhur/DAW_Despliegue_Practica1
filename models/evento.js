import mongoose from 'mongoose';

// Esquema para las entradas (subdocumento dentro de evento)
let entradaSchema = new mongoose.Schema({
    tipo: {
        type: String,
        required: true,
        minlength: 3,
        trim: true
    },
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    disponibles: {
        type: Number,
        required: true,
        min: 0
    }
});

// Esquema para los eventos
let eventoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        minlength: 5,
        trim: true
    },
    fecha: {
        type: Date,
        required: true
    },
    recinto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'recintos',
        required: true
    },
    entradas: [entradaSchema]
});

let Evento = mongoose.model('eventos', eventoSchema);
export default Evento;
