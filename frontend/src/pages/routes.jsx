import { createBrowserRouter, Outlet, Navigate } from "react-router-dom";
import LoginForm from "../components/forms/login-form";
import RegisterForm from "../components/forms/register-form";
import { Toaster } from "react-hot-toast";
import StudentTable from "../components/table/StudentTable";
import DashboardPage from "./dashboard/dashboard";
import TestPage from "./test-page/page";
import StudentsPage from "./dashboard/students/students-page";
import FaceCapture from "./faceCapture";
import { AuthProvider } from "../hooks/use-auth";
import { ProtectedRoute } from "../components/common/private-route";
import TeachersPage from "./dashboard/teachers/teachers-page";
import MyStudentsPage from "./dashboard/students/my-students-page";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <Navigate to="/dashboard" />,
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
		path: "/",
		element: (
			<AuthProvider>
				<ProtectedRoute>
					<Outlet />
				</ProtectedRoute>
			</AuthProvider>
		),
		children: [
			{
				path: "dashboard",
				element: <DashboardPage />,
				children: [
					{
						path: "test-page",
						element: <TestPage />,
					},
					{
						path: "teachers",
						element: (
							<ProtectedRoute allowedRoles={["ADMIN"]}>
								<TeachersPage />
							</ProtectedRoute>
						),
					},
					{
						path: "students",
						element: (
							<ProtectedRoute allowedRoles={["ADMIN", "TEACHER"]}>
								<StudentsPage />
							</ProtectedRoute>
						),
					},
					{
						path: "my-students",
						element: (
							<ProtectedRoute allowedRoles={["TEACHER"]}>
								<MyStudentsPage />
							</ProtectedRoute>
						),
					},
					{
						path: "assistance",
						element: (
							<ProtectedRoute allowedRoles={["ADMIN", "TEACHER"]}>
								<FaceCapture />
							</ProtectedRoute>
						),
					},
				],
			},
			{
				path: "facecapture",
				element: (
					<ProtectedRoute allowedRoles={["ADMIN", "TEACHER"]}>
						<FaceCapture />
					</ProtectedRoute>
				),
			},
		],
	},
	// Ruta para página no autorizada
	// {
	// 	path: "/unauthorized",
	// 	element: <UnauthorizedPage />,
	// },
	// // Ruta para página no encontrada
	// {
	// 	path: "*",
	// 	element: <NotFoundPage />,
	// },
]);
