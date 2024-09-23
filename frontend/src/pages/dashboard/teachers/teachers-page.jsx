import React from "react";
import { Badge, Button, Mask, Modal, Pagination, Select } from "react-daisyui";
import TeacherCreateForm from "./teacher-create-form";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import Heading from "../../../components/common/heading";
import Table from "../../../components/table/Table";
import useUsers from "../../../hooks/use-user";

export default function TeachersPage() {
	const { data, isLoading, error, mutate, helpers, count, page } = useUsers({
		role: "TEACHER",
	});

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
			methods.reset();
		} else {
			toast.error("Algo salió mal!", { position: "top-right" });
		}
	};

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
	const { Dialog, handleShow, handleHide } = Modal.useDialog();

	return (
		<section className="px-10 py-5">
			<Heading
				title="Lista de Profesores"
				description="Acá podrás encontrar la lista de todos los profesores"
				action={
					<div className="flex flex-row gap-3 items-center">
						<Button onClick={handleShow} color="primary">
							Añadir Profesor
						</Button>

						<Select
							value={count}
							onChange={(event) => {
								helpers.changeCount(parseInt(event.target.value));
							}}
						>
							<option value={"default"} disabled>
								Cantidad de profesores
							</option>
							<option value={1}>1</option>
							<option value={5}>5</option>
							<option value={10}>10</option>
						</Select>
					</div>
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
							<Button onClick={handleHide} type="button" color="error">
								Cancelar
							</Button>
							<Button type="submit" color="primary">
								Crear
							</Button>
						</Modal.Actions>
					</form>
				</FormProvider>
			</Dialog>
			<section className="shadow-lg rounded-lg">
				<Table data={data ? data.users : []} columns={columns} />
			</section>
		</section>
	);
}
