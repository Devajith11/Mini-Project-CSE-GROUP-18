import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Auth from './pages/Auth'
import AdmissionForm from './pages/AdmissionForm'

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Auth isRegister={false} />} />
            <Route path="/register" element={<Auth isRegister={true} />} />
            <Route path="/admin/login" element={<Auth isRegister={false} isAdmin={true} />} />
            <Route path="/apply" element={<AdmissionForm />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App