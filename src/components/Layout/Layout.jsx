import React from "react"
import { Outlet } from "react-router-dom"


export const Layout = () => {
  return (
    <div>
      <main>
        <Outlet />
      </main>
      <footer>
        <p>2025</p>
      </footer>
    </div>
  )
}