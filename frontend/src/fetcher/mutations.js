import toast from "react-hot-toast";
import { fetcher } from "./fetcher";

export const updateOneTeacher = async (data) => {
	try {
		const { dni, ...rest } = data;
		const response = await fetcher.put(`/teachers/update/${dni}`, {
			...rest,
		});

		console.log(response.data.success);
		if (response.data.success) {
			toast.success(response.data.message);
		}
	} catch (error) {
		toast.error("Algo salió mal!");

		console.log(error);
	}
};

export const deleteOneTeacher = async (dni) => {
	try {
		const response = await fetcher.delete(`/teachers/${dni}`);
		if (response.data.success) {
			toast.success(response.data.message);
		}
	} catch (error) {
		toast.error("No se pudo eliminar el profesor");
	}
};
