import axios from "axios";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "react-daisyui";

export default function RecognitionWebcam() {
	const [isWebcamActive, setIsWebcamActive] = useState(false);
	const [error, setError] = useState(null);
	const [faceCoords, setFaceCoords] = useState(null);
	const videoRef = useRef(null);
	const canvasRef = useRef(null);
	const streamRef = useRef(null);
	const intervalRef = useRef(null);

	const getFaceLocation = async (img) => {
		try {
			const url = `${import.meta.env.VITE_PUBLIC_API_URL}/students/detectFace`;
			const response = await axios.post(url, {
				image_base64: img,
			});

			const { success } = response.data;

			if (success) {
				setFaceCoords(response.data.coords);
			} else {
				setFaceCoords(null);
				return;
			}
		} catch (err) {
			console.error("Error detecting face:", err);
		}
	};

	const captureImage = () => {
		if (canvasRef.current && videoRef.current) {
			const canvas = canvasRef.current;
			const context = canvas.getContext("2d");
			canvas.width = videoRef.current.videoWidth;
			canvas.height = videoRef.current.videoHeight;
			context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
			const dataURL = canvas.toDataURL("image/jpeg");
			return dataURL.replace(/^data:image\/jpeg;base64,/, "");
		}
		return null;
	};

	const handleCanPlay = useCallback(() => {
		if (videoRef.current) {
			videoRef.current.play().catch((error) => {
				console.error("Error playing video:", error);
				setError("Error playing video. Please try again.");
			});
		}
	}, []);

	const activateWebcam = useCallback(async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ video: true });
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				streamRef.current = stream;
				setIsWebcamActive(true);
				setError(null);
			}
		} catch (error) {
			console.error("Error accessing webcam:", error);
			setError(
				"Unable to access the webcam. Please make sure it's connected and you've granted the necessary permissions.",
			);
			setIsWebcamActive(false);
		}
	}, []);

	const deactivateWebcam = useCallback(() => {
		if (streamRef.current) {
			streamRef.current.getTracks().forEach((track) => track.stop());
			streamRef.current = null;
		}
		if (videoRef.current) {
			videoRef.current.srcObject = null;
		}
		clearInterval(intervalRef.current);
		setIsWebcamActive(false);
		setError(null);
	}, []);

	useEffect(() => {
		const drawFace = () => {
			const video = videoRef.current;
			const canvas = canvasRef.current;
			if (video && canvas && video.videoWidth > 0 && video.videoHeight > 0) {
				const ctx = canvas.getContext("2d");
				canvas.width = video.videoWidth;
				canvas.height = video.videoHeight;

				// Limpiar el canvas antes de dibujar
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

				// Dibujar el rectángulo si hay coordenadas
				if (faceCoords) {
					// console.log(faceCoords);
					const [top, right, bottom, left] = faceCoords;
					const width = right - left;
					const height = bottom - top;
					ctx.strokeStyle = "red";
					ctx.lineWidth = 3;
					ctx.strokeRect(left, top, width, height);
				}
			}

			// Continuar con el siguiente cuadro
			requestAnimationFrame(drawFace);
		};

		if (isWebcamActive) {
			requestAnimationFrame(drawFace);
		}

		// Limpiar en desmontaje
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [isWebcamActive, faceCoords]);

	useEffect(() => {
		let timeoutId;

		const executeInterval = () => {
			console.log("Timeout executed");
			const img = captureImage();
			if (img) {
				getFaceLocation(img);
			}
			timeoutId = setTimeout(executeInterval, 2000); // Ejecuta cada 2 segundos
		};

		if (isWebcamActive) {
			executeInterval(); // Comienza el bucle con timeout
		} else {
			clearTimeout(timeoutId);
		}

		return () => clearTimeout(timeoutId); // Limpia al desmontar o cuando `isWebcamActive` cambia
	}, [isWebcamActive]);

	useEffect(() => {
		return () => {
			deactivateWebcam();
		};
	}, [deactivateWebcam]);

	return (
		<div className="flex flex-col items-center gap-10 justify-center p-4 rounded-lg">
			<div className="relative w-full max-w-xl aspect-video bg-black rounded-lg overflow-hidden">
				<video
					ref={videoRef}
					onCanPlay={handleCanPlay}
					playsInline
					muted
					className={`absolute top-0 left-0 w-full h-full object-cover ${isWebcamActive ? "block" : "hidden"}`}
				/>
				<canvas
					ref={canvasRef}
					className={`absolute top-0 left-0 w-full h-full ${isWebcamActive ? "block" : "hidden"}`}
				/>
				{!isWebcamActive && !error && (
					<div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white">
						Webcam inactiva
					</div>
				)}
				{error && (
					<div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-red-500 text-center p-4">
						{error}
					</div>
				)}
			</div>
			<Button
				className="w-full"
				color={!isWebcamActive ? "primary" : "error"}
				onClick={isWebcamActive ? deactivateWebcam : activateWebcam}
			>
				{isWebcamActive ? "Terminar escaneo facial" : "Iniciar escaneo facial"}
			</Button>
		</div>
	);
}
