import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import FormularioPage from './pages/FormularioPage'
import SucessoPage from './pages/SucessoPage'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userData, setUserData] = useState(null)
  const [submittedData, setSubmittedData] = useState(null)

  const handleLogin = (cpf, dataNascimento) => {
    // Simulação de autenticação - em um sistema real, seria validado no backend
    setIsAuthenticated(true)
    setUserData({ cpf, dataNascimento })
  }

  const handleFormSubmit = (formData) => {
    setSubmittedData(formData)
  }

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ?
                <Navigate to="/formulario" replace /> :
                <LoginPage onLogin={handleLogin} />
            }
          />
          <Route
            path="/formulario"
            element={
              isAuthenticated ?
                <FormularioPage
                  userData={userData}
                  onSubmit={handleFormSubmit}
                /> :
                <Navigate to="/" replace />
            }
          />
          <Route
            path="/sucesso"
            element={
              submittedData ?
                <SucessoPage data={submittedData} /> :
                <Navigate to="/" replace />
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App

