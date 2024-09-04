import { createBrowserRouter, Outlet } from "react-router-dom";
import LoginForm from "../components/forms/login-form";
import RegisterForm from "../components/forms/register-form";
import { Toaster } from "react-hot-toast";
import TeachersTable from "../components/table/TeachersTable";
import StudentTable from "../components/table/StudentTable";
import DashboardPage from "./dashboard/dashboard";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <span>Has iniciado sesión</span>,
	},
	{
		path:"/teacherstable",
		element: (
			<TeachersTable/>
		)

	},
	{
		path:"/studenttable",
		element: (
			<StudentTable/>
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
