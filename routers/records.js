const express = require('express');
const router = express.Router();
const Record = require('../models/record');
const Patient = require('../models/patient');
const Physio = require('../models/physio');
const { isAuthenticated, isPhysio } = require('../middlewares/auth');


router.get('/', isAuthenticated, async (req, res) => {
    try {
        let records;
        if (req.session.user.role === 'patient') {
            
            records = await Record.find({ patient: req.session.user.id }).populate('patient');
        } else {
            
            records = await Record.find().populate('patient');
        }
        res.render('records_list.njk', { records });
    } catch (error) {
        res.render('error.njk', { error: 'Error al obtener los expedientes' });
    }
});


router.get('/new', isPhysio, async (req, res) => {
    try {
        const patients = await Patient.find();
        res.render('record_add.njk', { patients });
    } catch (error) {
        res.render('error.njk', { error: 'Error al cargar el formulario' });
    }
});


router.post('/', isPhysio, async (req, res) => {
    try {
        const record = new Record(req.body);
        await record.save();
        res.redirect('/records');
    } catch (error) {
        const patients = await Patient.find();
        res.render('record_add.njk', {
            error: 'Error al crear el expediente',
            patients,
            record: req.body
        });
    }
});


router.get('/find', isAuthenticated, async (req, res) => {
    try {
        const { surname } = req.query;
        let records = [];
        if (surname) {
            if (req.session.user.role === 'patient') {
                
                records = await Record.find({
                    patient: req.session.user.id
                }).populate('patient');
            } else {
                
                const patients = await Patient.find({ 
                    surname: { $regex: surname, $options: 'i' } 
                });
                records = await Record.find({
                    patient: { $in: patients.map(p => p._id) }
                }).populate('patient');
            }
        }
        res.render('record_search.njk', { records, searchTerm: surname });
    } catch (error) {
        res.render('error.njk', { error: 'Error al buscar expedientes' });
    }
});


router.get('/:id/appointments/new', async (req, res) => {
    try {
        const record = await Record.findById(req.params.id).populate('patient');
        const physios = await Physio.find();
        if (!record) {
            return res.render('error.njk', { error: 'Expediente no encontrado' });
        }
        res.render('record_add_appointment.njk', { record, physios });
    } catch (error) {
        res.render('error.njk', { error: 'Error al cargar el formulario' });
    }
});


router.post('/:id/appointments', isPhysio, async (req, res) => {
    try {
        const record = await Record.findById(req.params.id);
        if (!record) {
            return res.render('error.njk', { error: 'Expediente no encontrado' });
        }
        record.appointments.push(req.body);
        await record.save();
        res.redirect(`/records/${record._id}`);
    } catch (error) {
        const physios = await Physio.find();
        res.render('record_add_appointment.njk', {
            error: 'Error al añadir la cita',
            record: await Record.findById(req.params.id).populate('patient'),
            physios,
            appointment: req.body
        });
    }
});


router.delete('/:id', isPhysio, async (req, res) => {
    try {
        await Record.findByIdAndDelete(req.params.id);
        res.redirect('/records');
    } catch (error) {
        res.render('error.njk', { error: 'Error al eliminar el expediente' });
    }
});

module.exports = router;