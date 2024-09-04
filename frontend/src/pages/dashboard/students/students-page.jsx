import React from "react";
import { Badge, Button, Mask, Modal, Pagination, Select } from "react-daisyui";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import Heading from "../../../components/common/heading";
import Table from "../../../components/table/Table";
import useUsers from "../../../hooks/use-user";
import StudentsCreateForm from "./students-create-form";

export default function StudentsPage() {
  const { data, isLoading, error, mutate, helpers, count, page } = useUsers({
    role: "STUDENT",
  });

  const methods = useForm();

  const onFormSubmit = async (data) => {
    const { confirmPassword, ...rest } = data;
    const response = await axios.post("http://localhost:8000/users/student", {
      ...rest,
    });

    if (response.data.success) {
      toast.success("Alumno creado con éxito", { position: "top-right" });
      mutate();
      methods.reset();
    } else {
      toast.error("Algo salió mal!", { position: "top-right" });
    }
  };

  const columns = [
    {
      header: "Estudiante",
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
      header: "Correo",
      accessor: "email",
      render: (email) => <div>{email}</div>,
    },
    {
      header: "DNI",
      accessor: "dni",
      render: (dni) => <div>{dni}</div>,
    },
  ];
  const { Dialog, handleShow, handleHide } = Modal.useDialog();

  return (
    <section className="px-10 py-5">
      <Heading
        title="Lista de Estudiantes"
        description="Acá podrás encontrar la lista de todos los estudiantes"
        action={
          <div className="flex flex-row gap-3 items-center">
            <Button onClick={handleShow} color="primary">
              Añadir Estudiante
            </Button>

            <Select
              value={count}
              onChange={(event) => {
                helpers.changeCount(parseInt(event.target.value));
              }}
            >
              <option value={"default"} disabled defaultValue={"default"}>
                Cantidad de estudiantes
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
              Crear un nuevo estudiante
            </Modal.Header>
            <Modal.Body>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StudentsCreateForm />
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
