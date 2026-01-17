import { BrowserRouter, Routes, Route } from "react-router-dom";
import BackgroundCubes from "./components/BackgroundCubes";
import Landing from "./pages/Landing";
import Projects from "./pages/Projects";
import ResumePage from "./pages/ResumePage";
import "./App.css";
import FooterBar from "../src/components/FooterBar";

export default function App() {
  return (
    <BrowserRouter>
      <div className="appShell">
        <BackgroundCubes
          outlineColor="#575757"
          angleDeg={35}
          speed={26}
          fillOpacity={0.05}
          glowRadius={220}
          glowStrength={1.0}
          glowGradient={["#a855f7", "#7c3aed", "#d946ef"]}
          glowGradientLight={["#7c3aed", "#a855f7", "#ec4899"]}
          background="transparent"
        />

        <div className="appContent">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/resume" element={<ResumePage />} />
          </Routes>
        </div>
        <FooterBar />
      </div>
    </BrowserRouter>
  );
}
