const bcrypt = require('bcryptjs');
const Physio = require('../models/physio');

exports.createPhysio = async (req, res) => {
    try {
        const physioData = req.body;
        
        const salt = await bcrypt.genSalt(10);
        physioData.password = await bcrypt.hash(physioData.password, salt);
        
        if (req.file) {
            physioData.image = req.file.filename;
        }

        const physio = new Physio(physioData);
        await physio.save();
        res.redirect('/physios');
    } catch (error) {
        res.render('physio_add.njk', {
            error: 'Error al crear el fisioterapeuta',
            physio: req.body
        });
    }
}; 