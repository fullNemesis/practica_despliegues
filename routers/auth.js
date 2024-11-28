const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { generateToken } = require('../auth/auth');
/* const bcrypt = require('bcrypt'); */


router.post('/login', async (req, res) => {
    try {
        const { login, password } = req.body;
        
        const user = await User.findOne({ login });
        if (!user) {
            return res.status(401).json({ error: 'Login incorrecto' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Login incorrecto' });
        }

        const token = generateToken(user);
        res.status(200).json({ result: token });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

module.exports = router;