// src/Galeria.jsx
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default function Galeria() {
  const [fotos, setFotos] = useState([]);

  useEffect(() => {
    async function carregarFotos() {
      const { data, error } = await supabase.storage
        .from("fotos-arraia")
        .list("", { limit: 100, sortBy: { column: "created_at", order: "desc" } });

      if (error) {
        console.error("Erro ao listar fotos:", error.message);
      } else {
        setFotos(data);
      }
    }

    carregarFotos();
  }, []);

  function gerarURL(nomeArquivo) {
    return `https://ecfhihpyvludqozrapfi.supabase.co/storage/v1/object/public/fotos-arraia/${nomeArquivo}`;
  }

  return (
  <div style={{ padding: "1rem" }}>
    <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>🎞️ Galeria do Arraiá</h2>
    <div style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "1rem",
      justifyContent: "center"
    }}>
      {fotos.map((foto) => (
        <div key={foto.name} style={{ width: "45%", maxWidth: "200px", textAlign: "center" }}>
          <img
            src={gerarURL(foto.name)}
            alt={foto.name}
            style={{ width: "100%", borderRadius: "8px" }}
          />
          <a href={gerarURL(foto.name)} download style={{ display: "block", marginTop: "0.5rem" }}>
            📥 Baixar
          </a>
        </div>
      ))}
    </div>
  </div>
);

}
