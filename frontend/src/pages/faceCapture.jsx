import { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';

export default function FaceCapture() {
  const [isScanning, setIsScanning] = useState(false);
  const [attendanceList, setAttendanceList] = useState([]);
  const [assignedWorkshop, setAssignedWorkshop] = useState('');

  // Simulacion de la obtención del taller asignado tras el inicio de sesión del profesor
  useEffect(() => {
    // Aquí debe ir la llamada al backend para obtener el taller del profesor.
    // Ejemplo: fetch('/api/workshop').then(response => response.json()).then(data => setAssignedWorkshop(data.workshop));
    
    // ejemplo, simulacion para taller fijo:
    const workshop = 'Programación';
    setAssignedWorkshop(workshop);
  }, []);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setAttendanceList((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          name: 'Nuevo Alumno',
          time: new Date().toLocaleTimeString(),
          image: `https://i.pravatar.cc/150?img=${prev.length + 3}`,
        },
      ]);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-base-200 p-5">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center text-customOrange">Toma de Asistencia</h1>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-0">
            <h2 className="text-xl font-bold p-4 bg-customOrange text-white">
              Taller: {assignedWorkshop || 'Cargando...'}
            </h2>

            <div className="flex flex-col lg:flex-row p-4 gap-6">
              <div className="w-full lg:w-1/2">
                <div className="bg-base-200 aspect-video flex items-center justify-center rounded-box">
                  {isScanning ? (
                    <div className="text-center">
                      <Camera className="mx-auto animate-pulse text-primary" size={64} />
                      <p className="mt-4 text-primary font-semibold text-lg">Escaneando...</p>
                    </div>
                  ) : (
                    <Camera className="text-primary" size={64} />
                  )}
                </div>

                <button
                  className="btn bg-customOrange text-white btn-block mt-4"
                  onClick={handleScan}
                  disabled={isScanning}
                >
                  {isScanning ? 'Escaneando...' : 'Iniciar Escaneo Facial'}
                </button>
              </div>

              <div className="w-full lg:w-1/2">
                <h3 className="text-xl font-semibold mb-4 text-customOrange">Asistencia Registrada</h3>
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th className="bg-customOrange text-white">Alumno</th>
                        <th className="bg-customOrange text-white">Nombre</th>
                        <th className="bg-customOrange text-white">Hora</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceList.map((student) => (
                        <tr key={student.id}>
                          <td>
                            <div className="avatar">
                              <div className="w-10 rounded-full">
                                <img
                                  src={student.image}
                                  alt={`Foto de ${student.name}`}
                                  width={40}
                                  height={40}
                                  className="rounded-full"
                                />
                              </div>
                            </div>
                          </td>
                          <td>{student.name}</td>
                          <td>{student.time}</td>
                        </tr>
                      ))}
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

