import Table from './Table';
import fotos from './img';

const profesoresData = [
  { name: 'Diego Padula', badge: 'Diseño 3D', avatar: fotos.img1 },
  { name: 'Verónica Rossi', badge: 'Inglés', avatar: fotos.img2 },
  // se deben agregar mas prof
];

const profesoresColumns = [
  { label: '' },
  { label: 'Nombre y apellido' },
  { label: 'Taller' },
  { label: 'Edición' },
];

const TeachersTable = () => (
  <Table title="Lista de profesores" data={profesoresData} columns={profesoresColumns} />
);

export default TeachersTable;
