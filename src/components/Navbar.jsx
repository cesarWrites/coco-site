import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';
import logo from "../assets/Coco-Logo.png"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef();

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="navbar-container">
      <nav className="navbar">
        <div className="navbar-inner">
          {/* Logo + site name vertically stacked */}
          <div className="logo-container">
            <a href="/">
            <img
              src={logo.src}
              alt="Logo"
              className="logo"
            />
            </a>
          </div>

          {/* Navigation Links (desktop) */}
          <div className="nav-links" ref={dropdownRef}>
            {/* <div className="nav-item">
            </div>  */}
            {/* <Link href="/politics">News and Politics</Link> */}
            <Link href="/about-us">About us</Link>
            <Link href="/advertising">Advertising</Link>
            
            {/* <Link href="/national-news">News and Politics</Link> */}
            <div className="nav-item">
              <button onClick={() => toggleDropdown('news')}>News and Politics</button>
              {openDropdown === 'news' && (
                <div className="dropdown">
                  <Link href="/news" style={{color: "#000000"}}>News</Link>
                  <Link href="/politics" style={{color: "#000000"}}>Politics</Link>
                </div>
              )}
            </div>
            {/* <Link href="/business">Business</Link> */}
            <Link href="/business">Business</Link>
            <div className="nav-item">
              <button onClick={() => toggleDropdown('ent')}>Entertainment and Sports</button>
              {openDropdown === 'ent' && (
                <div className="dropdown">
                  <Link href="/entertainment" style={{color: "#000000"}}>Entertainment</Link>
                  <Link href="/sports" style={{color: "#000000"}}>Sports</Link>
                </div>
              )}
            </div>
            {/* <Link href="/entertainment">Sports and Entertainment</Link> */}
            <Link href="/health">Health and Wellness</Link>
            {/* <Link href="/sports">Sports</Link> */}
            <Link href="/reels">Reels</Link>
            {/* <Link href="/classifieds">Classifieds</Link> */}
          </div>

          {/* Mobile Toggle */}
          <div className="mobile-toggle">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="mobile-nav">
            <Link href="/about-us">About us</Link>
            <Link href="/advertising">Advertising</Link>
            <details>
              <summary>News and Politics</summary>
              <Link href="/national-news">News</Link>
              <Link href="/politics">Politics</Link>
            </details>
            <Link href="/business">Business</Link>
            {/* <Link href="/business" onClick={() => setIsOpen(false)}>Business</Link> */}
            <details>
              <summary>Entertainment and Sports</summary>
              <Link href="/entertainment">Entertainment</Link>
              <Link href="/sports">Sports</Link>
            </details>
            <Link href="/health">Health and Wellness</Link>
            {/* <Link href="/sports" onClick={() => setIsOpen(false)}>Sports</Link> */}
            <Link href="/reels">Reels</Link>
          </div>
        )}
      </nav>
    </div>
  );
}
