// src/Slideshow.jsx
import { useEffect, useState, useRef } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Slideshow() {
  const [fotos, setFotos] = useState([]);
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [telaCheia, setTelaCheia] = useState(false);
  const nomesAnteriores = useRef([]);
  const navigate = useNavigate();

  const estiloBotao = {
    padding: "10px 16px",
    background: "#fff",
    color: "#000",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
  };

  function gerarURL(nomeArquivo) {
    return `https://ecfhihpyvludqozrapfi.supabase.co/storage/v1/object/public/fotos-arraia/${nomeArquivo}`;
  }

  useEffect(() => {
    if (fotos.length === 0 || pausado) return;
    const intervalo = setInterval(() => {
      setIndiceAtual((prev) => (prev + 1) % fotos.length);
    }, 5000);
    return () => clearInterval(intervalo);
  }, [fotos, pausado]);

  useEffect(() => {
    async function atualizarFotosPeriodicamente() {
      const { data, error } = await supabase.storage
        .from("fotos-arraia")
        .list("", {
          limit: 1000,
          sortBy: { column: "created_at", order: "desc" },
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

  useEffect(() => {
    function aoMudarFullscreen() {
      const estaFullscreen = document.fullscreenElement != null;
      setTelaCheia(estaFullscreen);
    }

    document.addEventListener("fullscreenchange", aoMudarFullscreen);
    return () => document.removeEventListener("fullscreenchange", aoMudarFullscreen);
  }, []);

  if (fotos.length === 0) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black text-white text-xl">
        Carregando fotos...
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "black",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Imagem ocupando o centro */}
      <div
        style={{
          height: "calc(100vh - 140px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={gerarURL(fotos[indiceAtual].name)}
          alt={`Foto ${indiceAtual + 1}`}
          style={{
            maxHeight: "100%",
            maxWidth: "100%",
            objectFit: "contain",
            transition: "all 1s ease-in-out",
          }}
        />
      </div>

      {/* Contador */}
      <div
        style={{
          color: "white",
          fontSize: "1.2rem",
          fontFamily: "monospace",
          marginBottom: "4px",
        }}
      >
        📸 Mostrando {indiceAtual + 1} / {fotos.length}
      </div>

      {/* Botões fora da imagem */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          justifyContent: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <button onClick={() => setIndiceAtual((prev) => (prev - 1 + fotos.length) % fotos.length)} style={estiloBotao}>
          ⬅️ Voltar
        </button>
        <button onClick={() => setPausado((prev) => !prev)} style={estiloBotao}>
          {pausado ? "▶️ Retomar" : "⏸️ Pausar"}
        </button>
        <button onClick={() => setIndiceAtual((prev) => (prev + 1) % fotos.length)} style={estiloBotao}>
          Avançar ➡️
        </button>
        <button
          onClick={() => {
            const el = document.documentElement;
            if (!telaCheia && el.requestFullscreen) {
              el.requestFullscreen();
            } else if (telaCheia && document.exitFullscreen) {
              document.exitFullscreen();
            }
          }}
          style={estiloBotao}
        >
          {telaCheia ? "❌ Sair Tela Cheia" : "🖥️ Tela Cheia"}
        </button>
        <button onClick={() => navigate("/sorteio")} style={estiloBotao}>
          🎁 Sortear
        </button>
      </div>
    </div>
  );
}
