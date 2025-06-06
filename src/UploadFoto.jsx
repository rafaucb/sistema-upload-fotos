// src/UploadFoto.jsx
import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function UploadFoto() {
  const [arquivo, setArquivo] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [status, setStatus] = useState("");

  async function handleUpload() {
    if (!arquivo.length) {
      setStatus("Selecione pelo menos uma foto.");
      return;
    }

    setStatus("Enviando...");

    for (const file of arquivo) {
      const nomeArquivo = `${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from("fotos-arraia")
        .upload(nomeArquivo, file);

      if (error) {
        console.error("Erro ao enviar:", error.message);
        setStatus("Erro ao enviar uma ou mais fotos.");
        return;
      }
    }

    setStatus("✅ Todas as fotos foram enviadas!");
  }

  function limparSelecao() {
    setArquivo([]);
    setPreviews([]);
    setStatus("");
  }

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "1rem", textAlign: "center" }}>
      <h2>📸 Envie sua foto do Arraiá!</h2>

      {/* Botão de seleção de arquivos acessível */}
      <label
        htmlFor="fileInput"
        style={{
          display: "block",
          marginTop: "1.5rem",
          padding: "1rem",
          backgroundColor: "#2563eb",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "1.2rem",
          borderRadius: "10px",
          cursor: "pointer",
          width: "100%",
        }}
      >
        📷 Escolha suas fotos
      </label>

      <input
        id="fileInput"
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          const files = [...e.target.files];
          setArquivo(files);
          const urls = files.map((file) => URL.createObjectURL(file));
          setPreviews(urls);
        }}
        style={{ display: "none" }}
      />

      {/* Previews */}
      {previews.length > 0 && (
        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          {previews.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`preview-${i}`}
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          ))}
        </div>
      )}

      {/* Botões de ação */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}>
        <button
          onClick={handleUpload}
          style={{
            padding: "1rem",
            backgroundColor: "#16a34a",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontWeight: "bold",
            fontSize: "1.1rem",
            width: "100%",
          }}
        >
          ✅ Enviar Fotos
        </button>

        <button
          onClick={limparSelecao}
          style={{
            padding: "1rem",
            backgroundColor: "#dc2626",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontWeight: "bold",
            fontSize: "1.1rem",
            width: "100%",
          }}
        >
          ❌ Limpar Seleção
        </button>
      </div>

      {/* Status */}
      <p
        style={{
          marginTop: "1rem",
          fontWeight: "bold",
          color: status.includes("Erro") ? "red" : "green",
        }}
      >
        {status}
      </p>
    </div>
  );
}
