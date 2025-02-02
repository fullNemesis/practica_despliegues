const express = require('express');
const router = express.Router();
const Physio = require('../models/physio');
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });
const { isAuthenticated, isAdmin } = require('../middlewares/auth');


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

router.get('/new', isAdmin, (req, res) => {
    res.render('physio_add.njk', { title: 'Nuevo Fisioterapeuta' });
});

router.post('/', isAdmin, upload.single('image'), async (req, res) => {
    try {
        const physioData = {
            name: req.body.name,
            surname: req.body.surname,
            dni: req.body.dni,
            collegiateNumber: req.body.collegiateNumber,
            specialty: req.body.specialty,
            yearsOfExperience: parseInt(req.body.yearsOfExperience),
            phone: req.body.phone,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            role: 'physio'
        };

        if (req.file) {
            physioData.image = req.file.filename;
        }

        const physio = new Physio(physioData);
        await physio.save();
        res.redirect('/physios');
    } catch (error) {
        res.render('physio_add.njk', {
            error: error.message,
            physio: req.body,
            title: 'Nuevo Fisioterapeuta'
        });
    }
});

router.get('/find', async (req, res) => {
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
            searchTerm: specialty,
            title: 'Buscar Fisioterapeutas' 
        });
    } catch (error) {
        res.render('error.njk', { 
            error: 'Error al buscar fisioterapeutas',
            title: 'Error' 
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const physio = await Physio.findById(req.params.id);
        if (!physio) {
            return res.render('error.njk', { 
                error: 'Fisioterapeuta no encontrado',
                title: 'Error'
            });
        }
        res.render('physio_detail.njk', { 
            physio,
            title: 'Detalle de Fisioterapeuta' 
        });
    } catch (error) {
        res.render('error.njk', { 
            error: 'Error al obtener el fisioterapeuta',
            title: 'Error'
        });
    }
});

router.get('/:id/edit', isAdmin, async (req, res) => {
    try {
        const physio = await Physio.findById(req.params.id);
        if (!physio) {
            return res.render('error.njk', { 
                error: 'Fisioterapeuta no encontrado',
                title: 'Error'
            });
        }
        res.render('physio_edit.njk', { 
            physio,
            title: 'Editar Fisioterapeuta'
        });
    } catch (error) {
        res.render('error.njk', { 
            error: 'Error al obtener el fisioterapeuta',
            title: 'Error'
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
            { new: true, runValidators: true }
        );
        res.redirect(`/physios/${physio._id}`);
    } catch (error) {
        res.render('physio_edit.njk', {
            error: error.message,
            physio: req.body,
            title: 'Editar Fisioterapeuta'
        });
    }
});

router.delete('/:id', isAdmin, async (req, res) => {
    try {
        await Physio.findByIdAndDelete(req.params.id);
        res.redirect('/physios');
    } catch (error) {
        res.render('error.njk', { 
            error: 'Error al eliminar el fisioterapeuta',
            title: 'Error'
        });
    }
});

module.exports = router;