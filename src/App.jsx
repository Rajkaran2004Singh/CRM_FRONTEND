import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Customers from "./components/Customers.jsx"
import Campaigns from "./components/Campaigns.jsx"
import AiTools from "./components/AiTools.jsx"
import Dashboard from "./components/Dashboard.jsx"
import Navbar from './components/Navbar.jsx'
import Segments from './components/Segments.jsx'
import './App.css'

function App() {

  return (
    <>

      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/ai" element={<AiTools />} />
          <Route path="/segments" element={<Segments />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
