import React from "react";
import { Input } from "react-daisyui";
import { useForm, useFormContext } from "react-hook-form";
import toast from "react-hot-toast";

export default function TeacherCreateForm() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <>
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
          <span className="label-text">Usuario</span>
        </label>
        <Input
          {...register("username")}
          type="text"
          placeholder="usuario_1"
          className="input-bordered w-full"
        />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Contraseña</span>
        </label>
        <Input
          {...register("password")}
          type="password"
          placeholder="******"
          className="input-bordered w-full"
        />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Confirmar Contraseña</span>
        </label>
        <Input
          {...register("confirmPassword", {
            validate: (value, formValues) => value === formValues.password,
          })}
          type="password"
          placeholder="******"
          className="input-bordered w-full"
        />
      </div>
    </>
  );
}
