import express from 'express';
import Evento from '../models/evento.js';
import Recinto from '../models/recinto.js';

let router = express.Router();

// GET /eventos - obtengo todos los eventos con populate del recinto
router.get('/', async (req, res) => {
    try {
        let resultado = await Evento.find().populate('recinto');
        if (resultado.length > 0) {
            res.status(200).send({ ok: true, resultado: resultado });
        } else {
            res.status(500).send({ ok: false, error: "No se han encontrado eventos" });
        }
    } catch (error) {
        res.status(500).send({ ok: false, error: "No se han encontrado eventos" });
    }
});

// GET /eventos/entradas/:idEvento/:tipoEntrada - obtengo precio y disponibles de un tipo de entrada
// (pongo las rutas específicas antes de /:id para que no capture "entradas" o "localidad" como id)
router.get('/entradas/:idEvento/:tipoEntrada', async (req, res) => {
    try {
        let evento = await Evento.findById(req.params.idEvento);
        if (evento) {
            let entrada = evento.entradas.find(e => e.tipo === req.params.tipoEntrada);
            if (entrada) {
                res.status(200).send({
                    ok: true,
                    resultado: { precio: entrada.precio, disponibles: entrada.disponibles }
                });
            } else {
                res.status(404).send({ ok: false, error: "Error obteniendo datos de entrada para evento " + req.params.idEvento });
            }
        } else {
            res.status(404).send({ ok: false, error: "Error obteniendo datos de entrada para evento " + req.params.idEvento });
        }
    } catch (error) {
        res.status(404).send({ ok: false, error: "Error obteniendo datos de entrada para evento " + req.params.idEvento });
    }
});

// PUT /eventos/entradas/:idEvento/:tipoEntrada/:cantidad - resto entradas disponibles
router.put('/entradas/:idEvento/:tipoEntrada/:cantidad', async (req, res) => {
    try {
        let evento = await Evento.findById(req.params.idEvento);
        if (evento) {
            let entrada = evento.entradas.find(e => e.tipo === req.params.tipoEntrada);
            let cantidad = parseInt(req.params.cantidad);

            if (entrada && entrada.disponibles >= cantidad) {
                // Resto la cantidad de entradas disponibles
                entrada.disponibles -= cantidad;
                let resultado = await evento.save();
                res.status(200).send({ ok: true, resultado: resultado });
            } else {
                res.status(404).send({ ok: false, error: "Error actualizando entradas del evento " + req.params.idEvento });
            }
        } else {
            res.status(404).send({ ok: false, error: "Error actualizando entradas del evento " + req.params.idEvento });
        }
    } catch (error) {
        res.status(404).send({ ok: false, error: "Error actualizando entradas del evento " + req.params.idEvento });
    }
});

// GET /eventos/localidad/:nombre - busco eventos por localidad del recinto y que no hayan pasado
router.get('/localidad/:nombre', async (req, res) => {
    try {
        // Primero busco los recintos de esa localidad
        let recintos = await Recinto.find({ localidad: req.params.nombre });
        let idsRecintos = recintos.map(r => r._id);

        // Busco eventos con esos recintos y cuya fecha sea futura
        let resultado = await Evento.find({
            recinto: { $in: idsRecintos },
            fecha: { $gte: new Date() }
        }).populate('recinto');

        if (resultado.length > 0) {
            res.status(200).send({ ok: true, resultado: resultado });
        } else {
            res.status(404).send({ ok: false, error: "No se han encontrado eventos" });
        }
    } catch (error) {
        res.status(404).send({ ok: false, error: "No se han encontrado eventos" });
    }
});

// GET /eventos/:id - busco un evento por su id
router.get('/:id', async (req, res) => {
    try {
        let resultado = await Evento.findById(req.params.id).populate('recinto');
        if (resultado) {
            res.status(200).send({ ok: true, resultado: resultado });
        } else {
            res.status(404).send({ ok: false, error: "Evento " + req.params.id + " no encontrado" });
        }
    } catch (error) {
        res.status(404).send({ ok: false, error: "Evento " + req.params.id + " no encontrado" });
    }
});

// POST /eventos - creo un nuevo evento
router.post('/', async (req, res) => {
    try {
        let nuevoEvento = new Evento(req.body);
        let resultado = await nuevoEvento.save();
        res.status(201).send({ ok: true, resultado: resultado });
    } catch (error) {
        res.status(500).send({ ok: false, error: "Error añadiendo evento" });
    }
});

// PUT /eventos/:id - actualizo un evento por su id
router.put('/:id', async (req, res) => {
    try {
        let resultado = await Evento.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { returnDocument: 'after', runValidators: true }
        );
        if (resultado) {
            res.status(200).send({ ok: true, resultado: resultado });
        } else {
            res.status(404).send({ ok: false, error: "Error actualizando evento " + req.params.id });
        }
    } catch (error) {
        res.status(404).send({ ok: false, error: "Error actualizando evento " + req.params.id });
    }
});

// DELETE /eventos/:id - elimino un evento por su id
router.delete('/:id', async (req, res) => {
    try {
        let resultado = await Evento.findByIdAndDelete(req.params.id);
        if (resultado) {
            res.status(200).send({ ok: true, resultado: resultado });
        } else {
            res.status(404).send({ ok: false, error: "Error eliminando evento " + req.params.id });
        }
    } catch (error) {
        res.status(404).send({ ok: false, error: "Error eliminando evento " + req.params.id });
    }
});

export default router;
