require('dotenv').config();
const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const methodOverride = require('method-override');
const session = require('./middlewares/session');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Patient = require('./models/patient');
const Physio = require('./models/physio');
const User = require('./models/user');

const app = express();
const PORT = process.env.PORT || 3001;

// Configuración de Nunjucks
const env = nunjucks.configure('views', {
    autoescape: true,
    express: app
});

// Agregar filtro de fecha
env.addFilter('date', function(date) {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
});

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method')); // Para PUT y DELETE en formularios
app.use(session);

// Middleware para hacer el usuario disponible en todas las vistas
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

// Middleware para archivos estáticos específicos
app.use('/uploads', express.static('public/uploads'));
app.use('/images', express.static('public/images'));
app.use('/css', express.static('public/css'));
app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));

// Rutas de autenticación
app.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    res.render('login.njk', { title: 'Iniciar Sesión' });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const patient = await Patient.findOne({ username });

        if (!patient) {
            const physio = await Physio.findOne({ username });
            if (!physio) {
                return res.render('login.njk', {
                    error: 'Usuario o contraseña incorrectos',
                    title: 'Iniciar Sesión'
                });
            }

            if (physio.role === 'admin') {
                const isMatch = await bcrypt.compare(password, physio.password);
                if (!isMatch) {
                    return res.render('login.njk', {
                        error: 'Usuario o contraseña incorrectos',
                        title: 'Iniciar Sesión'
                    });
                }
            } else {
                if (password !== physio.password) {
                    return res.render('login.njk', {
                        error: 'Usuario o contraseña incorrectos',
                        title: 'Iniciar Sesión'
                    });
                }
            }

            req.session.user = {
                id: physio._id.toString(),
                username: physio.username,
                role: physio.role,
                name: physio.name
            };

            if (physio.role === 'admin') {
                res.redirect('/physios');
            } else {
                res.redirect('/patients');
            }
            return;
        }

        if (password !== patient.password) {
            return res.render('login.njk', {
                error: 'Usuario o contraseña incorrectos',
                title: 'Iniciar Sesión'
            });
        }

        req.session.user = {
            id: patient._id.toString(),
            username: patient.username,
            role: 'patient',
            name: patient.name,
            patientId: patient._id.toString()
        };

        res.redirect('/records');

    } catch (error) {
        res.render('login.njk', {
            error: 'Error en el servidor',
            title: 'Iniciar Sesión'
        });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        res.redirect('/login');
    });
});

// Ruta de prueba para crear un admin (ELIMINAR EN PRODUCCIÓN)
app.get('/setup', async (req, res) => {
    try {
        const adminExists = await Physio.findOne({ username: 'admin' });
        if (adminExists) {
            return res.send('Admin ya existe');
        }

        const hashedPassword = await bcrypt.hash('admin', 10);
        const admin = new Physio({
            name: 'Admin',
            surname: 'System',
            dni: '12345678A',
            collegiateNumber: 'ADMIN001',
            specialty: 'Administración',
            yearsOfExperience: 5,
            phone: '123456789',
            email: 'admin@example.com',
            username: 'admin',
            password: hashedPassword,
            role: 'admin'
        });

        await admin.save();
        res.send('Admin creado correctamente. Usuario: admin, Contraseña: admin');
    } catch (error) {
        res.status(500).send('Error creando admin');
    }
});

// Ruta de prueba para verificar admin (ELIMINAR EN PRODUCCIÓN)
app.get('/test-admin', async (req, res) => {
    try {
        const admin = await Physio.findOne({ username: 'admin' });
        if (!admin) {
            return res.send('No existe el usuario admin');
        }
        
        const hashedPassword = await bcrypt.hash('admin', 10);
        admin.password = hashedPassword;
        await admin.save();
        
        res.send({
            message: 'Contraseña de admin actualizada',
            adminInfo: {
                username: admin.username,
                role: admin.role,
                _id: admin._id
            }
        });
    } catch (error) {
        res.status(500).send('Error al verificar admin');
    }
});

// Importar rutas
const patientsRouter = require('./routers/patients');
const physiosRouter = require('./routers/physios');
const recordsRouter = require('./routers/records');

// Rutas protegidas con middleware de autenticación y roles
const { isAuthenticated, isAdmin, isPhysio } = require('./middlewares/auth');

// Rutas de pacientes - acceso para physios y admin
app.use('/patients', isAuthenticated, patientsRouter);

// Rutas de fisios - solo acceso admin
app.use('/physios', isAuthenticated, isAdmin, physiosRouter);

// Rutas de expedientes - acceso según rol
app.use('/records', isAuthenticated, recordsRouter);

// Ruta raíz - debe ir antes de express.static
app.get('/', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('dashboard.njk', {
        title: 'Dashboard',
        user: req.session.user
    });
});

// Servir archivos estáticos generales después de las rutas dinámicas
app.use(express.static('public'));

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor iniciado en puerto ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error conectando a MongoDB:', err);
    }); 