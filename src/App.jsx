import './App.css'
import {Route, Routes} from 'react-router-dom'
import { Link } from 'react-router-dom'
import HomePage from './assets/pages/HomePage'
import Table from './assets/pages/Table'
import Article from './assets/pages/Article'

function App() {


  return (
    <div>

      <Link to="/"><button>Home</button></Link>
      <Link to="/table"><button>TABEL</button></Link>
      <Link to="/article"><button>ARTIKKEL</button></Link>
      
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/table" element={<Table/>}/>
        <Route path="/article" element={<Article/>}/>
      </Routes>

    </div>
  )
}

export default App
