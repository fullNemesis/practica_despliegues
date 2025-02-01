// routes/physios.js
const express = require('express');
const router = express.Router();
const Physio = require('../models/physio');
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });
const { isAuthenticated, isAdmin } = require('../middlewares/auth');

// GET /physios - Listar todos los fisioterapeutas
router.get('/', async (req, res) => {
    try {
        const physios = await Physio.find();
        res.render('physios_list.njk', { physios });
    } catch (error) {
        res.render('error.njk', { 
            error: 'Error al obtener los fisioterapeutas' 
        });
    }
});


router.get('/new', (req, res) => {
    res.render('physio_add.njk');
});


router.post('/', isAdmin, upload.single('image'), async (req, res) => {
    try {
        const physioData = req.body;
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
});

router.get('/find', isAdmin, async (req, res) => {
    try {
        const { specialty } = req.query;
        let physios = [];
        if (specialty) {
            physios = await Physio.find({ 
                specialty: { $regex: specialty, $options: 'i' } 
            });
        }
        res.render('physio_search.njk', { 
            physios,
            searchTerm: specialty 
        });
    } catch (error) {
        res.render('error.njk', { 
            error: 'Error al buscar fisioterapeutas' 
        });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const physio = await Physio.findById(req.params.id);
        if (!physio) {
            return res.render('error.njk', { 
                error: 'Fisioterapeuta no encontrado' 
            });
        }
        res.render('physio_detail.njk', { physio });
    } catch (error) {
        res.render('error.njk', { 
            error: 'Error al obtener el fisioterapeuta' 
        });
    }
});


router.get('/:id/edit', async (req, res) => {
    try {
        const physio = await Physio.findById(req.params.id);
        if (!physio) {
            return res.render('error.njk', { 
                error: 'Fisioterapeuta no encontrado' 
            });
        }
        res.render('physio_edit.njk', { physio });
    } catch (error) {
        res.render('error.njk', { 
            error: 'Error al obtener el fisioterapeuta' 
        });
    }
});


router.put('/:id', isAdmin, upload.single('image'), async (req, res) => {
    try {
        const physioData = req.body;
        if (req.file) {
            physioData.image = req.file.filename;
        }
        const physio = await Physio.findByIdAndUpdate(
            req.params.id,
            physioData,
            { new: true }
        );
        res.redirect(`/physios/${physio._id}`);
    } catch (error) {
        res.render('physio_edit.njk', {
            error: 'Error al actualizar el fisioterapeuta',
            physio: req.body
        });
    }
});


router.delete('/:id', isAdmin, async (req, res) => {
    try {
        await Physio.findByIdAndDelete(req.params.id);
        res.redirect('/physios');
    } catch (error) {
        res.render('error.njk', { error: 'Error al eliminar el fisioterapeuta' });
    }
});

module.exports = router;