import React, { useState, useEffect } from 'react';
import './Menu.css';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCompass, faBookmark, faBell, faComments, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { useUser } from '../Context';

const Menu = () => {

  const { setUserTheme } = useUser();


  const [isToggled, setIsToggled] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    return storedTheme === 'dark';
  });

  useEffect(() => {
    if (isToggled) {
      document.body.classList.add('root_da');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('root_da');
      localStorage.setItem('theme', 'light');
    }
  }, [isToggled]);

  const handleToggle = () => {
    setIsToggled((prev) => !prev);
    setUserTheme((prev) => !prev);
  };

  return (
    <div className='menu'>
      <div className='sidebar__list'>
        <NavLink to="/" className={({ isActive }) => `navbar${isActive ? ' active' : ''}`}>
          <FontAwesomeIcon className='nav_icon' icon={faHome} />
          <p>Home</p>
        </NavLink>

        <NavLink to="/explore" className={({ isActive }) => `navbar${isActive ? ' active' : ''}`}>
          <FontAwesomeIcon className='nav_icon' icon={faCompass} />
          <p>Explore</p>
        </NavLink>

        <NavLink to="/notifications" className={({ isActive }) => `navbar${isActive ? ' active' : ''}`}>
          <FontAwesomeIcon className='nav_icon' icon={faBell} />
          <p>Notifications</p>
        </NavLink>

        <NavLink to="/bookmark" className={({ isActive }) => `navbar${isActive ? ' active' : ''}`}>
          <FontAwesomeIcon className='nav_icon' icon={faBookmark} />
          <p>Bookmarks</p>
        </NavLink>


  <NavLink
    to={`/chat`}
    className={({ isActive }) => `navbar icon_chats${isActive ? ' active' : ''}`}
  >
    <FontAwesomeIcon className='nav_icon' icon={faComments} />
  </NavLink>


        <div className="navbar" onClick={handleToggle}>
          <FontAwesomeIcon className='nav_icon' icon={isToggled ? faSun : faMoon} />
          <p>{isToggled ? 'Light Mode' : 'Dark Mode'}</p> {/* تغيير النص هنا */}
        </div>

      </div>
    </div>
  );
};

export default Menu;

