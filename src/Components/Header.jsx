import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, logoutUser } from "../redux/slices/authSlice";
import { selectUserProfile } from "../redux/slices/userSlice";
import { FiTarget } from "react-icons/fi";
import logo from "../assets/FORNIX Final Logo_transparent.png";
import NotificationBell from "../Components/NotificationBell";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const userProfile = useSelector(selectUserProfile);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);

  const userName = userProfile?.full_name || user?.full_name || user?.name || 'User';
  const firstName = userName.split(' ')[0];

  // Load profile picture from userProfile or localStorage
  useEffect(() => {
    const userId = user?.user_id || user?.id || user?.uuid;
    if (userId) {
      const localStorageKey = `profile_picture_${userId}`;
      const savedPicture = userProfile?.profile_picture || localStorage.getItem(localStorageKey);
      setProfilePictureUrl(savedPicture);
    }
  }, [user, userProfile]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsCoursesOpen(false);
  };

  const courses = [
    { to: '/courses/amc', label: 'AMC' },
    // { to: '/courses/neet-ug', label: 'NEET UG' },
    { to: '/courses/neet-pg', label: 'NEET PG' },
    { to: '/courses/FMGE', label: 'FMGE' },
    { to: '/courses/plab', label: 'PLAB' },
  ];

  return (
    <>
      <header className="fixed top-2 sm:top-4 left-1/2 -translate-x-1/2 z-50 w-[97%] sm:w-[95%] max-w-7xl">
        <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-full px-3 sm:px-8 py-1.5 sm:py-3 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 shrink-0">
            <img src={logo} alt="Fornix Logo" className="h-10 sm:h-16 w-auto p-0 m-0 sm:mr-10 object-contain" />
            {/* <span className="text-2xl font-bold text-gray-800">FORNIX</span> */}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex bg-orange-500 rounded-full px-8 py-3 shadow-lg shadow-orange-500/20">
            <ul className="flex gap-8 text-white font-medium items-center">
              <li>
                <Link to="/" className="relative group py-2">
                  Home
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="relative group py-2">
                  About
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>

              {/* COURSES DROPDOWN */}
              <li className="relative group py-2">
                <span className="cursor-pointer hover:text-orange-100 transition-colors flex items-center gap-1">
                  Courses <span className="text-[10px] transition-transform group-hover:rotate-180">▼</span>
                </span>

                <div className="absolute top-full left-0 mt-4 bg-white text-gray-800 rounded-xl shadow-xl w-56 py-3 
                    opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0
                    transition-all duration-300 z-50 border border-gray-100">
                  {courses.map((course) => (
                    <Link
                      key={course.to}
                      to={course.to}
                      className="block px-6 py-2.5 hover:bg-orange-50 hover:text-orange-600 transition-colors font-medium text-sm"
                    >
                      {course.label}
                    </Link>
                  ))}
                </div>
              </li>

              {/* <li>
                <Link to="/pricingPage" className="relative group py-2">
                  Pricing Plan
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li> */}

              <li>
                <Link to="/contact" className="relative group py-2">
                  Contact
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>


            </ul>
          </nav>

          {/* Desktop Login/Profile Section */}
          {user ? (
            <div className="hidden md:flex items-center gap-4">
              <NotificationBell />
              <div className="relative group">
                <button
                  className="flex items-center gap-2 bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-full transition-all duration-300 border border-orange-200"
                >
                  {profilePictureUrl ? (
                    <img
                      src={profilePictureUrl}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-linear-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {firstName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-gray-700 font-semibold text-sm max-w-[100px] truncate inline-block align-bottom">
                    {firstName}
                  </span>
                  <svg className="w-4 h-4 text-gray-500 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Profile Dropdown */}
                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-50 border border-gray-100">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-900 truncate">{userName}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email || user.identifier || ''}</p>
                  </div>

                  <div className="py-2">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      Dashboard
                    </Link>

                  </div>

                  <div className="border-t border-gray-100 pt-2 pb-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:block bg-orange-500 text-white px-8 py-2.5 rounded-full hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg shadow-orange-200 font-medium tracking-wide"
            >
              Login
            </Link>
          )}

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-3">
            {user && <NotificationBell />}
            <button
              onClick={toggleMobileMenu}
              className="bg-orange-500 p-2 rounded-full hover:bg-orange-600 transition"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span
                  className={`block h-0.5 w-full bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                    }`}
                ></span>
                <span
                  className={`block h-0.5 w-full bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''
                    }`}
                ></span>
                <span
                  className={`block h-0.5 w-full bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                    }`}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMobileMenu}
        ></div>
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[85%] max-w-[320px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Sidebar Header */}
        <div className="bg-linear-to-r from-orange-500 via-orange-600 to-orange-700 px-5 py-5 flex items-center justify-between">
          <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-3">
            <img src={logo} alt="Fornix Logo" className="w-11 h-11 rounded-full object-contain bg-white/20 p-0.5" />
            <h3 className="text-white font-black text-xl tracking-tight">Fornix</h3>
          </Link>
          <button
            onClick={closeMobileMenu}
            className="text-white/80 hover:text-white transition bg-white/10 rounded-full p-1.5 hover:bg-white/20"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="px-4 py-5 overflow-y-auto h-[calc(100%-260px)]">
          <ul className="space-y-1">
            <li>
              <Link
                to="/"
                onClick={closeMobileMenu}
                className="block text-gray-700 font-semibold text-[15px] hover:text-orange-500 hover:bg-orange-50 px-4 py-3 rounded-xl transition-all duration-200 active:scale-95"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                onClick={closeMobileMenu}
                className="block text-gray-700 font-semibold text-[15px] hover:text-orange-500 hover:bg-orange-50 px-4 py-3 rounded-xl transition-all duration-200 active:scale-95"
              >
                About
              </Link>
            </li>

            {/* Mobile Courses Accordion */}
            <li>
              <button
                onClick={() => setIsCoursesOpen(!isCoursesOpen)}
                className="w-full text-left text-gray-700 font-semibold text-[15px] hover:text-orange-500 hover:bg-orange-50 px-4 py-3 rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-between cursor-pointer"
              >
                <span>Courses</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${isCoursesOpen ? 'rotate-180 text-orange-500' : 'text-gray-400'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isCoursesOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <ul className="ml-4 mt-1 space-y-0.5 border-l-2 border-orange-100 pl-2">
                  {courses.map((course) => (
                    <li key={course.to}>
                      <Link
                        to={course.to}
                        onClick={closeMobileMenu}
                        className="block text-gray-500 text-sm hover:text-orange-500 hover:bg-orange-50 px-4 py-2.5 rounded-lg transition-all duration-200 hover:translate-x-1"
                      >
                        {course.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>

            <li>
              <Link
                to="/pricingPage"
                onClick={closeMobileMenu}
                className="block text-gray-700 font-semibold text-[15px] hover:text-orange-500 hover:bg-orange-50 px-4 py-3 rounded-xl transition-all duration-200 active:scale-95"
              >
                Pricing Plan
              </Link>
            </li>

            <li>
              <Link
                to="/contact"
                onClick={closeMobileMenu}
                className="block text-gray-700 font-semibold text-[15px] hover:text-orange-500 hover:bg-orange-50 px-4 py-3 rounded-xl transition-all duration-200 active:scale-95"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* Sidebar Footer - Login/Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-gray-50/80 backdrop-blur-sm">
          {user ? (
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 mb-3 px-1">
                {profilePictureUrl ? (
                  <img
                    src={profilePictureUrl}
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-orange-200"
                  />
                ) : (
                  <div className="w-9 h-9 bg-linear-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {firstName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{firstName}</p>
                  <p className="text-[11px] text-gray-400 truncate">{user.email || user.identifier || ''}</p>
                </div>
              </div>
              <Link
                to="/smart-tracking"
                onClick={closeMobileMenu}
                className="block w-full text-center bg-slate-800 text-white px-5 py-2.5 rounded-full hover:bg-slate-700 transition-all duration-300 shadow-md active:scale-95 font-bold text-sm"
              >
                Smart Tracking
              </Link>
              <Link
                to="/dashboard"
                onClick={closeMobileMenu}
                className="block w-full text-center bg-orange-500 text-white px-5 py-2.5 rounded-full hover:bg-orange-600 transition-all duration-300 shadow-md shadow-orange-200 active:scale-95 font-bold text-sm"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="w-full bg-white text-red-500 border border-red-100 px-5 py-2.5 rounded-full hover:bg-red-50 hover:border-red-200 transition-all duration-300 active:scale-95 font-bold text-sm cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={closeMobileMenu}
              className="block w-full text-center bg-orange-500 text-white px-5 py-2.5 rounded-full hover:bg-orange-600 transition-all duration-300 shadow-lg shadow-orange-200 active:scale-95 font-bold text-sm"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Fixed Left Edge Smart Tracking Button (Visible only to logged in users) */}
      {user && (
        <>
          <style>{`
            @keyframes intenseRadarGlow {
              0%, 100% { box-shadow: 0 0 15px 2px rgba(249, 115, 22, 0.5); }
              50% { box-shadow: 0 0 35px 12px rgba(249, 115, 22, 0.9), 0 0 15px rgba(255,255,255,0.6) inset; }
            }
            .attention-grabber-btn {
              animation: intenseRadarGlow 1.5s ease-in-out infinite;
            }
            .attention-icon {
              animation: spin 6s linear infinite;
            }
          `}</style>
          
          <Link
            to="/smart-tracking"
            className="attention-grabber-btn fixed left-0 top-1/2 -translate-y-1/2 z-50 bg-linear-to-r from-orange-600 to-orange-700 text-white rounded-r-2xl flex items-center transition-all duration-300 group overflow-hidden border-2 border-white/40 border-l-0"
          >
            <div className="p-3.5 relative flex items-center justify-center">
              {/* Aggressive Fast Pinging Ring */}
              <div className="absolute inset-0 border-[3px] border-white rounded-r-xl opacity-60 animate-ping" style={{ animationDuration: '1s' }}></div>
              
              {/* Spinning Target Icon */}
              <FiTarget className="attention-icon w-8 h-8 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              
              {/* Little red dot alert indicator */}
              <span className="absolute top-2 right-2 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-300"></span>
              </span>
            </div>
            {/* Expanded Text on Hover */}
            <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:pl-2 group-hover:pr-6 transition-all duration-500 ease-out font-black text-lg tracking-wider uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
              Smart Tracking
            </span>
          </Link>
        </>
      )}
    </>
  );
}
export default Header;
