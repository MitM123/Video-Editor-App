import { Route, Routes } from 'react-router'
import Home from './Pages/Home'
import './App.css'
import Editor from './Pages/Editor'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor" element={<Editor />} />
      </Routes>
    </>
  )
}

export default App
