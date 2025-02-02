const express = require('express');
const router = express.Router();
const Patient = require('../models/patient');
const User = require('../models/user');
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });
const { isAuthenticated, isPhysio } = require('../middlewares/auth');

router.get('/', isAuthenticated, async (req, res) => {
    try {
        const patients = await Patient.find();
        res.render('patients_list.njk', { patients });
    } catch (error) {
        res.render('error.njk', { error: 'Error al obtener los pacientes' });
    }
});

router.get('/new', isPhysio, (req, res) => {
    res.render('patient_add.njk');
});

router.post('/', isPhysio, upload.single('image'), async (req, res) => {
    try {
        const patientData = {
            name: req.body.name,
            surname: req.body.surname,
            dni: req.body.dni,
            birthDate: req.body.birthDate,
            phone: req.body.phone,
            email: req.body.email,
            address: req.body.address,
            username: req.body.username,
            password: req.body.password
        };

        if (req.file) {
            patientData.image = req.file.filename;
        }

        const patient = new Patient(patientData);
        await patient.save();
        res.redirect('/patients');
    } catch (error) {
        res.render('patient_add.njk', { 
            error: error.message || 'Error al crear el paciente',
            patient: req.body 
        });
    }
});

router.get('/find', isPhysio, async (req, res) => {
    try {
        const { surname } = req.query;
        let patients = [];
        if (surname) {
            patients = await Patient.find({ 
                surname: { $regex: surname, $options: 'i' } 
            });
        }
        res.render('patient_search.njk', { patients, searchTerm: surname });
    } catch (error) {
        res.render('error.njk', { error: 'Error al buscar pacientes' });
    }
});

router.get('/:id', isAuthenticated, async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.render('error.njk', { 
                error: 'Paciente no encontrado' 
            });
        }
        res.render('patient_detail.njk', { patient });
    } catch (error) {
        res.render('error.njk', { 
            error: 'Error al obtener el paciente' 
        });
    }
});

router.get('/:id/edit', isPhysio, async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.render('error.njk', { 
                error: 'Paciente no encontrado' 
            });
        }
        res.render('patient_edit.njk', { patient });
    } catch (error) {
        res.render('error.njk', { 
            error: 'Error al obtener el paciente' 
        });
    }
});

router.put('/:id', isPhysio, upload.single('image'), async (req, res) => {
    try {
        const patientData = req.body;
        if (req.file) {
            patientData.image = req.file.filename;
        }
        const patient = await Patient.findByIdAndUpdate(
            req.params.id,
            patientData,
            { new: true }
        );
        res.redirect(`/patients/${patient._id}`);
    } catch (error) {
        res.render('patient_edit.njk', {
            error: 'Error al actualizar el paciente',
            patient: req.body
        });
    }
});

router.delete('/:id', isPhysio, async (req, res) => {
    try {
        await Patient.findByIdAndDelete(req.params.id);
        res.redirect('/patients');
    } catch (error) {
        res.render('error.njk', { error: 'Error al eliminar el paciente' });
    }
});

router.get('/:id/record/new', isPhysio, async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.render('error.njk', { error: 'Paciente no encontrado' });
        }
        res.render('record_add.njk', { 
            patient,
            patients: [patient]
        });
    } catch (error) {
        res.render('error.njk', { error: 'Error al cargar el formulario' });
    }
});

module.exports = router;