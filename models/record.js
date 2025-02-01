const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: [true, 'La fecha de la cita es obligatoria']
    },
    physio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Physio',
        required: [true, 'El fisioterapeuta es obligatorio']
    },
    diagnosis: {
        type: String,
        required: [true, 'El diagnóstico es obligatorio']
    },
    treatment: {
        type: String,
        required: [true, 'El tratamiento es obligatorio']
    }
}, {
    timestamps: true
});

const recordSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: [true, 'El paciente es obligatorio']
    },
    diagnosis: {
        type: String,
        required: [true, 'El diagnóstico inicial es obligatorio']
    },
    observations: {
        type: String
    },
    appointments: [appointmentSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Record', recordSchema);