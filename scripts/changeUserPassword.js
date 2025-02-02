require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

async function changeUserPassword() {
    const args = process.argv.slice(2);
    if (args.length !== 2) {
        console.log('Uso: node changeUserPassword.js <username> <newPassword>');
        process.exit(1);
    }

    const [username, newPassword] = args;

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        
        const result = await User.findOneAndUpdate(
            { login: username },
            { $set: { password: hashedPassword } },
            { new: true }
        );

        if (result) {
            console.log('Contraseña actualizada con éxito');
            console.log('Credenciales para iniciar sesión:');
            console.log(`Usuario: ${username}`);
            console.log(`Contraseña: ${newPassword}`);
        } else {
            console.log(' No se encontró el usuario');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

changeUserPassword(); 