// src/SorteioPage.jsx
import { useEffect, useRef, useState } from "react";
import { supabase } from "./supabaseClient";

export default function SorteioPage() {
  const [fotos, setFotos] = useState([]);
  const [indice, setIndice] = useState(0);
  const [sorteando, setSorteando] = useState(false);
  const bip = useRef(null);

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

  function iniciarSorteio() {
    if (sorteando || fotos.length === 0) return;
    setSorteando(true);

    // começa de um índice aleatório
    setIndice(Math.floor(Math.random() * fotos.length));

    let velocidade = 50;
    let passo = 0;
    const maxPassos = 50;

    function tocarBip(passoAtual) {
      if (bip.current) {
        bip.current.pause();
        bip.current.currentTime = 0;
        bip.current.playbackRate = Math.max(0.5, 2 - (passoAtual / maxPassos) * 1.5);
        bip.current.play().catch(() => {});
      }
    }

    function loop() {
      const proximo = (prev) => (prev + 1) % fotos.length;
      setIndice((prev) => proximo(prev));
      tocarBip(passo);

      passo++;
      velocidade += 20;

      if (passo < maxPassos) {
        setTimeout(loop, velocidade);
      } else {
        // último passo sincronizado com bip e imagem
        setTimeout(() => {
          setIndice((prev) => {
            const final = (prev + 1) % fotos.length;
            tocarBip(maxPassos);
            return final;
          });
          setTimeout(() => setSorteando(false), 600);
        }, velocidade);
      }
    }

    setTimeout(loop, 300); // suspense inicial
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

      <button
        onClick={iniciarSorteio}
        disabled={sorteando}
        style={{
          marginTop: "2rem",
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

      <audio ref={bip} src="/bip.mp3" preload="auto" />
    </div>
  );
}
