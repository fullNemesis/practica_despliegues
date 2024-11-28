const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET;

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, login: user.login, rol: user.rol },
        SECRET_KEY,
        { expiresIn: '24h' }
    );
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        return null;
    }
};

const authenticateToken = (roles = []) => {
    return (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Token no proporcionado' });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ error: 'Token inválido' });
        }

     
        if (roles.length && !roles.includes(decoded.rol)) {
            return res.status(403).json({ error: 'Acceso no autorizado' });
        }

        req.user = decoded;
        next();
    };
};

const authenticatePatient = (req, res, next) => {
    const patientId = req.params.id;
    if (req.user.rol === 'patient' && req.user.id !== patientId) {
        return res.status(403).json({ error: 'Acceso no autorizado' });
    }
    next();
};

module.exports = {
    generateToken,
    verifyToken,
    authenticateToken,
    authenticatePatient
};