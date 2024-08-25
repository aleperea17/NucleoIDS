import { createBrowserRouter, Outlet } from "react-router-dom";
import LoginForm from "../components/forms/login-form";
import RegisterForm from "../components/forms/register-form";
import { Toaster } from "react-hot-toast";
import Table from "../components/table/Table";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <span>Has iniciado sesión</span>,
	},
	{
		path:"/table",
		element: (
			<Table/>
		)

	},
	{
		path: "/auth",
		element: (
			<>
				<Toaster />
				<Outlet />
			</>
		),
		children: [
			{
				path: "login",
				element: <LoginForm />,
			},
			{
				path: "register",
				element: <RegisterForm />,
			},
		],
	},
]);
