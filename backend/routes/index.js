import express from "express";

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sequelize } from "../db/db.js";
import { UserModel } from "../models/user.js";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(express.json());
app.use(
	cors({
		origin: "*",
	}),
);

app.get("/usuarios", async (req, res) => {
	try {
		const users = await UserModel.findAll();
		res.status(200).json({
			message: "Usuarios obtenidos con éxito",
			success: true,
			data: users,
		});
	} catch (error) {
		res.status(500).send(err);
	}
});

app.post("/login", async (req, res) => {
	const { username, email, password } = req.body;
	try {
		if (!username && !email) throw new Error("Campos requeridos");
		const user = await UserModel.findOne({
			where: username
				? {
						username: username,
					}
				: email
					? {
							email: email,
						}
					: {},
		});

		if (!user) {
			return res
				.status(404)
				.send({ message: "Usuario no encontrado", success: false, data: null });
		}

		const passwordIsValid = bcrypt.compareSync(password, user.password);

		if (!passwordIsValid) {
			return res
				.status(401)
				.send({ message: "Contraseña incorrecta", success: false, data: null });
		}

		const token = jwt.sign({ id: user.id }, process.env.SECRET, {
			expiresIn: 86400, // 24 horas
		});

		res.status(200).send({
			message: "Usuario logeado correctamente",
			success: true,
			data: { auth: true, token },
		});
	} catch (err) {
		res.status(500).send(err);
	}
});

app.post("/register", async (req, res) => {
	const { username, firstName, lastName, email, password } = req.body;
	try {
		const hashedPassword = bcrypt.hashSync(password, 8);

		//TODO: Implementar el caso cuando el usuario con el mismo nombre esta creado
		const user = await UserModel.create({
			firstName,
			lastName,
			email,
			username: username,
			password: hashedPassword,
		});
		res.status(201).send({
			message: "Usuario registrado con éxito",
			success: true,
			data: user,
		});
	} catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
});

const PORT = 3000;
app.listen(PORT, async () => {
	console.log(`Servidor corriendo en el puerto ${PORT}`);
	try {
		await sequelize.authenticate();
		console.log("Conexión con la DB establecida con éxito");
		await sequelize.sync({ force: true });
		console.log("Sincronizado todos los modelos con éxito");
	} catch (error) {
		console.error("No se ha podido conectar con la DB", error);
	}
});
