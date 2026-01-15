import "./../styles/navbar.css";
import ThemeToggle from "./ThemeToggle";
import { useNavigate } from "react-router-dom";

export default function Navbar({ active = "home" }) {
  const navigate = useNavigate();

  return (
    <header className="navWrap">
      <nav className="navBar">
        <div className="navLeft">
          <button
            className={`navBtn ${active === "home" ? "active" : ""}`}
            onClick={() => navigate("/")}
          >
            Home
          </button>

          <button
            className={`navBtn ${active === "projects" ? "active" : ""}`}
            onClick={() => navigate("/projects")}
          >
            Projects
          </button>
        </div>

        <div className="navRight">
          <div className="navRight">
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}
