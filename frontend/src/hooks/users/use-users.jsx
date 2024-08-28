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

export default function useUsers({ role = "USERS" }) {
  const [count, setCount] = React.useState(11);
  const [page, setPage] = React.useState(1);

  const {
    data: users,
    isLoading,
    error,
    mutate,
  } = useSWR(
    `${import.meta.env.VITE_PUBLIC_API_URL}/users/?page=${page}&count=${count}&order=asc&role=${role}`,
    getAllUsers,
  );

  console.log(isLoading, users);

  return { users, isLoading, error, mutate };
}
