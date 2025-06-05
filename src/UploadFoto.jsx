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
    
    <input
      type="file"
      accept="image/*"
      multiple
      onChange={(e) => {
  const files = [...e.target.files];
  setArquivo(files);
  const urls = files.map((file) => URL.createObjectURL(file));
  setPreviews(urls);
}}

      style={{
        padding: "0.75rem",
        borderRadius: "8px",
        border: "1px solid #ccc",
        marginTop: "1rem",
        width: "100%"
      }}
    />
{previews.length > 0 && (
  <div style={{
    marginTop: "1rem",
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    justifyContent: "center"
  }}>
    {previews.map((src, i) => (
      <img
        key={i}
        src={src}
        alt={`preview-${i}`}
        style={{
          width: "100px",
          height: "100px",
          objectFit: "cover",
          borderRadius: "8px"
        }}
      />
    ))}
  </div>
)}

    <button
      onClick={handleUpload}
      style={{
        marginTop: "1.5rem",
        padding: "0.75rem",
        backgroundColor: "#16a34a",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        fontWeight: "bold",
        fontSize: "1rem",
        width: "100%"
      }}
    >
      Enviar Foto
    </button>
    <button
  onClick={limparSelecao}
  style={{
    marginTop: "1rem",
    padding: "0.5rem",
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: "0.95rem",
    width: "100%"
  }}
>
  ❌ Limpar seleção
</button>


    <p style={{ marginTop: "1rem", fontWeight: "bold", color: status.includes("Erro") ? "red" : "green" }}>
      {status}
    </p>
  </div>
);

}
