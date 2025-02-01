require('dotenv').config();
const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const multer = require('multer');
const methodOverride = require('method-override');
const session = require('./middlewares/session');
const mongoose = require('mongoose');

const app = express();

// Configuración de Multer para subida de imágenes
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Solo se permiten archivos de imagen!'), false);
        }
        cb(null, true);
    }
});

// Configuración de Nunjucks
const env = nunjucks.configure('views', {
    autoescape: true,
    express: app
});

// Añadir filtro de fecha personalizado
env.addFilter('date', function(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
});

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method')); // Para PUT y DELETE en formularios
app.use(session);

// Middleware para archivos estáticos
app.use(express.static('public')); // Sirve index.html y otros archivos estáticos
app.use('/uploads', express.static('public/uploads')); // Para imágenes subidas
app.use('/images', express.static('public/images')); // Para imágenes estáticas
app.use('/css', express.static('public/css')); // Para archivos CSS propios
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist'))); // Bootstrap desde node_modules

// Middleware para hacer el usuario disponible en todas las vistas
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

// Importar rutas
const authRouter = require('./routes/auth');
const patientsRouter = require('./routers/patients');
const physiosRouter = require('./routers/physios');
const recordsRouter = require('./routers/records');

// Rutas públicas
app.use('/auth', authRouter);

// Rutas protegidas con middleware de autenticación y roles
const { isAuthenticated, isAdmin, isPhysio } = require('./middlewares/auth');

// Rutas de pacientes - acceso para physios y admin
app.use('/patients', isAuthenticated, patientsRouter);

// Rutas de fisios - solo acceso admin
app.use('/physios', isAuthenticated, isAdmin, physiosRouter);

// Rutas de expedientes - acceso según rol
app.use('/records', isAuthenticated, recordsRouter);

// Ruta raíz - redirección a index.html
app.get('/', (req, res) => {
    res.redirect('/index.html');
});

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('🗄️ Conectado a MongoDB'))
    .catch(err => console.error('Error conectando a MongoDB:', err));

// Puerto de escucha
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
}); 