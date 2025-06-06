// src/FogosTestPage.jsx
import FireworksEffect from "./FireworksEffect";

export default function FogosTestPage() {
  return (
    <div style={{
      height: "100vh",
      width: "100vw",
      background: "black",
      position: "relative",
      overflow: "hidden",
    }}>
      <h1 style={{
        color: "white",
        textAlign: "center",
        marginTop: "2rem",
        fontSize: "2rem"
      }}>
        Teste dos Fogos 🎆
      </h1>

      <FireworksEffect />
    </div>
  );
}
