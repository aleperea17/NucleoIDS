import { useEffect, useState } from 'react';
import Table from './table';

export default function AttendanceHistory() {
  const [workshopData, setWorkshopData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulación de una llamada a la base de datos para obtener los datos
  useEffect(() => {
    async function fetchData() {
      // Aquí iría tu lógica para hacer una petición a la base de datos
      // Reemplazar esto con tu lógica de fetch/axios/otro método para traer datos
      const response = await fetch('/api/workshop-attendance');
      const data = await response.json();

      setWorkshopData(data); // Asignamos los datos obtenidos
      setLoading(false); // Ya no está cargando
    }

    fetchData();
  }, []);

  const columns = [
    { header: 'Nombre del Taller', accessor: 'workshopName' },
    { header: 'Profesor', accessor: 'teacherName' },
    { header: 'Cantidad de Alumnos', accessor: 'studentCount' },
  ];

  return (
    <div className="min-h-screen bg-base-200 p-5">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center text-customOrange">Historial de Asistencias</h1>
        
        {/* Tabla con los datos de asistencia */}
        <Table columns={columns} data={workshopData} loading={loading} withCheckbox={false} />
      </div>
    </div>
  );
}

