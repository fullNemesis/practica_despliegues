const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true
    },
    surname: {
        type: String,
        required: [true, 'Los apellidos son obligatorios'],
        trim: true
    },
    dni: {
        type: String,
        required: [true, 'El DNI es obligatorio'],
        unique: [true, 'Este DNI ya está registrado'],
        match: [/^[0-9]{8}[A-Z]$/, 'El formato del DNI no es válido']
    },
    birthDate: {
        type: Date,
        required: [true, 'La fecha de nacimiento es obligatoria']
    },
    phone: {
        type: String,
        required: [true, 'El teléfono es obligatorio'],
        match: [/^[0-9]{9}$/, 'El formato del teléfono no es válido']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: [true, 'Este email ya está registrado'],
        match: [/.+\@.+\..+/, 'El formato del email no es válido']
    },
    address: {
        type: String,
        required: [true, 'La dirección es obligatoria']
    },
    image: {
        type: String,
        required: false
    },
    username: {
        type: String,
        required: [true, 'El nombre de usuario es obligatorio'],
        unique: [true, 'Este nombre de usuario ya está en uso']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    role: {
        type: String,
        enum: ['patient'],
        default: 'patient'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Patient', patientSchema);