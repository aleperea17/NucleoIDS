import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'libros48',
    database: 'sistema_asistencias'
});

console.log('Conectado a la base de datos MySQL');

export default connection;
