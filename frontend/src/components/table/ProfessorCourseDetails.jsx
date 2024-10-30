import useProfessorCourse from "../../hooks/useCourse";

const ProfessorCourse = ({ professorId }) => {
  const { course, loading, error } = useProfessorCourse(professorId);

  if (!professorId) return <div>No se ha especificado un profesor</div>;
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div>Cargando información del curso...</div>
      </div>
    );
  }

  // Manejo mejorado del error
  if (error) {
    return (
      <div className="text-red-600 p-4">
        <h3>Error al cargar el curso:</h3>
        <p>{typeof error === 'string' ? error : error.message || 'Error desconocido'}</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-4">
        <p>No se encontró información del curso para este profesor</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold">
          Curso: {course.Taller.course_name}
        </h2>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Estudiantes:</h3>
        {course.Estudiantes && course.Estudiantes.length > 0 ? (
          <ul className="space-y-2">
            {course.Estudiantes.map(student => (
              <li 
                key={student.dni}
                className="p-2 bg-gray-50 rounded"
              >
                {student.lastName}, {student.firstName}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No hay estudiantes registrados en este curso</p>
        )}
      </div>
    </div>
  );
};

export default ProfessorCourse;