import React, { useRef, useState } from "react";
import { Button, Input } from "react-daisyui";
import { useForm, useFormContext, useWatch } from "react-hook-form";
import Autocomplete from "../../../components/common/autocomplete";
import toast from "react-hot-toast";
import { CameraIcon } from "lucide-react";

const CameraCapture = () => {
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef(null);
  const { setValue, control } = useFormContext();
  const image_base64 = useWatch({ name: "image_base64", control });

  console.log(image_base64);
  const startCamera = async () => {
    try {
      setValue("image_base64", null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const takePhoto = async () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg");
      setValue("image_base64", dataUrl);

      stopCamera();
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  return (
    <div className="w-full">
      <div className="aspect-video">
        {!image_base64 ? (
          <video ref={videoRef} width="100%" height="100%" autoPlay />
        ) : (
          <img src={image_base64} />
        )}
      </div>
      <div className="flex items-center gap-2 justify-center mt-3">
        <Button
          color="primary"
          type="button"
          onClick={() => {
            if (cameraStream) {
              stopCamera();
            } else {
              startCamera();
            }
          }}
        >
          {cameraStream ? "Detener camara" : "Iniciar camara"}
        </Button>
        {cameraStream && (
          <Button type="button" onClick={takePhoto}>
            <CameraIcon />
          </Button>
        )}
      </div>
    </div>
  );
};

export default function StudentsCreateForm({
  taller = null,
  options = [],
  showCamera = true,
}) {
  const {
    register,
    handleSubmit,
    control,
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
      <div className="col-span-2">
        <CameraCapture />
      </div>
      <div className="col-span-2">
        <Autocomplete
          name="courseId"
          value={taller}
          disabled={taller}
          className="col-span-2"
          placeholder="Buscar talleres..."
          control={control}
          options={options}
        />
      </div>
    </>
  );
}
