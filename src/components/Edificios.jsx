import { Search, Building2 } from "lucide-react";
import { useState } from "react";

export default function Edificios() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-green-700">Edificios</h1>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600" size={20} />
        <input
          type="text"
          placeholder="Buscar edificio..."
          className="w-full pl-12 pr-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-green-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        <div className="p-4 bg-white border rounded-xl shadow flex items-center gap-3">
          <Building2 className="text-green-700" />
          Edificio A
        </div>
      </div>
    </div>
  );
}
