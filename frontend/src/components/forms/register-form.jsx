import React from "react";
import { Card, Input, Button } from "react-daisyui";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const RegisterForm = () => {
	const {
		register,
		handleSubmit,
		formState: { isSubmitting },
	} = useForm();

	const onFormSubmit = async (data) => {
		const { confirmPassword, ...rest } = data;
		const response = await fetch("http://localhost:3000/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(rest),
		});
		const response_parsed = await response.json();

		if (response_parsed.success) {
			toast.success("Cuenta creada con éxito", { position: "top-right" });
		} else {
			toast.error("Algo salió mal!", { position: "top-right" });
		}

		console.log(response_parsed);
	};

	return (
		<div className="min-h-screen bg-base-100 flex justify-center items-center">
			<Card className="w-full max-w-2xl shadow-lg rounded-lg p-8">
				<Card.Body>
					<div className="flex justify-center mb-4">
						{/* Logo */}
						<div className="flex justify-center mb-4">
							<img
								className="h-fit max-h-32 w-full object-cover"
								src="/NucleoColor.png"
								alt=""
							/>
						</div>
					</div>
					<h2 className="text-center text-2xl font-semibold">Registro</h2>
					<p className="text-center text-gray-600 mb-6">
						Ingresa la información abajo para crear una cuenta.
					</p>
					<form onSubmit={handleSubmit(onFormSubmit)}>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="form-control">
								<label className="label">
									<span className="label-text">Nombre</span>
								</label>
								<Input
									{...register("firstName")}
									type="text"
									placeholder="Nombre"
									className="input-bordered w-full"
								/>
							</div>
							<div className="form-control">
								<label className="label">
									<span className="label-text">Apellido</span>
								</label>
								<Input
									{...register("lastName")}
									type="text"
									placeholder="Apellido"
									className="input-bordered w-full"
								/>
							</div>

							<div className="form-control">
								<label className="label">
									<span className="label-text">Email</span>
								</label>
								<Input
									{...register("email")}
									type="email"
									placeholder="tu.email@gmail.com"
									className="input-bordered w-full"
								/>
							</div>
							<div className="form-control">
								<label className="label">
									<span className="label-text">Usuario</span>
								</label>
								<Input
									{...register("username")}
									type="text"
									placeholder="usuario_1"
									className="input-bordered w-full"
								/>
							</div>
							<div className="form-control">
								<label className="label">
									<span className="label-text">Contraseña</span>
								</label>
								<Input
									{...register("password")}
									type="password"
									placeholder="******"
									className="input-bordered w-full"
								/>
							</div>
							<div className="form-control">
								<label className="label">
									<span className="label-text">Confirmar Contraseña</span>
								</label>
								<Input
									{...register("confirmPassword", {
										validate: (value, formValues) =>
											value === formValues.password,
									})}
									type="password"
									placeholder="******"
									className="input-bordered w-full"
								/>
							</div>
						</div>
						<div className="mt-6 flex items-center justify-end gap-3">
							<Button className="btn-outline">Cancelar</Button>
							<Button type="submit" color="primary">
								{!isSubmitting ? (
									"Registrar"
								) : (
									<span className="loading loading-dots loading-md"></span>
								)}
							</Button>
						</div>
					</form>
					<p className="text-center text-gray-600 mt-4">
						Ya tienes una cuenta?{" "}
						<a href="/auth/login" className="text-primary">
							Iniciar sesión
						</a>
					</p>
				</Card.Body>
			</Card>
		</div>
	);
};

export default RegisterForm;
