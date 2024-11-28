const mongoose = require("mongoose");

let pacienteSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    surname:{
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    birthDate:{
        type: Date,
        required: true
    },
    address:{
        type: String,
        maxlength: 100
    },
    insuranceNumber:{
        type: String,
        required: true,
        match: /^[a-zA-Z0-9]{9}$/,
        unique: true

    }
});

let patient = mongoose.model('Patients', pacienteSchema);
module.exports = patient;