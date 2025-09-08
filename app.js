import express from 'express';
import router from './routes.js';

const app = express();
app.use(express.json());

app.use('/api/auth', router);

app.get('/', (req, res) => {
    res.json({ message: 'Funciona' });
});

app.listen(3000, () => {
    console.log("Escuchando en el puerto 3000");
});