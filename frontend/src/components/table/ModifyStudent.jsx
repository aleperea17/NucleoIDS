import { useState } from 'react';
import Table from './table'; 

export default function StudentsManagement() {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([
    { id: 1, name: 'Juan Pérez', address: 'juanperez@gmail.com', phone: '555-1234' },
    { id: 2, name: 'María López', address: 'marialopez@gmail.com', phone: '555-5678' },
    { id: 3, name: 'Carlos García', address: 'carlos@gmail.com', phone: '555-8765' },
  ]);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
  });

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nombre y apellido', accessor: 'name' },
    { header: 'Correo electrónico', accessor: 'address' },
    { header: 'Teléfono', accessor: 'phone' },
  ];

  // Manejar la selección de un alumno
  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setFormData({
      name: student.name,
      address: student.address,
      phone: student.phone,
    });
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Guardar los cambios realizados en el alumno
  const handleSubmit = (event) => {
    event.preventDefault();
    setStudents((prev) =>
      prev.map((student) =>
        student.id === selectedStudent.id ? { ...student, ...formData } : student
      )
    );
    alert('Datos modificados exitosamente');
  };

  return (
    <div className="p-6 bg-base-200 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-customOrangenom ">Gestión de Alumnos</h1>

      <div className="card shadow-lg p-6 bg-base-100">
        <h2 className="text-xl font-bold mb-4">Lista de Alumnos</h2>

        {/* Tabla reutilizable con DaisyUI */}
        <Table
          columns={columns}
          data={students}
          loading={loading}
          withCheckbox={false}
          onRowClick={handleSelectStudent} // Nueva propiedad para manejar la selección
        />

        <h2 className="text-xl font-bold mt-8 mb-4">Modificar Datos del Alumno</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nombre</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nombre"
                className="input input-bordered input-sm"
                disabled={!selectedStudent} // Deshabilitar si no hay alumno seleccionado
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Correo electrónico</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Correo electrónico"
                className="input input-bordered input-sm"
                disabled={!selectedStudent}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Teléfono</span>
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Teléfono"
                className="input input-bordered input-sm"
                disabled={!selectedStudent}
              />
            </div>
          </div>
          <button
            className="btn btn-primary mt-6 btn-sm"
            disabled={!selectedStudent} // Deshabilitar el botón si no hay un alumno seleccionado
          >
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
}