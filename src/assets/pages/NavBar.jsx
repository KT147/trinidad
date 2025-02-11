import { Link } from 'react-router-dom'

function NavBar() {
  return (
    <div className='navbar'>
        <Link to="/"><img className='nav-logo'src="/logo.svg"/></Link>
        <Link to="/article"><button className='nav-button'>ARTIKKEL <img className='article-img' src="/article.png" alt="" /></button></Link>
        <br /><br />
        <Link to="/table"><button className='nav-button'>TABEL <img className='table-img' src="table.png" alt="" /></button></Link>
    </div>
  )
}

export default NavBar