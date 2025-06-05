// src/UploadFoto.jsx
import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function UploadFoto() {
    const [arquivo, setArquivo] = useState([]);

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


  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>📸 Envie sua foto do Arraiá!</h2>
      <input type="file" accept="image/*" multiple onChange={(e) => setArquivo([...e.target.files])} />

      <br /><br />
      <button onClick={handleUpload}>Enviar Foto</button>
      <p>{status}</p>
    </div>
  );
}
