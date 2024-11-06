import { useMemo } from "react";

export const columns = [
  {
    header: "Estudiante",
    accessor: "firstName",
    render: (name, row) => {
      // Genera un color aleatorio evitando negro y blanco
      const randomColor = useMemo(() => {
        const getRandomColorPart = () => Math.floor(Math.random() * (200 - 50) + 50); // Rango entre 50 y 200
        const color = `rgb(${getRandomColorPart()}, ${getRandomColorPart()}, ${getRandomColorPart()})`;
        return color;
      }, []);

      return (
        <div className="flex items-center space-x-3 truncate">
          <div
            className="w-10 h-10 flex items-center justify-center rounded-full text-white font-bold"
            style={{ backgroundColor: randomColor }}
          >
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-bold">
              {name} {row.lastName}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    header: "Correo",
    accessor: "email",
    render: (email) => <div>{email}</div>,
  },
  {
    header: "DNI",
    accessor: "dni",
    render: (dni) => <div>{dni}</div>,
  },
];

