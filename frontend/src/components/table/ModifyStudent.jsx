import { useState } from 'react';
import Table from './table'; 
import { Button, Modal } from 'react-daisyui'; 
import { PencilIcon } from '@heroicons/react/24/outline'; 

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
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nombre y apellido', accessor: 'name' },
    { header: 'Correo electrónico', accessor: 'address' },
    { header: 'Teléfono', accessor: 'phone' },
    {
      header: 'Acciones',
      render: (value, row) => {
        const handleShowEditDialog = () => {
          setSelectedStudent(row);
          setFormData({
            name: row.name,
            address: row.address,
            phone: row.phone,
          });
          setIsModalOpen(true); 
        };

        return (
          <Button onClick={handleShowEditDialog} className="btn-icon bg-gray-300 p-2 rounded-full">
            <PencilIcon className="h-5 w-5 text-customOrange" /> 
          </Button>
        );
      },
    },
  ];

  
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  
  const handleSubmit = (event) => {
    event.preventDefault();
    setStudents((prev) =>
      prev.map((student) =>
        student.id === selectedStudent.id ? { ...student, ...formData } : student
      )
    );
    alert('Datos modificados exitosamente');
    setIsModalOpen(false); 
  };

  return (
    <div className="p-6 bg-base-200 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-customOrange">Gestión de Alumnos</h1>

      <div className="card shadow-lg p-6 bg-base-100">
        <h2 className="text-xl font-bold mb-4">Lista de Alumnos</h2>

     
        <Table
          columns={columns}
          data={students}
          loading={loading}
          withCheckbox={false}
        />

    
        {isModalOpen && (
          <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <div className="p-4">
              <h2 className="text-xl font-bold mb-4">Modificar Datos del Alumno</h2>
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
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6 space-x-2">
                  <button className="btn btn-primary btn-sm" type="submit">
                    Guardar Cambios
                  </button>
                  <Button onClick={() => setIsModalOpen(false)} className="btn btn-sm">
                    Cerrar
                  </Button>
                </div>
              </form>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
