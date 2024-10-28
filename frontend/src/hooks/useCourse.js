import { useState, useEffect } from 'react';

const useProfessorCourse = (professorId) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/courses/get-course-by-professor-id?professor_id=${professorId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.Taller || !data.Estudiantes) {
          throw new Error('La respuesta del servidor no tiene el formato esperado');
        }
        
        setCourse(data);
      } catch (err) {
        setError(err.message);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    if (professorId) {
      fetchCourse();
    }
  }, [professorId]);

  return { course, loading, error };
};

export default useProfessorCourse;