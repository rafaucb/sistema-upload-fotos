// src/SorteioPage.jsx
import { useEffect, useRef, useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";
import FireworksEffect from "./FireworksEffect";

export default function SorteioPage() {
  const [fotos, setFotos] = useState([]);
  const [indice, setIndice] = useState(0);
  const [sorteando, setSorteando] = useState(false);
  const [sorteioFinalizado, setSorteioFinalizado] = useState(false);
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
    }
  }

  function iniciarSorteio() {
    if (sorteando || fotos.length === 0) return;
    setSorteando(true);
    setSorteioFinalizado(false);

    const totalPassos = 57;
    let passo = 0;
    let velocidade = 50;
    let indiceAtual = Math.floor(Math.random() * fotos.length);

    function executarPasso() {
      if (passo < totalPassos - 1) {
        indiceAtual = (indiceAtual + 1) % fotos.length;
        setIndice(indiceAtual);
        tocarBip();
        passo++;
        velocidade += 20;
        setTimeout(executarPasso, velocidade);
      } else {
        setTimeout(() => {
          indiceAtual = (indiceAtual + 1) % fotos.length;
          setIndice(indiceAtual);
          tocarBip();
          setSorteando(false);
          setSorteioFinalizado(true);
        }, velocidade);
      }
    }

    setTimeout(executarPasso, 300);
  }

  return (
  <div style={{
    position: "relative", // <- isso é novo
    height: "100vh",
    width: "100vw",
    background: "black",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px"
  }}>
    <h1 style={{ color: "white", fontSize: "2rem", marginBottom: "1rem" }}>🎯 Sorteio do Arraiá</h1>

    <p style={{ color: "#facc15", marginBottom: "1rem", maxWidth: "90vw", textAlign: "center" }}>
      ⚠️ Só serão aceitas fotos com no máximo <strong>3 pessoas</strong>.<br />
      Se houver mais de uma pessoa, a decisão sobre o prêmio deverá ser feita entre elas.
    </p>

    {fotos.length > 0 && (
      <img
        src={gerarURL(fotos[indice].name)}
        alt="Foto"
        style={{
          maxHeight: "60vh",
          maxWidth: "90vw",
          borderRadius: "12px",
          border: sorteioFinalizado ? "4px solid #facc15" : "none",
          boxShadow: sorteioFinalizado ? "0 0 20px #facc15" : "none",
          transition: "all 0.3s ease",
        }}
      />
    )}

    {sorteioFinalizado && (
      <div style={{ color: "#facc15", marginTop: "1.5rem", fontSize: "1.3rem", textAlign: "center" }}>
        🥳 <strong>Parabéns!</strong> Essa é a foto sorteada!<br />
        📢 Caso tenha mais de uma pessoa, decidam entre vocês quem ficará com o prêmio.
      </div>
    )}

    <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
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

    {/* Fogos de artifício no topo da tela */}
    {!sorteando && sorteioFinalizado && <FireworksEffect />}
  </div>
);

}
