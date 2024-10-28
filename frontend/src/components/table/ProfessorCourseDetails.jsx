import useProfessorCourse from "../../hooks/useCourse";

const ProfessorCourse = ({ professorId }) => {
    const { course, loading, error } = useProfessorCourse(professorId);
  
    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!course) return <div>No se encontró el curso</div>;
  
    return (
      <div>
        <h2>Curso: {course.Taller.course_name}</h2>
        <h3>Estudiantes:</h3>
        <ul>
          {course.Estudiantes && course.Estudiantes.map(student => (
            <li key={student.dni}>
              {student.lastName}, {student.firstName}
            </li>
          ))}
        </ul>
      </div>
    );
  };

export default ProfessorCourse;