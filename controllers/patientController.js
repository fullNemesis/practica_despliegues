const bcrypt = require('bcryptjs');
const Patient = require('../models/patient');

exports.createPatient = async (req, res) => {
    try {
        const patientData = req.body;
        
        const salt = await bcrypt.genSalt(10);
        patientData.password = await bcrypt.hash(patientData.password, salt);
        
        if (req.file) {
            patientData.image = req.file.filename;
        }

        const patient = new Patient(patientData);
        await patient.save();
        res.redirect('/patients');
    } catch (error) {
        res.render('patient_add.njk', {
            error: 'Error al crear el paciente',
            patient: req.body
        });
    }
}; 