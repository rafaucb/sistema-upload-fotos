// src/Slideshow.jsx
import { useEffect, useState, useRef } from "react";
import { supabase } from "./supabaseClient";

export default function Slideshow() {
  const [fotos, setFotos] = useState([]);
  const [indiceAtual, setIndiceAtual] = useState(0);
  const nomesAnteriores = useRef([]);

  function gerarURL(nomeArquivo) {
    return `https://ecfhihpyvludqozrapfi.supabase.co/storage/v1/object/public/fotos-arraia/${nomeArquivo}`;
  }

  // ⏱️ Loop automático a cada 5 segundos
  useEffect(() => {
    if (fotos.length === 0) return;

    const intervalo = setInterval(() => {
      setIndiceAtual((prev) => (prev + 1) % fotos.length);
    }, 5000);

    return () => clearInterval(intervalo);
  }, [fotos]);

  // 🔄 Atualiza a lista de fotos a cada 10 segundos
  useEffect(() => {
    async function atualizarFotosPeriodicamente() {
      const { data, error } = await supabase.storage
        .from("fotos-arraia")
        .list("", {
          limit: 1000,
          sortBy: { column: "created_at", order: "desc" }
,
          
        });

      if (error) {
        console.error("Erro ao atualizar fotos:", error.message);
        return;
      }

      const novosNomes = data.map((f) => f.name);
      const nomesAntigos = nomesAnteriores.current;

      const houveMudanca =
        novosNomes.length !== nomesAntigos.length ||
        !novosNomes.every((nome, i) => nome === nomesAntigos[i]);

      if (houveMudanca) {
        nomesAnteriores.current = novosNomes;
        setFotos(data);
        setIndiceAtual(0);

      }
    }

    atualizarFotosPeriodicamente();
    const intervalo = setInterval(atualizarFotosPeriodicamente, 10000);

    return () => clearInterval(intervalo);
  }, []);

  if (fotos.length === 0) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black text-white text-xl">
        Carregando fotos...
      </div>
    );
  }

  return (
    <div style={{
      height: "100vh",
      width: "100vw",
      backgroundColor: "black",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden"
    }}>
      <img
        src={gerarURL(fotos[indiceAtual].name)}
        alt={`Foto ${indiceAtual + 1}`}
        style={{
          maxHeight: "100%",
          maxWidth: "100%",
          objectFit: "contain",
          transition: "all 1s ease-in-out"
        }}
      />
    </div>
  );
}
