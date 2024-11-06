import React from "react";
import { Badge, Button, Mask, Modal, Pagination, Select } from "react-daisyui";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import Heading from "../../../components/common/heading";
import Table from "../../../components/table/Table";
import useUsers from "../../../hooks/use-user";
import StudentsCreateForm from "./students-create-form";
import { columns } from "./table-columns";
import useProfessorCourse from "../../../hooks/useCourse";
import { useAuth } from "../../../hooks/use-auth";
import { Navigate } from "react-router-dom";

export default function MyStudentsPage() {
  const { data, isLoading, error, mutate, helpers, count, page } = useUsers({
    role: "STUDENT",
  });

  const { user } = useAuth();

  console.log(user);
  const { course, loading: isLoadingProfessorCourse } = useProfessorCourse(
    user.role === "TEACHER" ? user.teacher.id : undefined,
  );

  const methods = useForm();

  const onFormSubmit = async (data) => {
    const { confirmPassword, ...rest } = data;
    const response = await axios.post("http://localhost:8000/users/student", {
      ...rest,
    });

    if (response.data.dni) {
      toast.success("Alumno creado con éxito", { position: "top-right" });
      mutate();
      methods.reset();
    } else {
      toast.error("Algo salió mal!", { position: "top-right" });
    }
  };

  const { Dialog, handleShow, handleHide } = Modal.useDialog();

  if (!course || isLoadingProfessorCourse)
    return (
      <span className="loading loading-spinner text-primary w-52 mx-auto mt-10"></span>
    );
  if (!course || user.role !== "TEACHER") return <Navigate to="/dashboard" />;
  return (
    <section className="px-10 py-5">
      <Heading
        title="Lista de Estudiantes"
        description="Acá podrás encontrar la lista de tus estudiantes"
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
        <Table
          data={course && course.Estudiantes ? course.Estudiantes : []}
          columns={columns}
        />
      </section>
    </section>
  );
}
