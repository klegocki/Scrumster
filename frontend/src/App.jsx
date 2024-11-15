import Login from './pages/Login'
import Register from './pages/Register'
import MainApplication from './pages/MainApplication'
import NoPage from './pages/NoPage'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
function App() {


  return (
    <>
      <div>
        <BrowserRouter>
          <Routes>
            <Route index element={<Login></Login>}></Route>
            <Route path="/login" element={<Login></Login>}></Route>
            <Route path="/register" element={<Register></Register>}></Route>
            <Route path="*" element={<NoPage/>}></Route>
            <Route path="/app/dashboard" element={<MainApplication></MainApplication>}></Route>

          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
