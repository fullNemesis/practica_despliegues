require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Physio = require('../models/physio');

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        const adminExists = await Physio.findOne({ role: 'admin' });
        if (adminExists) {
            console.log('Ya existe un usuario administrador');
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const admin = new Physio({
            name: 'Admin',
            surname: 'System',
            dni: '12345678Z',
            collegiateNumber: 'ADMIN001',
            specialty: 'Administración',
            yearsOfExperience: 1,
            phone: '123456789',
            email: 'admin@physiocare.com',
            username: 'admin',
            password: hashedPassword,
            role: 'admin'
        });

        await admin.save();
        console.log('Usuario administrador creado con éxito');
        console.log('Username: admin');
        console.log('Password: admin123');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

createAdmin(); 