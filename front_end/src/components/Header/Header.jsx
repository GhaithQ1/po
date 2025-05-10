import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

const Header = () => {
  const [menuVisible, setMenuVisible] = useState(false);

  const handleProfileClick = () => {
    setMenuVisible(!menuVisible);
  };

  const [cookies, setCookies] = useCookies(["token"]);
  const Navigate = useNavigate();

  const logout = () => {
    axios.put('http://localhost:8000/api/v2/auth/logout', {}, {
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      }
    }).then((res) => {
      setCookies("token", "");
      window.localStorage.removeItem("token");
      Navigate('/signandlog')
    }).catch((err) => {
      console.log(err)
    })
  }
  const [MyData, setMyData] = useState([]);
  useEffect(() => {
    axios.get(`http://localhost:8000/api/v2/auth/get_date_my`, {
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
    })
      .then(res => {
        setMyData(res.data.data);

      })
      .catch(error => {
        console.error('Error fetching data', error);
      });
  }, []);





  // داخل مكونك:
  const commentRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        commentRef.current &&
        !commentRef.current.contains(event.target)
      ) {
        setMenuVisible(false); // سكّر المينيو
      }
    };

    if (menuVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuVisible]);


  return (
    <header>
      <div className='container'>
        <div className='header_respon'>
          <img src="./image/logo.png" alt="" />
          <form action="">
            <FontAwesomeIcon className='search_icon' icon={faSearch} />
            <input type="text" placeholder='Search for schools, or people you may know.' />
          </form>

          <div className='profile' onClick={handleProfileClick} ref={commentRef}>
<img
  src={
    MyData.profilImage
      ? MyData.profilImage.startsWith("http")
        ? MyData.profilImage
        : `http://localhost:8000/user/${MyData.profilImage}`
      : "/image/pngegg.png"
  }
  alt={`Image of ${MyData.name}`}
/>

            <p>{MyData.name}</p>

            <div
              className="menu_hover"
              style={{ display: menuVisible ? 'block' : 'none' }}

            >
              <NavLink to="/profile" className="my_profile">
                <p>My Profile</p>
              </NavLink>
              <div className="logout" onClick={logout}>
                <FontAwesomeIcon className='logout_icon' icon={faSignOutAlt} />
                <p>LogOut</p>
              </div>
            </div>
          </div>




        </div>
      </div>
    </header>
  );
};

export default Header;
