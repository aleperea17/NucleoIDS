import { Input, Form, Button } from "react-daisyui";
import { useForm, useFormContext } from "react-hook-form";
import Autocomplete from "../../common/autocomplete";
import useSWR from "swr";
import { fetcher } from "../../../fetcher/fetcher";
import { useMemo, useState } from "react";

const getCoursesFetcher = async (url) => {
	try {
		const response = await fetcher.get("/courses/courses");
		const list_of_courses = response.data.courses.map((course) => ({
			label: course.course_name,
			value: course.id,
		}));
		return list_of_courses;
	} catch (error) {
		throw error;
	}
};

const TeacherForm = ({ onSubmit, defaultValues }) => {
	const { data: courses } = useSWR("/courses", getCoursesFetcher);

	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		watch,
		control,
		formState: { errors, defaultValues: stateDefaultValues },
	} = useForm({
		defaultValues,
	});

	const state = watch();

	const handleFormSubmit = async (data) => {
		setIsLoading(true);
		await onSubmit(data);
		setIsLoading(false);
	};

	const value = useMemo(() => {
		return courses
			? courses.find((c) => c.value === state.courseId)
			: undefined;
	}, [courses, state]);
	return (
		<Form
			onSubmit={handleSubmit(handleFormSubmit)}
			className="grid grid-cols-2 gap-4"
		>
			<Input
				type="text"
				placeholder="Nombre"
				{...register("firstName", { required: true })}
				className="w-full"
			/>
			<Input
				type="text"
				placeholder="Apellido"
				{...register("lastName", { required: true })}
				className="w-full"
			/>
			<Input
				type="text"
				placeholder="DNI"
				{...register("dni", { required: true })}
				readOnly={stateDefaultValues && stateDefaultValues.dni}
				disabled={stateDefaultValues && stateDefaultValues.dni}
				className="w-full col-span-2"
			/>
			<Input
				type="email"
				placeholder="Correo Electrónico"
				{...register("email", { required: true })}
				className="w-full"
			/>
			<Input
				type="text"
				placeholder="Teléfono"
				{...register("phone", { required: true })}
				className="w-full"
			/>
			<Input
				type="text"
				placeholder="Dirección"
				{...register("address", { required: true })}
				className="col-span-2 w-full"
			/>
			<div className="col-span-2">
				<Input
					type="date"
					placeholder="Fecha de Contratación"
					{...register("hire_date", {
						required: true,
						validate: (value) => {
							const selectedDate = new Date(value);
							const today = new Date();
							today.setHours(0, 0, 0, 0); // Se asegura de que solo se compare la fecha y no la hora
							return selectedDate <= today || "La fecha no puede ser futura";
						},
					})}
					className="w-full"
				/>
				{errors.hire_date && (
					<p className="text-red-500 text-sm mt-1">
						{errors.hire_date.message}
					</p>
				)}
			</div>
			<Autocomplete
				value={
					value
					// courses ? courses.find((c) => c.value === state.courseId) : undefined
				}
				className="col-span-2"
				placeholder="Buscar talleres..."
				control={control}
				options={courses ? courses.filter((c) => !c.teacher) : []}
				name="courseId"
			/>
			<div className="flex justify-end col-end-3">
				<button type="submit" className="btn btn-primary" disabled={isLoading}>
					{!isLoading ? (
						"Guardar"
					) : (
						<span className="loading loading-dots loading-md"></span>
					)}
				</button>
			</div>
		</Form>
	);
};

export default TeacherForm;
