const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

exports.showLogin = (req, res) => {
    res.render('login.njk', { title: 'Iniciar Sesión' });
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Buscar en la colección users
        const user = await mongoose.connection.collection('users').findOne({ login: username });

        if (!user) {
            return res.render('login.njk', {
                error: 'Usuario no encontrado',
                title: 'Iniciar Sesión'
            });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.render('login.njk', {
                error: 'Contraseña incorrecta',
                title: 'Iniciar Sesión'
            });
        }

        req.session.user = {
            id: user._id,
            username: user.login,
            role: user.rol,
            name: user.login
        };

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