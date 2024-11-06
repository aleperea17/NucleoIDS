import toast from "react-hot-toast";
import { fetcher } from "./fetcher";

export const updateOneTeacher = async (data) => {
	try {
		const { dni, ...rest } = data;
		const response = await fetcher.put(`/teachers/update/${dni}`, {
			...rest,
		});

		console.log(response.data.success);
		toast.success(response.data.message);
		if (response.data.success) {
		}
	} catch (error) {
		toast.error("Algo salió mal!");

		console.log(error);
	}
};
