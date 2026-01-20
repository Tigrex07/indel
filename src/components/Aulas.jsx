import { Search, GraduationCap } from "lucide-react";
import { useState } from "react";

export default function Aulas() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-green-700">Aulas</h1>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600" size={20} />
        <input
          type="text"
          placeholder="Buscar aula..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-green-400"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white border rounded-xl shadow flex items-center gap-3">
          <GraduationCap className="text-green-700" size={28} />
          Aula 101 - Edificio A
        </div>
      </div>
    </div>
  );
}
