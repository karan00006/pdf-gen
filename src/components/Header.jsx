// import { useState } from 'react'
import logo from '../assets/logo1.jpg';
import '../App.css'


function Header() {

  return (
    <>
      <header className="header py-4 bg-dark">
        <div className="container">
          <div className="header-inner">
            <div className="logo">
              <img src={logo} alt="LOGO" width={40} height="auto"/>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
