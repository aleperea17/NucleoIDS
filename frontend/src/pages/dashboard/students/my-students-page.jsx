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
import { fetcher } from "../../../fetcher/fetcher";

export default function MyStudentsPage() {
  const { user } = useAuth();

  console.log(user);
  const { course, loading: isLoadingProfessorCourse } = useProfessorCourse(
    user.role === "TEACHER" ? user.teacher.id : undefined,
  );

  const methods = useForm();

  const onSubmit = async (data) => {
    try {
      const payload = {
        student_input: {
          dni: data.dni,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          course: data.courseId,
        },
        base64_string: {
          image_base64: data.image_base64,
        },
      };

      const response = await fetcher.post("/students/train", payload);

      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
      methods.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Algo salió mal!");
      // Handle error
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
          </div>
        }
      />
      <Dialog>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <Modal.Header className="font-bold">
              Crear un nuevo estudiante
            </Modal.Header>
            <Modal.Body>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StudentsCreateForm
                  taller={{ value: course.Taller.id, label: "Robótica" }}
                  options={[]}
                />
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
