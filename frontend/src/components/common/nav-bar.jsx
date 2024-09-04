import React from "react";
import {
  Navbar as DaisyUINavbar,
  Button,
  Dropdown,
  Avatar,
} from "react-daisyui";
import useLocalStorage from "../../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const [token, setToken] = useLocalStorage("token", null);

  const navigate = useNavigate();
  return (
    <DaisyUINavbar className="bg-base-100 shadow">
      <DaisyUINavbar.Start>
        <Button color="ghost" className="normal-case text-xl">
          <img
            className="h-fit w-28 object-cover"
            src="/NucleoColor.png"
            alt=""
          />
        </Button>
      </DaisyUINavbar.Start>
      <DaisyUINavbar.Center>
        <Button color="ghost" className="normal-case">
          Dashboard
        </Button>
        <Button color="ghost" className="normal-case">
          Alumnos
        </Button>
        <Button color="ghost" className="normal-case">
          Profesores
        </Button>
        <Button color="ghost" className="normal-case"></Button>
      </DaisyUINavbar.Center>
      <DaisyUINavbar.End>
        <Dropdown vertical="bottom" horizontal="left">
          <Button color="ghost" className="btn-circle avatar">
            <Avatar
              size="xs"
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              shape="circle"
            />
          </Button>
          <Dropdown.Menu className="w-52 menu-compact">
            <Dropdown.Item>Perfil</Dropdown.Item>
            <Dropdown.Item>Ajustes</Dropdown.Item>
            <Dropdown.Item
              className="text-error"
              onClick={() => {
                if (token) {
                  setToken(null);
                }
                navigate("/auth/login");
              }}
            >
              Cerrar sesión
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </DaisyUINavbar.End>
    </DaisyUINavbar>
  );
};
