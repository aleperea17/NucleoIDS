import { Mask } from "react-daisyui";

export const columns = [
  {
    header: "Estudiante",
    accessor: "firstName",
    render: (name, row) => (
      <div className="flex items-center space-x-3 truncate">
        <Mask
          variant="squircle"
          src="https://img.daisyui.com/images/profile/demo/2@94.webp"
        />
        <div>
          <div className="font-bold">
            {name} {row.lastName}
          </div>
        </div>
      </div>
    ),
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
