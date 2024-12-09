import { PencilIcon, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Button, Input, Mask, Modal, Tooltip } from "react-daisyui";
import { useForm } from "react-hook-form";
import { fetcher } from "../../../fetcher/fetcher";
import useSWR from "swr";
import { useAuth } from "../../../hooks/use-auth";
import Autocomplete from "../../../components/common/autocomplete";

export const columns = [
  {
    header: "Estudiante",
    accessor: "firstName",
    render: (name, row) => {
      // Genera un color aleatorio evitando negro y blanco
      const randomColor = useMemo(() => {
        const getRandomColorPart = () =>
          Math.floor(Math.random() * (200 - 50) + 50); // Rango entre 50 y 200
        const color = `rgb(${getRandomColorPart()}, ${getRandomColorPart()}, ${getRandomColorPart()})`;
        return color;
      }, []);

      return (
        <div className="flex items-center space-x-3 truncate">
          <div
            className="w-10 h-10 flex items-center justify-center rounded-full text-white font-bold"
            style={{ backgroundColor: randomColor }}
          >
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-bold">
              {name} {row.lastName}
            </div>
          </div>
        </div>
      );
    },
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
  {
    header: "Acciones",
    render: (_, row) => {
      const [isOpen, setIsOpen] = useState(false);
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
      const { user } = useAuth();
      const { data: courses_list } = useSWR(
        user.role === "ADMIN" ? "/courses" : null,
        getCoursesFetcher,
      );

      console.log(courses_list);
      const { register, control, handleSubmit } = useForm({
        defaultValues: row,
      });
      const onClose = () => setIsOpen(false);

      const onSubmit = async (data) => {
        try {
          const response = await fetcher.put("/users/modify-student", {
            dni: data.dni,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            course: data.course
              ? courses_list.find((c) => c.value === data.course).label
              : null,
          });
          if (response.data.success) {
            toast.succes(response.data.message);
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          toast.error("Algo salió mal");
        }
      };

      console.log(row);

      const autocomplete_value = useMemo(() => {
        if (user.role === "ADMIN" && courses_list) {
          const course = courses_list.find(
            (c) => c.value === row.course_ids[0],
          );
          console.log({ course }, "COURSEEE");
          if (course) {
            return {
              value: course.value,
              label: course.label,
            };
          }
          return null;
        }
        return null;
      }, [courses_list, row]);
      return (
        <>
          <Tooltip message="Editar">
            <Button color="accent" size="sm" onClick={() => setIsOpen(!isOpen)}>
              <PencilIcon className="w-5 h-5" />
            </Button>
          </Tooltip>
          <Modal open={isOpen}>
            <Modal.Header className="font-bold text-lg relative">
              Editar Alumno
              <Button
                className="btn-circle absolute right-0"
                size="sm"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </Modal.Header>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Nombre</span>
                </label>
                <Input
                  {...register("firstName")}
                  type="text"
                  placeholder="Nombre"
                  className="input-bordered w-full"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Apellido</span>
                </label>
                <Input
                  {...register("lastName")}
                  type="text"
                  placeholder="Apellido"
                  className="input-bordered w-full"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="tu.email@gmail.com"
                  className="input-bordered w-full"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">DNI </span>
                </label>
                <Input
                  {...register("dni")}
                  type="text"
                  disabled={true}
                  placeholder="421321230"
                  className="input-bordered w-full"
                />
              </div>
              <div className="col-span-2 mt-5">
                {user && user.role === "ADMIN" ? (
                  <Autocomplete
                    name="course"
                    value={autocomplete_value}
                    className="col-span-2"
                    placeholder="Buscar talleres..."
                    control={control}
                    options={courses_list}
                  />
                ) : null}
              </div>

              <Modal.Actions>
                <Button type="button">Cancelar</Button>
                <Button type="submit" color="primary">
                  Confirmar edición
                </Button>
              </Modal.Actions>
            </form>
          </Modal>
        </>
      );
    },
  },
];
