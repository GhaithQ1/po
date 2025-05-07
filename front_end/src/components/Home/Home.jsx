import { useEffect } from 'react';
import "./Home.css";
import Menu from '../main_menu/Menu';
import Bosts from '../bosts/Bosts';
import Chat from '../chat/Chat';
import ImageSlider from '../ImageSlider/ImageSlider';
import Create_menu from '../Create_menu/Create_menu';
import { CookiesProvider ,useCookies} from 'react-cookie';
import { useNavigate } from 'react-router-dom';
const Home = () => {
    const Navigate = useNavigate();

  const token = window.localStorage.getItem("token");
    const [Cook, setCookies] = useCookies("token");
    useEffect(() => {
      if (token) {
        setCookies("token", token);
      }else{
        Navigate("/signandlog")
      }
    }, []);
  return (
    <>
    <div className='home'>
      <div className='container'>
        <Menu/>
        <div className="rew">
        <ImageSlider/>
        <Create_menu/>
        <Bosts/>
        </div>
        
        <Chat/>
      </div>
    </div>
    </>
  )
}

export default Home