import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Login } from './components/login'
import { Signup } from './components/signup'
import { BrowserRouter, Route, Routes } from 'react-router'
import { User } from './components/userDashboard'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element ={<Login/>} />
          <Route path='/signup' element= {<Signup/>} />
          <Route path='/' element={<User/>} /> 
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
