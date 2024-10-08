import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "react-daisyui";

export default function RecognitionWebcam() {
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

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
    setIsWebcamActive(false);
    setError(null);
  }, []);

  const handleCanPlay = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Error playing video:", error);
        setError("Error playing video. Please try again.");
      });
    }
  }, []);

  const drawRedRectangle = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas && video.videoWidth > 0 && video.videoHeight > 0) {
      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Draw a red rectangle
      ctx.strokeStyle = "red";
      ctx.lineWidth = 3;
      ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

      // Request the next animation frame
      requestAnimationFrame(drawRedRectangle);
    }
  }, []);

  useEffect(() => {
    if (isWebcamActive) {
      const videoElement = videoRef.current;
      if (videoElement) {
        videoElement.addEventListener("loadedmetadata", drawRedRectangle);
      }
      return () => {
        if (videoElement) {
          videoElement.removeEventListener("loadedmetadata", drawRedRectangle);
        }
      };
    }
  }, [isWebcamActive, drawRedRectangle]);

  useEffect(() => {
    return () => {
      deactivateWebcam();
    };
  }, [deactivateWebcam]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg shadow-md">
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
        color={!isWebcamActive ? "primary" : "error"}
        onClick={isWebcamActive ? deactivateWebcam : activateWebcam}
      >
        {isWebcamActive ? "Desactivar Webcam" : "Activar Webcam"}
      </Button>
    </div>
  );
}
