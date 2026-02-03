import { useState } from "react";
import EdificiosSection from "./EdificiosSection";
import AulasSection from "./AulasSection";

export default function Edificios() {
  const [edificioSeleccionado, setEdificioSeleccionado] = useState(null);

  return (
    <>
      {!edificioSeleccionado ? (
        <EdificiosSection
          onOpenBuilding={(idEdificio) =>
            setEdificioSeleccionado(idEdificio)
          }
        />
      ) : (
        <AulasSection
          idEdificio={edificioSeleccionado}
          onBack={() => setEdificioSeleccionado(null)}
        />
      )}
    </>
  );
}
