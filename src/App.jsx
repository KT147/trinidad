import './App.css'
import {Route, Routes} from 'react-router-dom'
import HomePage from './assets/pages/HomePage'
import Table from './assets/pages/Table'
import Article from './assets/pages/Article'
import NavBar from './assets/pages/NavBar'

function App() {


  return (
    <div>

      <NavBar/>

      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/table" element={<Table/>}/>
        <Route path="/article" element={<Article/>}/>
      </Routes>

    </div>
  )
}

export default App
