const mongoose = require('mongoose');

const physioSchema = new mongoose.Schema({
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
    collegiateNumber: {
        type: String,
        required: [true, 'El número de colegiado es obligatorio'],
        unique: [true, 'Este número de colegiado ya está registrado']
    },
    specialty: {
        type: String,
        required: [true, 'La especialidad es obligatoria']
    },
    yearsOfExperience: {
        type: Number,
        required: [true, 'Los años de experiencia son obligatorios'],
        min: [0, 'Los años de experiencia no pueden ser negativos']
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
        enum: ['physio', 'admin'],
        default: 'physio',
        required: true
    }
}, {
    timestamps: true,
    strict: true
});

physioSchema.pre('save', async function(next) {
    try {
        const collection = this.collection;
        const indexes = await collection.getIndexes();
        if (indexes.licenseNumber_1) {
            await collection.dropIndex('licenseNumber_1');
        }
        next();
    } catch (error) {
        next();
    }
});

module.exports = mongoose.model('Physio', physioSchema);