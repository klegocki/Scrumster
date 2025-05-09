import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import NoPage from './pages/NoPage'
import ProjectDashboard from './pages/ProjectDashboard'
import SprintDashboard from './pages/SprintDashboard'
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
            <Route path="/app/projects" element={<Dashboard></Dashboard>}></Route>
            <Route path="/app/project/:projectId" element={<ProjectDashboard></ProjectDashboard>}></Route>
            <Route path="/app/project/:projectId/sprint/:sprintId" element={<SprintDashboard></SprintDashboard>}></Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
