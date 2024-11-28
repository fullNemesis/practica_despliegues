const mongoose = require("mongoose");
let ConsultaSchema= new mongoose.Schema({
    date:{
        type: Date,
        required: true
    },
    physio:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'physios',
        required: true,
    },
    diagnosis:{
        type: String,
        required: true,
        minlength:10,
        maxlength: 500
    },
    treatment:{
        type: String,
        required: true,
    },
    observations:{
        type: String,
        maxlength: 500
    }
});
let recordsSchema = new mongoose.Schema({
    patient:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Patients',
        required: true,
    },
    medicalRecord:{
        type: String,
        maxlength: 1000
    },
    appointments: [ConsultaSchema]
});

let record = mongoose.model('Records', recordsSchema);
module.exports = record;