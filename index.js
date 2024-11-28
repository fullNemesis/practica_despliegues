const express = require('express');
const mongoose = require('mongoose');
const PORT = process.env.PORT;
let app = express();
mongoose.connect('mongodb://localhost/physiocare', {
    /* useNewUrlParser: true,
    useUnifiedTopology: true */
});

const patientsRouter = require('./routers/patients');
const physiosRouter = require('./routers/physios');
const recordsRouter = require('./routers/records');
const authRoutes = require('./routes/auth');

app.use(express.json());
app.use('/patients', patientsRouter);
app.use('/physios', physiosRouter);
app.use('/records', recordsRouter);
app.use('/auth', authRoutes);

app.listen(PORT);