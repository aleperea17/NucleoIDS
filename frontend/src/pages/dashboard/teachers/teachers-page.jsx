import React, { useState } from "react";
import {
	Badge,
	Button,
	Mask,
	Modal,
	Pagination,
	Select,
	Tooltip,
} from "react-daisyui";
import TeacherCreateForm from "./teacher-create-form";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import Heading from "../../../components/common/heading";
import Table from "../../../components/table/Table";
import useUsers from "../../../hooks/use-user";
import { MapPinIcon, PencilIcon, PhoneIcon, TrashIcon, X } from "lucide-react";
import EditTeacherModal from "../../../components/teachers/edit-teacher-modal";
import { render } from "react-dom";
import { deleteOneTeacher, updateOneTeacher } from "../../../fetcher/mutations";

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
		// {
		// 	header: "Rol",
		// 	accessor: "role",
		// 	render: (role) => (
		// 		<div className="w-full">
		// 			<br />
		// 			<Badge color="ghost" size="sm">
		// 				{roleMap[role]}
		// 			</Badge>
		// 		</div>
		// 	),
		// },
		{
			header: "Correo",
			accessor: "email",
			render: (email) => <a>{email}</a>,
		},
		{
			header: "Teléfono",
			render: (_, row) => (
				<Tooltip message="Abrir en WhatsApp Web">
					<a
						href={`https://api.whatsapp.com/send?phone=549${row.teacher.phone}`}
					>
						<div className="flex gap-3 items-center">
							<PhoneIcon />
							{row.teacher.phone}
						</div>
					</a>
				</Tooltip>
			),
		},
		{
			header: "Dirección",
			render: (_, row) => {
				return (
					<div className="flex items-center gap-3">
						<MapPinIcon />
						{row.teacher.address}
					</div>
				);
			},
		},
		{
			header: "Acciones",
			accessor: "",
			render: (_, row) => {
				const [isOpen, setIsOpen] = useState(false);
				const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
				const { email, firstName, lastName, ...rest } = row;
				const handleSubmit = async (data) => {
					await updateOneTeacher(data);
				};
				console.log(rest);
				return (
					<div className="flex items-center gap-2">
						<Tooltip message="Editar">
							<Button
								color="accent"
								size="sm"
								onClick={() => setIsOpen(!isOpen)}
							>
								<PencilIcon className="w-5 h-5" />
							</Button>
						</Tooltip>
						<EditTeacherModal
							defaultValues={{
								firstName,
								lastName,
								email,
								dni: row.teacher.dni,
								phone: row.teacher.phone,
								hire_date: row.teacher.hire_date,
								address: row.teacher.address,
								courseId: row.teacher.course ?? null,
							}}
							isOpen={isOpen}
							onClose={() => setIsOpen(false)}
							onSubmit={handleSubmit}
						/>
						<>
							<Tooltip message="Eliminar">
								<Button
									onClick={() => setIsConfirmModalOpen(true)}
									color="error"
									type="button"
									size="sm"
								>
									<TrashIcon className="w-5 h-5" />
								</Button>
							</Tooltip>
							<Modal open={isConfirmModalOpen}>
								<Modal.Header className="font-bold text-lg relative text-balance">
									¿Estás seguro de eliminar a este profesor?
									<Button
										type="button"
										className="btn-circle absolute right-0"
										size="sm"
										onClick={() => setIsConfirmModalOpen(false)}
									>
										<X className="w-4 h-4" />
									</Button>
								</Modal.Header>
								<Modal.Body className="text-base">
									¿Estas seguro de <strong>eliminar</strong> a {firstName}{" "}
									{lastName}?. <br />
									Despues de esta acción el profesor{" "}
									<strong>
										{firstName} {lastName}
									</strong>{" "}
									<strong>no tendrá acceso a la plataforma.</strong>
								</Modal.Body>
								<Modal.Actions>
									<Button
										type="button"
										onClick={() => setIsConfirmModalOpen(false)}
									>
										Cancelar
									</Button>
									<Button
										type="button"
										color="error"
										onClick={() => deleteOneTeacher(row.teacher.dni)}
									>
										Confirmar
									</Button>
								</Modal.Actions>
							</Modal>
						</>
					</div>
				);
			},
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
