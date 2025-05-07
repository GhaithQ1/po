import React, { useState } from 'react';
import "./Create_Bost_Ifrem.css";
import Menu from '../main_menu/Menu';
import Chat from '../chat/Chat';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';

const Create_Bost_Ifrem = () => {
  const Navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const [errors, setErrors] = useState({});
  const [url,SetUrl] = useState("");
  const [des,SetDes] = useState("");
  const Ifrem = ()=>{
    axios.post('http://localhost:8000/api/v2/post/post_6',{
      url,
      des
    },{
      headers: {
        Authorization: `Bearer ${cookies.token}`,
      },
    }).then((res)=>{
      console.log(res)
      Navigate("/")
    }).catch((err)=>{
      if (err.response?.data?.errors) {
        const formattedErrors = {};
        err.response.data.errors.forEach((error) => {
          formattedErrors[error.path] = error.msg;
          setErrors(formattedErrors);
          console.log(formattedErrors)
        });
      }
    })
  }
  

  return (
    <div className="home">
      <div className="container">
        <Menu />
        <div className="Create_Bost_Ifrem">
          <h2>Create Bost Ifrem</h2>

          <div className="all_form">
            <div className="diverrors">
            {errors[`url`] && (
                        <p className="errors">{errors[`url`]}</p>
                      )}
              <input type="text" placeholder='Enter Your URL' value={url} onChange={(e)=>SetUrl(e.target.value)}/>
            </div>

              <textarea type="text" placeholder='Enter Your donescripti' value={des} onChange={(e)=>SetDes(e.target.value)}>
                
              </textarea>
          </div>
                <button onClick={Ifrem}>Sind</button>

        </div>
        <Chat />
      </div>
    </div>
  );
};

export default Create_Bost_Ifrem;
