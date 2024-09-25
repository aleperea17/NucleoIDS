import React from "react";
import { Input } from "react-daisyui";
import { useForm, useFormContext } from "react-hook-form";
import toast from "react-hot-toast";

export default function StudentsCreateForm() {
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
          <span className="label-text">DNI </span>
        </label>
        <Input
          {...register("dni")}
          type="text"
          placeholder="421321230"
          className="input-bordered w-full"
        />
      </div>
    </>
  );
}
