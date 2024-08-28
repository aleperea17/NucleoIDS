import { createBrowserRouter, Outlet } from "react-router-dom";
import LoginForm from "../components/forms/login-form";
import RegisterForm from "../components/forms/register-form";
import { Toaster } from "react-hot-toast";
import DashboardPage from "./dashboard/dashboard";
import TeachersPage from "./dashboard/teachers/teachers-page";
import { SWRConfig } from "swr";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <span>Has iniciado sesión</span>,
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
	{
		path: "/dashboard",
		element: <DashboardPage />,
		children: [
			{
				path: "teachers",
				element: <TeachersPage />,
			},
		],
	},
]);
