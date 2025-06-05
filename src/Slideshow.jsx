// src/Slideshow.jsx
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default function Slideshow() {
  const [fotos, setFotos] = useState([]);
  const [indiceAtual, setIndiceAtual] = useState(0);

  useEffect(() => {
    async function carregarFotos() {
      const { data, error } = await supabase.storage
        .from("fotos-arraia")
        .list("", { limit: 100, sortBy: { column: "created_at", order: "asc" } });

      if (error) {
        console.error("Erro ao listar fotos:", error.message);
      } else {
        setFotos(data);
      }
    }

    carregarFotos();
  }, []);

  useEffect(() => {
    if (fotos.length === 0) return;

    const intervalo = setInterval(() => {
      setIndiceAtual((prev) => (prev + 1) % fotos.length);
    }, 5000); // muda a cada 5 segundos

    return () => clearInterval(intervalo);
  }, [fotos]);

  function gerarURL(nomeArquivo) {
    return `https://ecfhihpyvludqozrapfi.supabase.co/storage/v1/object/public/fotos-arraia/${nomeArquivo}`;
  }

  if (fotos.length === 0) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black text-white text-xl">
        Carregando fotos...
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center">
      <img
  src={gerarURL(fotos[indiceAtual].name)}
  alt={`Foto ${indiceAtual + 1}`}
  style={{
    maxWidth: "100%",
    maxHeight: "90vh",
    objectFit: "contain",
    transition: "all 1s"
  }}
/>

    </div>
  );
}
