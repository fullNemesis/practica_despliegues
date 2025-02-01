require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function updateAdminPassword() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        // Generar nueva contraseña hasheada
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        // Actualizar la contraseña del admin en la colección users
        const result = await mongoose.connection.collection('users').updateOne(
            { login: "admin1" },
            { $set: { password: hashedPassword } }
        );

        if (result.modifiedCount > 0) {
            console.log('✅ Contraseña actualizada con éxito');
            console.log('Credenciales para iniciar sesión:');
            console.log('Usuario: admin1');
            console.log('Contraseña: admin123');
        } else {
            console.log('❌ No se pudo actualizar la contraseña');
            
            // Verificar si el usuario existe
            const user = await mongoose.connection.collection('users').findOne({ login: "admin1" });
            if (user) {
                console.log('El usuario existe pero no se pudo actualizar');
            } else {
                console.log('No se encontró el usuario admin1');
            }
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

updateAdminPassword(); 