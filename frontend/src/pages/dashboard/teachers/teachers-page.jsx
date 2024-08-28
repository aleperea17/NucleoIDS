import React from "react";
import Table from "../../../components/table/table";
import useUsers from "../../../hooks/users/use-users";
import { Badge, Button, Mask, Modal } from "react-daisyui";
import TeacherCreateForm from "./teacher-create-form";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import Heading from "../../../components/common/heading";

export default function TeachersPage() {
	const { users, isLoading, error, mutate } = useUsers({ role: "TEACHER" });

	const methods = useForm();

	const onFormSubmit = async (data) => {
		const { confirmPassword, ...rest } = data;
		const response = await axios.post("http://localhost:8000/auth/register", {
			...rest,
			role: "TEACHER",
		});

		if (response.data.success) {
			toast.success("Profesor creado con éxito", { position: "top-right" });
			mutate();
		} else {
			toast.error("Algo salió mal!", { position: "top-right" });
		}
	};

	console.log(methods.formState);
	const roleMap = {
		TEACHER: "Profesor",
	};
	const columns = [
		{
			header: "Profesor",
			accessor: "firstName",
			render: (name, row) => (
				<div className="flex items-center space-x-3 truncate">
					<Mask
						variant="squircle"
						src="https://img.daisyui.com/images/profile/demo/2@94.webp"
					/>
					<div>
						<div className="font-bold">
							{name} {row.lastName}
						</div>
					</div>
				</div>
			),
		},
		{
			header: "Role",
			accessor: "role",
			render: (role) => (
				<div className="w-full">
					<br />
					<Badge color="ghost" size="sm">
						{roleMap[role]}
					</Badge>
				</div>
			),
		},
		{
			header: "Correo",
			accessor: "email",
			render: (email) => <div>{email}</div>,
		},
	];
	const { Dialog, handleShow } = Modal.useDialog();
	return (
		<section className="px-10 py-5">
			<Heading
				title="Lista de Profesores"
				description="Acá podrás encontrar la lista de todos los profesores"
				action={
					<Button onClick={handleShow} color="primary">
						Añadir Profesor
					</Button>
				}
			/>
			<Dialog>
				<FormProvider {...methods}>
					<form onSubmit={methods.handleSubmit(onFormSubmit)}>
						<Modal.Header className="font-bold">
							Crear un nuevo profesor
						</Modal.Header>
						<Modal.Body>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<TeacherCreateForm />
							</div>
						</Modal.Body>
						<Modal.Actions>
							<Button type="submit">Crear</Button>
						</Modal.Actions>
					</form>
				</FormProvider>
			</Dialog>
			<Table
				data={users ? users.users : []}
				columns={columns}
				loading={isLoading}
			/>
		</section>
	);
}
