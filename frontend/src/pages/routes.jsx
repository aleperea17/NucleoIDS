import { createBrowserRouter } from "react-router-dom";
import LoginForm from "../components/forms/login-form";
import RegisterForm from "../components/forms/register-form";

export const router = createBrowserRouter([
	{
		path: "/login",
		Component: LoginForm,
	},
	{
		path: "/register",
		Component: RegisterForm,
	},
]);
