import React from "react";
import {
  LayoutDashboard,
  Package,
  Trash2,
  Users,
  FileText,
  FileMinus,
  Building2,
  ShieldUser
} from "lucide-react";

export const sections = [
  { 
    key: "dashboard", 
    label: "Dashboard", 
    icon: <LayoutDashboard size={20} />,
    roles: ["Administrador", "Docente", "Encargado", "Bot", "Gran Bot", "Chibilin"] 
  },
  { 
    key: "activos", 
    label: "Grupos", 
    icon: <Package size={20} />,
    roles: ["Administrador", "Encargado"] 
  },
  { 
    key: "edificios", 
    label: "Edificios", 
    icon: <Building2 size={20} />,
    roles: ["Administrador"] 
  },
  { 
    key: "bajas", 
    label: "Gestión de Solicitudes", 
    icon: <Trash2 size={20} />,
    roles: ["Administrador", "Encargado"] 
  },
  { 
    key: "usuarios", 
    label: "Usuarios", 
    icon: <Users size={20} />,
    roles: ["Administrador"] 
  },
  { 
    key: "reportes", 
    label: "Reportes", 
    icon: <FileText size={20} />,
    roles: ["Administrador", "Encargado"] 
  },
  { 
    key: "solicitar-baja", 
    label: "Solicitar Movimiento", 
    icon: <FileMinus size={20} />,
    roles: ["Docente", "Administrador", "Encargado"] 
  },
  { 
    key: "encargados", 
    label: "Encargados", 
    icon: <ShieldUser size={20} />,
    roles: ["Administrador"] 
  }
];