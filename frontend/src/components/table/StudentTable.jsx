import Table from './Table';
import fotos from './img';

const alumnosData = [
  { name: 'Juan Pérez', badge: 'Programación', avatar: fotos.img6 },
  { name: 'María López', badge: 'Robótica', avatar: fotos.img7 },
  // para otros alumnos
];

const alumnosColumns = [
  { label: '' },
  { label: 'Nombre y apellido' },
  { label: 'Curso' },
  { label: 'Progreso' },
];

const StudentTable = () => (
  <Table title="Lista de alumnos" data={alumnosData} columns={alumnosColumns} />
);

export default StudentTable;
