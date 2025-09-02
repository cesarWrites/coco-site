import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaXTwitter,
  FaPhone,
  FaWhatsapp,
  FaEnvelope,
  FaLocationPin
} from "react-icons/fa6";
import logo from "../assets/Coco-Logo.png";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
       
        <div className="footer-column">
          <div className="footer-logo">
            <img  src={logo.src} alt="MediaSite Logo" className="footer-logo-img" />
          </div>
          <p><FaEnvelope/> <a href="mailto:info@mediasite.com" style={{ color: "#ffffff"}}>info@cocomedia.co.ke</a></p>
          <p><FaPhone/> Phone: 0114 111 000 <FaWhatsapp color="green"/></p>
          <p><FaLocationPin/> Adress:  Imarika Plaza Kilifi, Coast, Kenya. </p> 
        </div>

        <div className="footer-column">
          <h4>Frequency</h4>
          <ul className="footer-links">
            <li><a href="#">Kilifi-98.9</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Follow Us</h4>
          <div className="footer-socials">
            <a href="https://x.com/Cocofmradio" aria-label="X (Twitter)"><FaXTwitter /></a>
            <a href="https://www.instagram.com/cocofm_radio/#" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://www.youtube.com/@cocofmradio" aria-label="YouTube"><FaYoutube /></a>
            <a href="https://www.facebook.com/people/Coco-FM/61569878042472/" aria-label="Facebook"><FaFacebookF /></a>
          </div>
          <p>© {new Date().getFullYear()} Coco<span style={{color: "green"}}>fm</span>All rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}
