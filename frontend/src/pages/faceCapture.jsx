import { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import RecognitionWebcam from "../components/common/recognition-webcam";
import useProfessorCourse from "../hooks/useCourse";
import { useAuth } from "../hooks/use-auth";
import useSWR from "swr";
import { fetcher } from "../fetcher/fetcher";

const Skeleton = () => {
	return (
		<tr>
			<td class="animate-pulse">
				<div class="h-4 bg-gray-300 rounded w-24"></div>
			</td>
			<td class="animate-pulse">
				<div class="h-4 bg-gray-300 rounded w-24"></div>
			</td>
		</tr>
	);
};

export default function FaceCapture() {
	const [isScanning, setIsScanning] = useState(false);
	const { loading, user } = useAuth();
	const { course, loading: loadingCourseData } = useProfessorCourse(
		user && user.teacher ? user.teacher.id : undefined,
	);
	const [assignedWorkshop, setAssignedWorkshop] = useState("");

	const { data: attendance_data, mutate } = useSWR(
		course && course.Taller ? `/courses/course/${course.Taller.id}` : null,
		async (url) => {
			try {
				const today = new Date();
				const response = await fetcher.get(url, {
					params: {
						date:
							today.getFullYear() +
							"-" +
							String(today.getMonth() + 1).padStart(2, "0") +
							"-" +
							String(today.getDate()).padStart(2, "0"),
					},
				});
				return response.data.attendances.map(({ student }) => student);
			} catch (error) {
				console.log(error);
			}
		},
	);
	console.log(attendance_data);
	console.log(course);
	// Simulacion de la obtención del taller asignado tras el inicio de sesión del profesor
	useEffect(() => {
		// Aquí debe ir la llamada al backend para obtener el taller del profesor.
		// Ejemplo: fetch('/api/workshop').then(response => response.json()).then(data => setAssignedWorkshop(data.workshop));

		// ejemplo, simulacion para taller fijo:
		const workshop = "Programación";
		setAssignedWorkshop(workshop);
	}, []);

	// console.log(attendanceList);
	const handleScan = () => {
		setIsScanning(true);
		setTimeout(() => {
			setIsScanning(false);
			setAttendanceList((prev) => [
				...prev,
				{
					id: prev.length + 1,
					name: "Nuevo Alumno",
					time: new Date().toLocaleTimeString(),
					image: `https://i.pravatar.cc/150?img=${prev.length + 3}`,
				},
			]);
		}, 3000);
	};

	if (loading || loadingCourseData) return "Cargando...";
	return (
		<div className="min-h-screen bg-base-200 p-5">
			<div className="container mx-auto">
				<h1 className="text-4xl font-bold mb-6 text-center text-primary">
					Toma de Asistencia
				</h1>

				<div className="card bg-base-100 shadow-xl">
					<div className="card-body p-0">
						<h2 className="text-xl font-bold p-4 bg-primary text-white">
							Taller: {course.Taller.course_name}
						</h2>

						<div className="flex flex-col lg:flex-row p-4 gap-6">
							<div className="w-full lg:w-1/2">
								{/* <div className="bg-base-200 aspect-video flex items-center justify-center rounded-box"> */}
								{/*   {isScanning ? ( */}
								{/*     <div className="text-center"> */}
								{/*       <Camera className="mx-auto animate-pulse text-primary" size={64} /> */}
								{/*       <p className="mt-4 text-primary font-semibold text-lg">Escaneando...</p> */}
								{/*     </div> */}
								{/*   ) : ( */}
								{/*     <Camera className="text-primary" size={64} /> */}
								{/*   )} */}
								{/* </div> */}

								<RecognitionWebcam
									courseId={course && course.Taller ? course.Taller.id : null}
									onMarkAttendance={(newAttendance) => {
										mutate([...attendance_data, newAttendance]);
										console.log("INSIDE ONMARKATTENDANCE FUNCTION");
										// setAttendanceList([...attendanceList, newAttendance]);
									}}
								/>
							</div>

							<div className="w-full lg:w-1/2">
								<h3 className="text-xl font-semibold mb-4 text-primary">
									Asistencia Registrada
								</h3>
								<div className="overflow-x-auto">
									<table className="table w-full">
										<thead>
											<tr>
												<th className="bg-primary text-white">Alumno</th>
												<th className="bg-primary text-white">DNI</th>
											</tr>
										</thead>
										<tbody className="relative">
											{attendance_data ? (
												attendance_data.map(
													({ firstName, id, dni, lastName }) => (
														<tr key={id}>
															<td>
																{firstName} {lastName}
															</td>
															<td>{dni}</td>
														</tr>
													),
												)
											) : (
												<Skeleton />
											)}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
