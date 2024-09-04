import React from "react";
import { Button, Card, Form, Input } from "react-daisyui";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useLocalStorage from "../../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
	const [_, setToken] = useLocalStorage("token", "");

	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { isSubmitting },
	} = useForm();

	const onFormSubmit = async (data) => {
		const response = await fetch("http://localhost:3000/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		const response_parsed = await response.json();

		if (response_parsed.success) {
			toast.success("Sesión iniciada con éxito", { position: "top-right" });
			setToken(response_parsed.data.token);
			navigate("/dashboard");
		} else {
			toast.error("Algo salió mal!");
		}
	};

	return (
		<section className="min-h-screen bg-base-100 flex justify-center items-center">
			<Card className="w-full max-w-lg shadow-xl rounded-lg p-8">
				<Card.Body>
					<div className="flex justify-center mb-4">
						<img
							className="h-fit w-full object-cover"
							src="/NucleoColor.png"
							alt=""
						/>
					</div>
					<h2 className="text-center text-3xl font-semibold">
						Bienvenido de nuevo
					</h2>
					<p className="text-center text-gray-600 mb-6">
						Es lindo verte de nuevo 👋 inicia sesión abajo
					</p>
					<Form onSubmit={handleSubmit(onFormSubmit)} className="form-control">
						<Button
							color="outline"
							className="w-full mb-4 flex justify-center items-center"
						>
							<img
								src="/google.webp"
								alt="Google logo"
								className="w-5 h-5 mr-2"
							/>
							Continuar con Google
						</Button>
						<label className="label">
							<span className="label-text">Correo electrónico</span>
						</label>
						<Input
							{...register("email")}
							type="email"
							placeholder="mi.correo@gmail.com"
							className="input-bordered w-full mb-4"
						/>
						<label className="label">
							<span className="label-text">Contraseña</span>
						</label>
						<Input
							{...register("password")}
							type="password"
							placeholder="********"
							className="input-bordered w-full mb-4"
						/>
						<Button disabled={isSubmitting} color="primary" className="w-full">
							{!isSubmitting ? (
								"Login"
							) : (
								<span className="loading loading-dots loading-md"></span>
							)}
						</Button>
					</Form>
					<p className="text-center text-gray-600 mt-4">
						No tienes una cuenta?{" "}
						<a href="register" className="text-primary">
							Crea una cuenta
						</a>
					</p>
				</Card.Body>
			</Card>
		</section>
	);
}
