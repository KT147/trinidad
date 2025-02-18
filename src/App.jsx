import './App.css'
import "./assets/pages/navbar.css"
import {Route, Routes} from 'react-router-dom'
import HomePage from './assets/pages/HomePage'
import Table from './assets/pages/Table'
import Article from './assets/pages/Article'
import NavBar from './assets/pages/NavBar'

function App() {


  return (
    <div>
      
      <div className='deco-pics'>
        <img className='deco-left' src="/bg-deco-left.svg"/>
        <img className='deco-right' src="/bg-deco-right.svg"/>
      </div>

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
