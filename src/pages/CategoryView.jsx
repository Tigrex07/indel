import { useState } from "react";
import { Search, Filter, Plus, X } from "lucide-react";

export default function CategoryView({ category, onBack }) {
  const data = {
    Escritorios: [
      { id: "0001", aula: "18", docencia: "Edificio A", fecha: "19/01/26", estado: "Bueno" },
      { id: "0002", aula: "12", docencia: "Edificio B", fecha: "20/01/26", estado: "Regular" },
    ],
    Teles: [
      { id: "TV01", aula: "5", docencia: "Edificio C", fecha: "15/01/26", estado: "En uso" },
      { id: "TV02", aula: "10", docencia: "Edificio A", fecha: "16/01/26", estado: "Revisión" },
    ],
    Computadoras: [
      { id: "PC01", aula: "3", docencia: "Edificio B", fecha: "10/01/26", estado: "Operativa" },
      { id: "PC02", aula: "7", docencia: "Edificio C", fecha: "11/01/26", estado: "Mantenimiento" },
    ],
    Proyectores: [
      { id: "PJ01", aula: "20", docencia: "Edificio A", fecha: "12/01/26", estado: "Operativo" },
    ],
  };

  const registros = data[category] || [];

  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [openForm, setOpenForm] = useState(false);

  const filtrados = registros.filter((item) => {
    const matchSearch =
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.aula.toLowerCase().includes(search.toLowerCase()) ||
      item.docencia.toLowerCase().includes(search.toLowerCase());

    const matchEstado = estadoFilter ? item.estado === estadoFilter : true;

    return matchSearch && matchEstado;
  });

  return (
    <div className="min-h-screen bg-emerald-50 p-10 space-y-10 relative">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-emerald-700 tracking-wide">
          {category} — Vista General
        </h1>

        <div className="flex gap-3">
          <button
            onClick={() => setOpenForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
          >
            <Plus size={18} /> Agregar Activo{category.slice(0, 0)}
          </button>

          <button
            onClick={onBack}
            className="px-4 py-2 rounded-lg bg-gray-300 text-gray-800 font-semibold hover:bg-gray-400 transition"
          >
            Volver
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPI title="Total" value={registros.length} />
        <KPI title="Funcionando" value={registros.filter(r => ["Bueno", "Operativo"].includes(r.estado)).length} />
        <KPI title="En revisión" value={registros.filter(r => ["Revisión", "Mantenimiento"].includes(r.estado)).length} />
        <KPI title="Críticos" value={registros.filter(r => r.estado === "Regular").length} />
      </div>

      {/* Filtros */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-emerald-200 flex flex-col md:flex-row gap-4">
        
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600" />
          <input
            type="text"
            placeholder="Buscar por ID, Aula o Docencia..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <select
          value={estadoFilter}
          onChange={(e) => setEstadoFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">Todos los estados</option>
          <option value="Bueno">Bueno</option>
          <option value="Operativo">Operativo</option>
          <option value="Regular">Regular</option>
          <option value="En uso">En uso</option>
          <option value="Revisión">Revisión</option>
          <option value="Mantenimiento">Mantenimiento</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-xl border border-emerald-200">
        <table className="min-w-full">
          <thead className="bg-emerald-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Aula</th>
              <th className="px-4 py-3 text-left">Docencia</th>
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-left">Estado</th>
            </tr>
          </thead>

          <tbody>
            {filtrados.map((item, i) => (
              <tr key={i} className="odd:bg-emerald-50 even:bg-white hover:bg-emerald-100 transition">
                <td className="px-4 py-3 font-semibold">{item.id}</td>
                <td className="px-4 py-3">{item.aula}</td>
                <td className="px-4 py-3">{item.docencia}</td>
                <td className="px-4 py-3">{item.fecha}</td>
                <td className="px-4 py-3">
                  <EstadoBadge estado={item.estado} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Overlay */}
      {openForm && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setOpenForm(false)}></div>
      )}

      {/* Side Panel */}
      <div className={`fixed top-0 right-0 h-full w-[420px] bg-white shadow-xl border-l border-gray-200 z-50 transform transition-transform duration-300 ${openForm ? "translate-x-0" : "translate-x-full"}`}>
        
        {/* Header panel */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-emerald-700">Agregar Activo{category.slice(0, 0)}</h2>
          <button onClick={() => setOpenForm(false)}>
            <X size={22} className="text-gray-600 hover:text-black" />
          </button>
        </div>

        {/* Body scrollable */}
        <div className="p-4 overflow-y-auto max-h-[calc(100vh-110px)] space-y-4">
          
          <FormInput label="ID" placeholder="Ej: PC-01" />
          <FormInput label="Aula" placeholder="Ej: 12" />
          <FormInput label="Docencia" placeholder="Ej: Edificio B" />
          <FormInput label="Fecha" type="date" />
          
          <div>
            <label className="block font-medium text-gray-700 mb-1">Estado</label>
            <select className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500">
              <option>Bueno</option>
              <option>Operativo</option>
              <option>Regular</option>
              <option>En uso</option>
              <option>Revisión</option>
              <option>Mantenimiento</option>
            </select>
          </div>

        </div>

        {/* Footer panel */}
        <div className="p-4 border-t flex justify-end gap-2">
          <button onClick={() => setOpenForm(false)} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">
            Cancelar
          </button>
          <button className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">
            Guardar
          </button>
        </div>
      </div>

    </div>
  );
}

/* Subcomponentes */
function KPI({ title, value }) {
  return (
    <div className="p-6 rounded-xl shadow-lg bg-white border border-gray-200 flex items-center gap-4">
      <div className="text-emerald-600">
        <Filter size={22} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function EstadoBadge({ estado }) {
  const styles = {
    "Bueno": "bg-green-200 text-green-800",
    "Operativo": "bg-green-200 text-green-800",
    "Regular": "bg-yellow-200 text-yellow-800",
    "En uso": "bg-blue-200 text-blue-800",
    "Revisión": "bg-orange-200 text-orange-800",
    "Mantenimiento": "bg-red-200 text-red-800",
  };
  return <span className={`px-3 py-1 rounded-full text-sm font-semibold ${styles[estado]}`}>{estado}</span>;
}

function FormInput({ label, placeholder, type = "text" }) {
  return (
    <div>
      <label className="block font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500"
      />
    </div>
  );
}