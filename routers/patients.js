const express = require('express');
const router = express.Router();
const Patient = require('../models/patient');
const { authenticateToken, authenticatePatient } = require('../auth/auth');

router.get('/', authenticateToken(['admin', 'physio']), async (req, res) => {
    try {
        const patients = await Patient.find();
        if (patients.length === 0) {
            return res.status(404).json({ error: 'No hay pacientes en el sistema' });
        }
        res.status(200).json({ result: patients });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.get('/find', authenticateToken(['admin', 'physio']), async (req, res) => {
    try {
        const { surname } = req.query;
        const patients = await Patient.find({
            surname: { $regex: surname, $options: 'i' }
        });
        
        if (patients.length === 0) {
            return res.status(404).json({ error: 'No se encontraron pacientes con esos criterios' });
        }
        res.status(200).json({ result: patients });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.get('/:id', authenticateToken(['admin', 'physio', 'patient']), 
    authenticatePatient, async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ error: 'El paciente no se ha encontrado' });
        }
        res.status(200).json({ result: patient });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.post('/', authenticateToken(['admin', 'physio']), async (req, res) => {
    try {
        const patient = new Patient(req.body);
        const savedPatient = await patient.save();
        res.status(201).json({ result: savedPatient });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:id', authenticateToken(['admin', 'physio']), async (req, res) => {
    try {
        const updatedPatient = await Patient.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedPatient) {
            return res.status(400).json({ error: 'Error actualizando los datos del paciente' });
        }
        res.status(200).json({ result: updatedPatient });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.delete('/:id', authenticateToken(['admin', 'physio']), async (req, res) => {
    try {
        const deletedPatient = await Patient.findByIdAndDelete(req.params.id);
        if (!deletedPatient) {
            return res.status(404).json({ error: 'El paciente a eliminar no existe' });
        }
        res.status(200).json({ result: deletedPatient });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;