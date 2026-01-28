import React from "react";
import {
  LayoutDashboard,
  Package,
  Trash2,
  Repeat,
  Users,
  FileText,
  Settings,
  FileMinus
} from "lucide-react";

export const sections = [
  { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { key: "activos", label: "Activos", icon: <Package size={20} /> },
  { key: "bajas", label: "Bajas", icon: <Trash2 size={20} /> },
  { key: "transferencias", label: "Transferencias", icon: <Repeat size={20} /> },
  { key: "usuarios", label: "Usuarios", icon: <Users size={20} /> },
  { key: "reportes", label: "Reportes", icon: <FileText size={20} /> },
  { key: "solicitarBaja", label: "SolicitarBaja", icon: <FileMinus size={20} /> },
  { key: "preferencias", label: "Preferencias", icon: <Settings size={20} /> }
];