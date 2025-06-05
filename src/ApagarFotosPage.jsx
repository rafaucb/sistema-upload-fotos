// src/pages/ApagarFotosPage.jsx
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default function ApagarFotosPage() {
  const [fotos, setFotos] = useState([]);
  const [selecionadas, setSelecionadas] = useState([]);

  useEffect(() => {
    async function carregarFotos() {
      const { data, error } = await supabase.storage
        .from("fotos-arraia")
        .list("", {
          limit: 100,
          sortBy: { column: "created_at", order: "desc" }
        });

      if (error) {
        alert("Erro ao carregar fotos: " + error.message);
      } else {
        setFotos(data);
      }
    }

    carregarFotos();
  }, []);

  function gerarURL(nomeArquivo) {
    return `https://ecfhihpyvludqozrapfi.supabase.co/storage/v1/object/public/fotos-arraia/${nomeArquivo}`;
  }

  function toggleSelecionada(nome) {
    setSelecionadas((prev) =>
      prev.includes(nome)
        ? prev.filter((n) => n !== nome)
        : [...prev, nome]
    );
  }

  async function apagarSelecionadas() {
    const senha = prompt("Digite a senha para apagar as fotos selecionadas:");
    if (senha !== "arraia2025") {
      alert("❌ Senha incorreta.");
      return;
    }

    if (selecionadas.length === 0) {
      alert("Selecione pelo menos uma foto.");
      return;
    }

    const { error } = await supabase.storage
      .from("fotos-arraia")
      .remove(selecionadas);

    if (error) {
      alert("❌ Erro ao apagar: " + error.message);
    } else {
      alert("✅ Fotos apagadas!");
      setFotos(fotos.filter((f) => !selecionadas.includes(f.name)));
      setSelecionadas([]);
    }
  }

  async function apagarTodas() {
    const senha = prompt("Digite a senha para apagar TODAS as fotos:");
    if (senha !== "arraia2025") {
      alert("❌ Senha incorreta.");
      return;
    }

    const nomes = fotos.map((f) => f.name);
    const { error } = await supabase.storage
      .from("fotos-arraia")
      .remove(nomes);

    if (error) {
      alert("❌ Erro ao apagar: " + error.message);
    } else {
      alert("✅ Todas as fotos foram apagadas!");
      setFotos([]);
      setSelecionadas([]);
    }
  }

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>🗑️ Apagar Fotos do Arraiá</h2>
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "1rem",
        justifyContent: "center",
        marginTop: "2rem"
      }}>
        {fotos.map((foto) => (
          <div key={foto.name} style={{ position: "relative", width: "120px" }}>
            <img
              src={gerarURL(foto.name)}
              alt={foto.name}
              style={{ width: "100%", borderRadius: "8px" }}
            />
            <input
              type="checkbox"
              checked={selecionadas.includes(foto.name)}
              onChange={() => toggleSelecionada(foto.name)}
              style={{ position: "absolute", top: 8, left: 8 }}
            />
          </div>
        ))}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <button
          onClick={apagarSelecionadas}
          style={{
            marginRight: "1rem",
            padding: "0.75rem 1.5rem",
            backgroundColor: "#f97316",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold"
          }}
        >
          🧨 Apagar Selecionadas
        </button>

        <button
          onClick={apagarTodas}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#dc2626",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold"
          }}
        >
          🔥 Apagar Todas
        </button>
      </div>
    </div>
  );
}
