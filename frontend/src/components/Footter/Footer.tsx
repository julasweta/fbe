import { Link } from "react-router-dom";
import { FaInstagram } from "react-icons/fa";
import styles from "./Footer.module.scss";
import GoogleRatingBadge from "./GoogleRatingBadge";

const footerMenu = [
  { title: "About", url: "/about" },
  { title: "Contact", url: "/contact" },
  { title: "Privacy", url: "/privacy" },
  { title: "ReturnPolicy", url: "/return-policy" },
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
          © {new Date().getFullYear()}{" "}
          <a href="mailto:office.fly.app@gmail.com" className={styles.mail}>
            FlyApp
          </a>{" "}
          Всі права захищені.
        </div>

        {/* Контейнер для бейджу */}
        <GoogleRatingBadge />
      </div>
    </footer>
  );
};

export default Footer;
