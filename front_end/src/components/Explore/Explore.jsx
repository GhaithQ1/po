import React from 'react'
import "./Explore.css";
import Menu from '../main_menu/Menu';
import Bosts from '../bosts/Bosts';
import Chat from '../chat/Chat';

const Explore = () => {
  return (
    <>
    <div className='explore'>
      <div className='container'>
        <Menu/>
        <Bosts/>
        <Chat/>
      </div>
    </div>
    </>
  )
}

export default Explore