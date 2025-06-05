// src/ApagarFotos.jsx
import { supabase } from "./supabaseClient";

export default function ApagarFotos() {
  async function apagarTudo() {
    const senha = prompt("Digite a senha para apagar as fotos:");

    if (senha !== "arraia2025") {
      alert("❌ Senha incorreta. Ação cancelada.");
      return;
    }

    const { data, error } = await supabase.storage
      .from("fotos-arraia")
      .list("");

    if (error) {
      alert("❌ Erro ao listar arquivos: " + error.message);
      return;
    }

    if (!data.length) {
      alert("✅ Nenhuma foto encontrada.");
      return;
    }

    const arquivos = data.map((foto) => foto.name);
    const { error: erroDelete } = await supabase.storage
      .from("fotos-arraia")
      .remove(arquivos);

    if (erroDelete) {
      alert("❌ Erro ao deletar: " + erroDelete.message);
    } else {
      alert("✅ Todas as fotos foram apagadas!");
    }
  }

  return (
    <div style={{ textAlign: "center", margin: "2rem" }}>
      <button
        onClick={apagarTudo}
        style={{
          backgroundColor: "#dc2626",
          color: "#fff",
          padding: "0.75rem 1.5rem",
          border: "none",
          borderRadius: "8px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        🧨 Apagar Todas as Fotos
      </button>
    </div>
  );
}
