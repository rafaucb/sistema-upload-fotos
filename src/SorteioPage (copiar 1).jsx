// src/SorteioPage.jsx
import { useEffect, useRef, useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";

export default function SorteioPage() {
  const [fotos, setFotos] = useState([]);
  const [indice, setIndice] = useState(0);
  const [sorteando, setSorteando] = useState(false);
  const bip = useRef(null);
  const navigate = useNavigate();

  function gerarURL(nome) {
    return `https://ecfhihpyvludqozrapfi.supabase.co/storage/v1/object/public/fotos-arraia/${nome}`;
  }

  useEffect(() => {
    async function carregarFotos() {
      const { data, error } = await supabase.storage
        .from("fotos-arraia")
        .list("", { limit: 1000, sortBy: { column: "created_at", order: "desc" } });
      if (!error) setFotos(data);
    }
    carregarFotos();
  }, []);

  function tocarBip() {
    if (bip.current) {
      bip.current.pause();
      bip.current.currentTime = 0;
      bip.current.playbackRate = 1;
      bip.current.play().catch(() => {});
      console.log("🔊 Bip tocado");
    }
  }

  function iniciarSorteio() {
    if (sorteando || fotos.length === 0) return;
    setSorteando(true);

    const totalPassos = 57;
    let passo = 0;
    let velocidade = 50;
    let indiceAtual = Math.floor(Math.random() * fotos.length);

    console.log("🌀 Iniciando sorteio...");
    console.log("🎲 Índice inicial aleatório:", indiceAtual);

    function executarPasso() {
      if (passo < totalPassos - 1) {
        indiceAtual = (indiceAtual + 1) % fotos.length;
        setIndice(indiceAtual);
        tocarBip();

        console.log(`🔁 Passo ${passo + 1}/${totalPassos} | índice: ${indiceAtual} | delay: ${velocidade}ms`);

        passo++;
        velocidade += 20;
        setTimeout(executarPasso, velocidade);
      } else {
        // Último bip + imagem final juntos
        setTimeout(() => {
          indiceAtual = (indiceAtual + 1) % fotos.length;
          setIndice(indiceAtual);
          tocarBip();
          console.log("🎯 Imagem final mostrada no último bip.");
          setSorteando(false);
        }, velocidade);
      }
    }

    setTimeout(executarPasso, 300); // suspense inicial
  }

  return (
    <div style={{ height: "100vh", width: "100vw", background: "black", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <h1 style={{ color: "white", fontSize: "2rem", marginBottom: "1rem" }}>🎯 Sorteio do Arraiá</h1>

      {fotos.length > 0 && (
        <img
          src={gerarURL(fotos[indice].name)}
          alt="Foto"
          style={{ maxHeight: "60vh", maxWidth: "90vw", borderRadius: "12px", transition: "all 0.2s ease" }}
        />
      )}

      <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
        <button
          onClick={iniciarSorteio}
          disabled={sorteando}
          style={{
            padding: "1rem 2rem",
            fontSize: "1.2rem",
            backgroundColor: sorteando ? "#888" : "#facc15",
            color: "black",
            border: "none",
            borderRadius: "12px",
            cursor: sorteando ? "not-allowed" : "pointer",
          }}
        >
          {sorteando ? "Sorteando..." : "🎁 Sortear"}
        </button>

        <button
          onClick={() => navigate("/")}
          style={{
            padding: "1rem 2rem",
            fontSize: "1.2rem",
            backgroundColor: "#ccc",
            color: "black",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
          }}
        >
          🔙 Voltar
        </button>
      </div>

      <audio ref={bip} src="/bip.mp3" preload="auto" />
    </div>
  );
}
