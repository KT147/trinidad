import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

function NavBar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <div className={`navbar-top ${isOpen ? 'open' : ''}`}>
        <div className="nav-header">
          <Link to="/">
            <img className="nav-logo-mobile" src="/logo.svg" alt="Logo" />
          </Link>
          <button className="hamburger-button" onClick={toggleMenu}>
            {isOpen ? <X size={0} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div className={`navbar ${isOpen ? 'open' : ''}`}>
        <div className="nav-header">
          <Link to="/">
            <img className="nav-logo-desktop" src="/logo.svg" alt="Logo" />
          </Link>
        </div>

        <div className={`nav-links ${isOpen ? 'open' : ''}`}>
        <button className="hamburger-button" onClick={toggleMenu}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link to="/article" className="nav-item">
            <button className="nav-button">
              ARTIKKEL
              <img className="article-img" src="/article.png" alt="Article" />
            </button>
          </Link>
          <br />
          <br />
          <Link to="/table" className="nav-item">
            <button className="nav-button">
              TABEL
              <img className="table-img" src="/table.png" alt="Table" />
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default NavBar;
