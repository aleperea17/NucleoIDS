import React from "react";
import { Navbar } from "../../components/common/nav-bar";
import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";
import useLocalStorage from "../../hooks/useLocalStorage";

export default function DashboardPage() {
	const [token] = useLocalStorage("token", "");
	// if (!token) return <Navigate to="/auth/login" />;
	return (
		<section className="flex flex-col w-full max-w-screen h-screen">
			<Navbar />
			<Outlet />
		</section>
	);
}
