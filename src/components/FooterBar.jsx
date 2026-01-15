import "./../styles/footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faLinkedinIn, faGithub } from "@fortawesome/free-brands-svg-icons";

export default function FooterBar() {
  const year = new Date().getFullYear();
  const open = (url) => window.open(url, "_blank", "noopener,noreferrer");

  return (
    <footer className="footerBar">
      <div className="footerInner">
        <div className="footerLeft">© {year} Aviv Tenenbaum Haddar</div>

        <div className="footerLinks">
          <button
            className="footerIconBtn"
            onClick={() => open("https://www.linkedin.com/in/aviv-tenenbaum-haddar-0321b821b")}
            aria-label="LinkedIn"
            title="LinkedIn"
          >
            <FontAwesomeIcon icon={faLinkedinIn} />
          </button>

          <button
            className="footerIconBtn"
            onClick={() => open("https://github.com/SwaggZ")}
            aria-label="GitHub"
            title="GitHub"
          >
            <FontAwesomeIcon icon={faGithub} />
          </button>

          <button
            className="footerIconBtn"
            onClick={() => open("mailto:Avivdth@gmail.com")}
            aria-label="Email"
            title="Email"
          >
            <FontAwesomeIcon icon={faEnvelope} />
          </button>
        </div>
      </div>
    </footer>
  );
}
