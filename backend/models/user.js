import { DataTypes } from "sequelize";
import { sequelize } from "../db/db.js";

export const UserModel = sequelize.define("User", {
	id: {
		type: DataTypes.UUID(),
		defaultValue: DataTypes.UUIDV4(),
		unique: true,
		primaryKey: true,
	},
	username: {
		type: DataTypes.STRING(),
		unique: true,
		allowNull: false,
	},
	password: {
		type: DataTypes.STRING(),
		allowNull: false,
	},
	firstName: {
		type: DataTypes.STRING(),
		allowNull: false,
	},
	lastName: {
		type: DataTypes.STRING(),
		allowNull: false,
	},
	role: {
		type: DataTypes.ENUM,
		values: ["ADMIN", "STUDENT", "TEACHER"],
		defaultValue: "STUDENT",
	},
});
