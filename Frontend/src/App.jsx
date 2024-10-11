import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  return (
    <>
      <h2>Video player streaming</h2>
      <video controls height={500}>
        <source src="http://localhost:3000/streamfile" type="video/mp4"></source>
      </video>
    </>
  )
}

export default App
