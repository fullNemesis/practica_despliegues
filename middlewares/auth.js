exports.isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/auth/login');
    }
};

exports.isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        res.render('error.njk', { 
            error: 'Acceso no autorizado. Se requieren permisos de administrador.',
            title: 'Error de Acceso'
        });
    }
};

exports.isPhysio = (req, res, next) => {
    if (req.session.user && (req.session.user.role === 'physio' || req.session.user.role === 'admin')) {
        next();
    } else {
        res.render('error.njk', { 
            error: 'Acceso no autorizado. Se requieren permisos de fisioterapeuta.',
            title: 'Error de Acceso'
        });
    }
};

exports.isPatientOwner = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }

    if (req.session.user.role === 'admin' || req.session.user.role === 'physio') {
        return next();
    }

    if (req.session.user.role === 'patient' && req.params.id === req.session.user.patientId) {
        return next();
    }

    res.render('error.njk', { 
        error: 'No tienes permiso para acceder a este recurso.',
        title: 'Error de Acceso'
    });
}; 