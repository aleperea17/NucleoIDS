import express from 'express';
import connection from "../db/db.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const app = express();
app.use(express.json());

app.get('/usuarios', async (req, res) => {
    try {
        const [results] = await connection.query('SELECT nombre_usuario FROM Usuarios');
        res.json(results);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/login', async (req, res) => {
    const { nombre_usuario, contrasena } = req.body;
    try {
        const [results] = await connection.execute('SELECT * FROM Usuarios WHERE nombre_usuario = ?', [nombre_usuario]);
        if (results.length === 0) {
            return res.status(404).send('Usuario no encontrado');
        }

        const user = results[0];
        const passwordIsValid = bcrypt.compareSync(contrasena, user.contrasena);
        if (!passwordIsValid) {
            return res.status(401).send('Contraseña incorrecta');
        }

        const token = jwt.sign({ id: user.id }, 'clave_secreta', {
            expiresIn: 86400 // 24 horas
        });

        res.status(200).send({ auth: true, token });
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/register', async (req, res) => {
    const { nombre_usuario, contrasena } = req.body;
    try {
        const hashedPassword = bcrypt.hashSync(contrasena, 8);
        await connection.execute('INSERT INTO Usuarios (nombre_usuario, contrasena) VALUES (?, ?)', [nombre_usuario, hashedPassword]);
        res.status(201).send('Usuario registrado con éxito');
    } catch (err) {
        res.status(500).send(err);
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
