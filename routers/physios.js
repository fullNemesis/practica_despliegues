// routes/physios.js
const express = require('express');
const router = express.Router();
const Physio = require('../models/physio');
const { authenticateToken } = require('../auth/auth');

router.get('/', authenticateToken(['admin', 'physio', 'patient']), async (req, res) => {
    try {
        const physios = await Physio.find();
        if (physios.length === 0) {
            return res.status(404).json({ error: 'No hay fisios en el sistema' });
        }
        res.status(200).json({ result: physios });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.get('/find', authenticateToken(['admin', 'physio', 'patient']), async (req, res) => {
    try {
        const { specialty } = req.query;
        const physios = await Physio.find({ specialty });
        
        if (physios.length === 0) {
            return res.status(404).json({ error: 'No se encontraron fisios con esos criterios' });
        }
        res.status(200).json({ result: physios });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.get('/:id', authenticateToken(['admin', 'physio', 'patient']), async (req, res) => {
    try {
        const physio = await Physio.findById(req.params.id);
        if (!physio) {
            return res.status(404).json({ error: 'El fisio no se ha encontrado' });
        }
        res.status(200).json({ result: physio });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.post('/', authenticateToken(['admin']), async (req, res) => {
    try {
        const physio = new Physio(req.body);
        const savedPhysio = await physio.save();
        res.status(201).json({ result: savedPhysio });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:id', authenticateToken(['admin']), async (req, res) => {
    try {
        const updatedPhysio = await Physio.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedPhysio) {
            return res.status(400).json({ error: 'Error actualizando los datos del fisio' });
        }
        res.status(200).json({ result: updatedPhysio });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.delete('/:id', authenticateToken(['admin']), async (req, res) => {
    try {
        const deletedPhysio = await Physio.findByIdAndDelete(req.params.id);
        if (!deletedPhysio) {
            return res.status(404).json({ error: 'El fisioterapeuta a eliminar no existe' });
        }
        res.status(200).json({ result: deletedPhysio });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;