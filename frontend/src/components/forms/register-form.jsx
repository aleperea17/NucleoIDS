import React from "react";
import { Card, Input, Button, Select } from "react-daisyui";

const RegisterForm = () => {
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
					<h2 className="text-center text-2xl font-semibold">Sign up</h2>
					<p className="text-center text-gray-600 mb-6">
						Enter your details below to create your account and get started.
					</p>
					<form>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="form-control">
								<label className="label">
									<span className="label-text">Nombre</span>
								</label>
								<Input
									type="text"
									placeholder="enter..."
									className="input-bordered w-full"
								/>
							</div>
							<div className="form-control">
								<label className="label">
									<span className="label-text">Apellido</span>
								</label>
								<Input
									type="text"
									placeholder="enter..."
									className="input-bordered w-full"
								/>
							</div>

							<div className="form-control">
								<label className="label">
									<span className="label-text">Email</span>
								</label>
								<Input
									type="email"
									placeholder="example@gmail.com"
									className="input-bordered w-full"
								/>
							</div>
							<div className="form-control">
								<label className="label">
									<span className="label-text">Date of Birth</span>
								</label>
								<Input
									type="text"
									placeholder="MM / DD / YY"
									className="input-bordered w-full"
								/>
							</div>
							<div className="form-control">
								<label className="label">
									<span className="label-text">Contraseña</span>
								</label>
								<Input
									type="password"
									placeholder="enter..."
									className="input-bordered w-full"
								/>
							</div>
							<div className="form-control">
								<label className="label">
									<span className="label-text">Confirmar Contraseña</span>
								</label>
								<Input
									type="password"
									placeholder="enter..."
									className="input-bordered w-full"
								/>
							</div>
						</div>
						<div className="mt-6 flex items-center justify-end gap-3">
							<Button className="btn-outline">Cancelar</Button>
							<Button type="submit" color="primary">
								Confirmar
							</Button>
						</div>
					</form>
					<p className="text-center text-gray-600 mt-4">
						Ya tienes una cuenta?{" "}
						<a href="/login" className="text-primary">
							Iniciar sesión
						</a>
					</p>
				</Card.Body>
			</Card>
		</div>
	);
};

export default RegisterForm;
