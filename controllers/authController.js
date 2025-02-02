const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.showLogin = (req, res) => {
    res.render('login.njk', { title: 'Iniciar Sesión' });
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Buscar usuario
        const user = await User.findOne({ login: username });
        if (!user) {
            return res.render('login.njk', {
                error: 'Usuario no encontrado',
                title: 'Iniciar Sesión'
            });
        }

        // Verificar contraseña
        const isValid = await user.comparePassword(password);
        if (!isValid) {
            return res.render('login.njk', {
                error: 'Contraseña incorrecta',
                title: 'Iniciar Sesión'
            });
        }

        // Crear sesión
        req.session.user = {
            id: user._id,
            username: user.login,
            role: user.rol,
            name: user.login,
            patientId: user.patientId
        };

        // Redirigir según rol
        if (user.rol === 'admin') {
            res.redirect('/physios');
        } else if (user.rol === 'physio') {
            res.redirect('/patients');
        } else {
            res.redirect('/records');
        }

    } catch (error) {
        console.error('Error en login:', error);
        res.render('login.njk', {
            error: 'Error al iniciar sesión',
            title: 'Iniciar Sesión'
        });
    }
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
}; 