import useSWR from "swr";
import { fetcher } from "../fetcher/fetcher";

const useProfessorCourse = (professorId) => {
  const {
    data: course,
    error,
    isLoading
  } = useSWR(
    professorId ? `${import.meta.env.VITE_PUBLIC_API_URL}/courses/get-course-by-professor-id?professor_id=${professorId}` : null,
    async (url) => {
      const response = await fetcher.get(url);
      console.log(response)

      if (response.status != 200) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = response.data;

      if (!data.Taller || !data.Estudiantes) {
        throw new Error('La respuesta del servidor no tiene el formato esperado');
      }

      return data;
    }
  );

  return {
    course,
    loading: isLoading,
    error
  };
};

export default useProfessorCourse;