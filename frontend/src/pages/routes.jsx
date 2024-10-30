import { createBrowserRouter, Outlet, Navigate } from "react-router-dom";
import LoginForm from "../components/forms/login-form";
import RegisterForm from "../components/forms/register-form";
import { Toaster } from "react-hot-toast";
import DashboardPage from "./dashboard/dashboard";
import StudentsPage from "./dashboard/students/students-page";
import FaceCapture from "./faceCapture";
import ModifyStudent from "../components/table/ModifyStudent";
import AttHistory from "../components/table/AttHistory";
import ProfessorCourse from "../components/table/ProfessorCourseDetails";
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
		path: "/professor-course",
		element: (
			<ProfessorCourse professorId={"c1043d57-6785-40df-9883-3970b2e87c5c"} />
		),
	},
	{
		path: "/modifystudent",
		element: <ModifyStudent />,

	},
	{
		path: "/atthistory",
		element: <AttHistory />,

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
						path: "mark-assistance",
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
