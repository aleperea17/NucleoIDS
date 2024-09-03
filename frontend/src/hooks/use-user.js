import useSWR from "swr";
import axios from "axios";
import React from "react";

const getAllUsers = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

/**
 * useUsers - Hook personalizado para obtener y gestionar datos de usuarios desde la API.
 *
 * @param {Object} options - Opciones para filtrar y paginar los usuarios.
 * @param {string} [options.role="USERS"] - El rol de los usuarios a obtener. Puede ser "STUDENT", "ADMIN", o "TEACHER".
 * @returns {Object} - Un objeto que contiene los datos de los usuarios, el estado de carga, el error si existe y una función para mutar los datos.
 * @returns {Array} users - La lista de usuarios obtenidos.
 * @returns {boolean} isLoading - Indica si los datos están siendo cargados.
 * @returns {Error} error - El error ocurrido durante la obtención de datos, si lo hay.
 * @returns {Function} mutate - Función para mutar/revalidar los datos obtenidos.
 *
 * @example
 * // Ejemplo de uso
 * const { users, isLoading, error, mutate } = useUsers({ role: "ADMIN" });
 */

export default function useUsers(config) {
  const [count, setCount] = React.useState(11);
  const [page, setPage] = React.useState(1);

  console.log(import.meta.env.VITE_PUBLIC_API_URL);
  const { data, isLoading, error, mutate } = useSWR(
    `${import.meta.env.VITE_PUBLIC_API_URL}/users/?page=${page}&count=${count}&order=asc${config && config.role ? `role=${config.role}` : ""}`,
    getAllUsers,
  );

  console.log(count, page);
  const goToNextPage = () => {
    const { total } = data;

    if (page * count < total) {
      setPage((prevPage) => prevPage + 1);
      return;
    }
  };

  const goToPrevPage = () => {
    if (page < 1) {
      setPage((prevPage) => prevPage - 1);
      return;
    }
  };

  const changeCount = (val) => setCount(val);
  const helpers = {
    goToPrevPage,
    goToNextPage,
    changeCount,
  };

  return { data, isLoading, error, mutate, helpers };
}
