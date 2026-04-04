import React from 'react'
import { Link } from 'react-router-dom'
import NotificationBell from '../Components/NotificationBell.jsx'
function Navbar() {
  return (
    <div>
      <h2 className='font-bold text-4xl p-7 mt-2 pt-0'>Fornix</h2>
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 ">

        <div className="bg-orange-500 rounded-full shadow-lg px-10 py-4">
          <ul className="flex gap-8 items-center">
            <li>
              <Link to="/" className="text-white font-semibold hover:text-gray-500 transition px-4 py-1 rounded-full hover:bg-white/20 transition ">
            
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-white font-semibold hover:text-gray-500  px-4 py-1 rounded-full hover:bg-white/20 transition">
                About
              </Link>
            </li>
            <li>
              <Link to="/courses" className="text-white font-semibold hover:text-gray-500  px-4 py-1 rounded-full hover:bg-white/20 transition">
                Courses
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-white font-semibold hover:text-gray-500  px-4 py-1 rounded-full hover:bg-white/20 transition">
                Contact
              </Link>
            </li>
            <div className="flex items-center gap-6">
             <li>
              <NotificationBell />
            </li>
            </div>

          </ul>
        </div>
      </nav>

    </div>
  )
}

export default Navbar
