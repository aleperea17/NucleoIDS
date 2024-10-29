import React from "react";
import {
  Navbar as DaisyUINavbar,
  Button,
  Dropdown,
  Avatar,
} from "react-daisyui";
import useLocalStorage from "../../hooks/useLocalStorage";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";

export const ROUTES = {
  ["ADMIN"]: [
    {
      path: "teachers",
      label: "Profesores",
    },
    {
      path: "students",
      label: "Alumnos",
    },
  ],
  ["TEACHER"]: [
    {
      path: "my-students",
      label: "Mis estudiantes",
    },
    {
      path: "mark-assistance",
      label: "Marcar Asistencia",
    },
    {},
  ],
};

export const Navbar = () => {
  const [token] = useLocalStorage("token", null);
  const [refreshToken] = useLocalStorage("refresh_token", null);
  const { user } = useAuth();

  const routes = ROUTES[user.role];

  const { pathname } = useLocation();

  const navigate = useNavigate();
  return (
    <DaisyUINavbar className="bg-base-100 shadow-md">
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
        {routes.map((route) => (
          <Button
            color="ghost"
            className="normal-case"
            active={pathname.includes(route.path)}
            onClick={() => navigate(`/dashboard/${route.path}`)}
          >
            {route.label}
          </Button>
        ))}
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
                  localStorage.removeItem("token");
                }
                if (refreshToken) {
                  localStorage.removeItem("refresh_token");
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
