const session = require('express-session');

module.exports = session({
    secret: 'clave_secreta_temporal',
    resave: true,
    saveUninitialized: true,
    cookie: { 
        maxAge: 24 * 60 * 60 * 1000 
    }
}); 