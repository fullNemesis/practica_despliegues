exports.isAuthenticated = (req, res, next) => {
    console.log('Verificando autenticación:', {
        sessionExists: !!req.session,
        userExists: !!req.session?.user,
        user: req.session?.user
    });

    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

exports.isAdmin = (req, res, next) => {
    console.log('Verificando rol admin:', {
        role: req.session?.user?.role
    });

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
    console.log('Verificando rol physio:', {
        role: req.session?.user?.role
    });

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
    console.log('Verificando propiedad de paciente:', {
        userRole: req.session?.user?.role,
        patientId: req.session?.user?.patientId,
        requestedId: req.params.id
    });

    if (!req.session.user) {
        return res.redirect('/login');
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