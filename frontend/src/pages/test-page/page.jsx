import React from "react";
import useUsers from "../../hooks/use-user";

export default function TestPage() {
  const { data, helpers } = useUsers({});
  console.log(data);
  if (!data) return "Cargando...";
  return (
    <ul className="grid grid-cols-4">
      <li className="col-span-4">
        <button className="bg-red-500 px-10" onClick={helpers.goToPrevPage}>
          Ir hacía página de atrás
        </button>
        <button className="bg-red-500 px-10" onClick={helpers.goToNextPage}>
          Ir hacía página de adelante
        </button>
      </li>
      <li className="col-span-4">
        <button
          className="bg-red-500 px-10"
          onClick={() => helpers.changeCount(data.count - 1)}
        >
          -
        </button>
        <button
          className="bg-red-500 px-10"
          onClick={() => helpers.changeCount(data.count + 1)}
        >
          +
        </button>
      </li>
      <li className="flex flex-col">
        <span>cantidad: {data.count}</span>
        <span>página: {data.page}</span>
        <span>total: {data.total}</span>
      </li>
      {data.users.map((user) => (
        <li className="flex flex-col p-4">
          <span>nombre: {user.firstName}</span>
          <span>apellido: {user.lastName}</span>
          <span>email: {user.email}</span>
          <span>role: {user.role}</span>
        </li>
      ))}
    </ul>
  );
}
