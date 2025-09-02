// Footer.tsx
import { Link } from "react-router-dom";
import { FaInstagram } from "react-icons/fa";
import styles from "./Footer.module.scss";

const footerMenu = [
  { title: "About", url: "/about" },
  { title: "Contact", url: "/contact" },
  { title: "Privacy", url: "/privacy" },
];

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.menu}>
          <ul>
            {footerMenu.map((item) => (
              <li key={item.title}>
                <Link to={item.url}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.social}>
          
          <a href="https://www.instagram.com/fbe.ua/" target="_blank" rel="noreferrer">
            <FaInstagram />
          </a>
          
        </div>

        <div className={styles.copy}>
          © 2025 <a href="mailto:julasweta@ukr.net" className={styles.mail}>
            FlyApp
          </a> Всі права захищені.
        </div>

      </div>
    </footer>
  );
};

export default Footer;
