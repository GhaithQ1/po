import React, { useState, useEffect } from 'react';
import './Comment.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
const Comment = ({visible, onClose}) => {
      const Navigate = useNavigate();
      const [cookies] = useCookies(["token"]);




  return (
    <>
        <div className={`comments ${visible ? "show" : "hide"}`}>
            <div className="publisher"> 
               <FontAwesomeIcon className="out_icon" onClick={onClose} icon={faTimes} />
               <p>publication <span>Ghaith</span></p>
            </div>
            <div className="comment">
                <div className="com">
                    <img src="./image/test.jpg" alt="" />
                    <div className="name_user_comment">
                    <span>Ghaith</span>
                    <p>Write me a comment, it would be nice</p>
                    </div>
                </div>
                <div className="com">
                    <img src="./image/test.jpg" alt="" />
                    <div className="name_user_comment">
                    <span>Ghaith</span>
                    <p>Write me a comment, it would be niceWrite me a comment, it would be niceWrite me a comment, it would be niceWrite me a comment, it would be nice</p>
                    </div>
                </div>
                <div className="com">
                    <img src="./image/test.jpg" alt="" />
                    <div className="name_user_comment">
                    <span>Ghaith</span>
                    <p>Write me a comment, it would be niceWrite me a comment,</p>
                    </div>
                </div>
                <div className="com">
                    <img src="./image/test.jpg" alt="" />
                    <div className="name_user_comment">
                    <span>Ghaith</span>
                    <p>Write me a comment, it would be niceWrite me a comment,</p>
                    </div>
                </div>
                <div className="com">
                    <img src="./image/test.jpg" alt="" />
                    <div className="name_user_comment">
                    <span>Ghaith</span>
                    <p>Write me a comment, it would be niceWrite me a comment,</p>
                    </div>
                </div>
            </div>
            <form action="">
                    <input type="text" placeholder='Write a comment...'/>
                    <button>Sind</button>
                </form>
        </div>
    </>
  )
}

export default Comment