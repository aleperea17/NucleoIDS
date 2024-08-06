import React from "react";
import { Button, Card, Form, Input } from "react-daisyui";
import { useForm } from "react-hook-form";

export default function LoginForm() {
	const { register, handleSubmit } = useForm();

	const onFormSubmit = () => {};
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
							type="email"
							placeholder="mi.correo@gmail.com"
							className="input-bordered w-full mb-4"
						/>
						<label className="label">
							<span className="label-text">Contraseña</span>
						</label>
						<Input
							type="password"
							placeholder="********"
							className="input-bordered w-full mb-4"
						/>
						<Button color="primary" className="w-full">
							Login
						</Button>
					</Form>
					<p className="text-center text-gray-600 mt-4">
						No tienes una cuenta?{" "}
						<a href="/signup" className="text-primary">
							Crea una cuenta
						</a>
					</p>
				</Card.Body>
			</Card>
		</section>
	);
}
