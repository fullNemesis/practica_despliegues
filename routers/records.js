const express = require("express");
const Record = require("../models/record");
const { authenticateToken, authenticatePatient } = require("../auth/auth");
const router = express.Router();

router.get('/', authenticateToken(['admin', 'physio']), async (req, res) => {
    try {
        const records = await Record.find()
            .populate('patient')
            .populate('appointments.physio');
        if (records.length === 0) {
            return res.status(404).json({ error: 'No se encontraron expedientes médicos' });
        }
        res.status(200).json({ result: records });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.get('/find', authenticateToken(['admin', 'physio']), async (req, res) => {
    try {
        const { surname } = req.query;

        if (!surname) {
            return res.status(400).json({
                error: 'Es necesario proporcionar un apellido para la búsqueda'
            });
        }

        const records = await Record.find()
            .populate({
                path: 'patient',
                match: { surname: { $regex: new RegExp(surname, 'i') } },
                select: 'name surname birthDate address insuranceNumber'
            })
            .populate('appointments.physio');

        const filteredRecords = records.filter(record => record.patient !== null);

        if (filteredRecords.length === 0) {
            return res.status(404).json({
                error: 'No se encontraron expedientes para el apellido proporcionado'
            });
        }

        return res.status(200).json({ result: filteredRecords });
    } catch (error) {
        console.error('Error al buscar expedientes:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.get('/:id', 
    authenticateToken(['admin', 'physio', 'patient']),
    authenticatePatient,
    async (req, res) => {
        try {
            const record = await Record.findById(req.params.id)
                .populate('patient')
                .populate('appointments.physio');
            if (!record) {
                return res.status(404).json({ error: 'Expediente no encontrado' });
            }
            res.status(200).json({ result: record });
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
);

router.post('/', authenticateToken(['admin', 'physio']), async (req, res) => {
    try {
        const newRecord = new Record(req.body);
        const saveRecord = await newRecord.save();
        res.status(201).json({ result: saveRecord });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/:id/appointments', authenticateToken(['admin', 'physio']), async (req, res) => {
    try {
        const record = await Record.findById(req.params.id);
        if (!record) {
            return res.status(404).json({ error: 'Expediente no encontrado' });
        }
        record.appointments.push(req.body);

        const updateRecord = await record.save();
        res.status(201).json({ result: updateRecord });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.delete('/:id', authenticateToken(['admin', 'physio']), async (req, res) => {
    try {
        const deleteRecord = await Record.findByIdAndDelete(req.params.id);
        if (!deleteRecord) {
            return res.status(404).json({ error: 'Expediente no existe' });
        }
        res.status(200).json({ result: deleteRecord });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;