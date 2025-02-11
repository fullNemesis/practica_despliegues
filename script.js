const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Patient = require('./models/patient');
const Physio = require('./models/physio');
const Record = require('./models/record');

async function loadData() {
    try {
        const salt = await bcrypt.genSalt(10);

        // Clean existing collections
        await Patient.deleteMany({});
        await Physio.deleteMany({});
        await Record.deleteMany({}); 
        
        // Create some patients  
        const patients = [
            new Patient({
                name: 'José',
                surname: 'López',
                birthDate: new Date('1985-06-15'),
                address: 'Calle Mayor 123, Alicante',
                username: 'jose',
                password: await bcrypt.hash('patient123', salt),
                dni: '11111111A',
                phone: '611222333',
                email: 'jose@email.com'
            }),
            new Patient({
                name: 'Ana',
                surname: 'Pérez',
                birthDate: new Date('1990-09-22'),
                address: 'Avenida del Sol 45, Valencia',
                username: 'ana',
                password: await bcrypt.hash('patient123', salt),
                dni: '22222222B',
                phone: '622333444',
                email: 'ana@email.com'
            }),
            new Patient({
                name: 'Luis',
                surname: 'Martínez',
                birthDate: new Date('1975-03-11'),
                address: 'Calle de la Luna 89, Alicante',
                username: 'luis',
                password: await bcrypt.hash('patient123', salt),
                dni: '33333333C',
                phone: '633444555',
                email: 'luis@email.com'
            }),
            new Patient({
                name: 'María',
                surname: 'Sanz',
                birthDate: new Date('1992-05-30'),
                address: 'Plaza Mayor 22, Valencia',
                username: 'maria',
                password: await bcrypt.hash('patient123', salt),
                dni: '44444444D',
                phone: '644555666',
                email: 'maria@email.com'
            })
        ];
    
        // Save all patients 
        const savedPatients = await Promise.all(patients.map(patient => patient.save()));
        console.log('Added patients:', savedPatients);
        
        const physios = [
            new Physio({
                name: 'Javier',
                surname: 'Martínez',
                specialty: 'Sports',
                collegiateNumber: 'A1234567',
                username: 'javier',
                password: await bcrypt.hash('physio123', salt),
                dni: '55555555E',
                phone: '655666777',
                email: 'javier@physiocare.com',
                role: 'physio',
                yearsOfExperience: 5
            }),
            new Physio({
                name: 'Ainhoa',
                surname: 'Fernández',
                specialty: 'Neurological',
                collegiateNumber: 'B7654321',
                username: 'ainhoa',
                password: await bcrypt.hash('physio123', salt),
                dni: '66666666F',
                phone: '666777888',
                email: 'ainhoa@physiocare.com',
                role: 'physio',
                yearsOfExperience: 8
            }),
            new Physio({
                name: 'Mario',
                surname: 'Sánchez',
                specialty: 'Pediatric',
                collegiateNumber: 'C9876543',
                username: 'mario',
                password: await bcrypt.hash('physio123', salt),
                dni: '77777777G',
                phone: '677888999',
                email: 'mario@physiocare.com',
                role: 'physio',
                yearsOfExperience: 6
            }),
            new Physio({
                name: 'Andrea',
                surname: 'Ortega',
                specialty: 'Pediatric',
                collegiateNumber: 'D8796342',
                username: 'andrea',
                password: await bcrypt.hash('physio123', salt),
                dni: '88888888H',
                phone: '688999000',
                email: 'andrea@physiocare.com',
                role: 'physio',
                yearsOfExperience: 4
            }),
            new Physio({
                name: 'Ana',
                surname: 'Rodríguez',
                specialty: 'Geriatric',
                collegiateNumber: 'E6543210',
                username: 'ana.rodriguez',
                password: await bcrypt.hash('physio123', salt),
                dni: '99999999I',
                phone: '699000111',
                email: 'ana.rodriguez@physiocare.com',
                role: 'physio',
                yearsOfExperience: 10
            }),
            new Physio({
                name: 'Marcos',
                surname: 'Gómez',
                specialty: 'Oncological',
                collegiateNumber: 'F4321098',
                username: 'marcos',
                password: await bcrypt.hash('physio123', salt),
                dni: '00000000J',
                phone: '600111222',
                email: 'marcos@physiocare.com',
                role: 'physio',
                yearsOfExperience: 7
            })
        ];
    
        // Save all physios 
        const savedPhysios = await Promise.all(physios.map(physio => physio.save()));
        console.log('Added physios:', savedPhysios);
    
       
        const records = [
            new Record({
                patient: savedPatients[0]._id,
                medicalRecord: 'Paciente con antecedentes de lesiones en rodilla y cadera.',
                diagnosis: 'Distensión de ligamentos de la rodilla',
                appointments: [
                    {
                        date: new Date('2024-02-10'),
                        physio: savedPhysios[0]._id,
                        diagnosis: 'Distensión de ligamentos de la rodilla',
                        treatment: 'Rehabilitación con ejercicios de fortalecimiento',
                        observations: 'Se recomienda evitar actividad intensa por 6 semanas'
                    },
                    {
                        date: new Date('2024-03-01'),
                        physio: savedPhysios[0]._id,
                        diagnosis: 'Mejoría notable, sin dolor agudo',
                        treatment: 'Continuar con ejercicios, añadir movilidad funcional',
                        observations: 'Próxima revisión en un mes'
                    }
                ]
            }),
            new Record({
                patient: savedPatients[1]._id,
                medicalRecord: 'Paciente con problemas neuromusculares.',
                diagnosis: 'Debilidad muscular en miembros inferiores',
                appointments: [
                    {
                        date: new Date('2024-02-15'),
                        physio: savedPhysios[1]._id,
                        diagnosis: 'Debilidad muscular en miembros inferiores',
                        treatment: 'Terapia neuromuscular y estiramientos',
                        observations: 'Revisar la evolución en 3 semanas'
                    }
                ]
            }),
            new Record({
                patient: savedPatients[2]._id,
                medicalRecord: 'Lesión de hombro recurrente, movilidad limitada.',
                diagnosis: 'Tendinitis en el manguito rotador',
                appointments: [
                    {
                        date: new Date('2024-01-25'),
                        physio: savedPhysios[2]._id,
                        diagnosis: 'Tendinitis en el manguito rotador',
                        treatment: 'Ejercicios de movilidad y fortalecimiento',
                        observations: 'Revisar en 4 semanas'
                    }
                ]
            }),
            new Record({
                patient: savedPatients[3]._id,
                medicalRecord: 'Paciente con problemas oncológicos.',
                diagnosis: 'Fatiga post-tratamiento oncológico',
                appointments: [
                    {
                        date: new Date('2024-01-15'),
                        physio: savedPhysios[4]._id,
                        diagnosis: 'Fatiga post-tratamiento oncológico',
                        treatment: 'Ejercicios suaves y terapia de relajación',
                        observations: 'Revisión en 2 semanas'
                    }
                ]
            })
        ];
    
        const savedRecords = await Promise.all(records.map(record => record.save()));
        console.log('Added records:', savedRecords);
    
        console.log('\nCredenciales de acceso:');
        console.log('\nFisioterapeutas (contraseña: physio123):');
        physios.forEach(p => console.log(`- Usuario: ${p.username}`));
        console.log('\nPacientes (contraseña: patient123):');
        patients.forEach(p => console.log(`- Usuario: ${p.username}`));
    
        mongoose.disconnect();
        console.log('Data successfully loaded and disconnected from MongoDB');
        } catch (error) {
            console.error('Error loading data:', error);
            mongoose.disconnect();
        }
}

// Connect to MongoDB database
mongoose.connect('mongodb://mymongodb:27017/physiocare')
    .then(() => {
        console.log('Successful connection to MongoDB');
        loadData();
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });


