// src/App.js
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UploadFoto from "./UploadFoto";
import Galeria from "./Galeria";
import Slideshow from "./Slideshow"; // vamos criar esse a seguir
//import ApagarFotos from "./ApagarFotos";
import ApagarFotosPage from "./ApagarFotosPage";
import SorteioPage from "./SorteioPage";
import FogosTestPage from "./FogosTestPage";




function App() {
  return (
    <Router>
      <nav style={{ textAlign: "center", margin: "1rem" }}>
        <Link to="/" style={{ marginRight: "1rem" }}>📷 Enviar Fotos</Link>
                <Link to="/galeria" style={{ marginRight: "1rem", fontWeight: "bold", fontSize: "1.2rem" }}>📸 Ver Fotos</Link>

        <Link to="/slideshow">📺 Modo TV</Link>
      </nav>

      <Routes>
        <Route path="/" element={
          <div style={{ textAlign: "center" }}>
            <h1>🎉 Arraiá 2025</h1>
            <UploadFoto />
          </div>
        } />
        <Route path="/galeria" element={<Galeria />} />
        <Route path="/slideshow" element={<Slideshow />} />
        <Route path="/apagar" element={<ApagarFotosPage />} />
<Route path="/sorteio" element={<SorteioPage />} />
<Route path="/fogos" element={<FogosTestPage />} />

      </Routes>
    </Router>
  );
}

export default App;
