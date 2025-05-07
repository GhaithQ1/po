import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from './components/Home/Home';
import Explore from './components/Explore/Explore';
import Header from './components/Header/Header';
import Chat from './components/chat/Chat';
import Menu from './components/main_menu/Menu';
import SignAndLog from './components/SignAndLog/SignAndLog';
import BookMark from './components/BookMark/BookMark';
import Create_Bost_image_and_ward from './components/Create_Bost_image_and_ward/Create_Bost_image_and_ward';
import Create_Bost_choose_the_correct_answer from './components/Create_Bost_choose_the_correct_answer/Create_Bost_choose_the_correct_answer';
import Create_Bost_True_Or_False from './components/Create_Bost_True_Or_False/Create_Bost_True_Or_False';
import Create_Bost_image_and_answer from './components/Create_Bost_image_and_answer/Create_Bost_image_and_answer';
import Create_Bost_Video_and_image from './components/Create_Bost_Video_End_Image/Create_Bost_Video_End_Image';
import Create_Bost_Ifrem from './components/Create_Bost_Ifrem/Create_Bost_Ifrem';
import Profile from './components/profile/Profile';
import Get_Shoole_By_Id from './components/Get_Shoole_By_Id/Get_Shoole_By_Id';
import Sign_school from './components/Sign_school/Sign_school';
import Loading_main from './components/Loading_Main/Loading_main';
import Update_profile from './components/Update_profile/Update_profile';
import './App.css';
import { UserProvider } from './components/Context';
import { CookiesProvider ,useCookies} from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import AuthSuccess from './components/AuthSuccess';
function AppContent() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      navigate("/signandlog"); // أو "/login" أو أي صفحة ترحيب
    }
  }, []);


  const location = useLocation();


  useEffect(() => {
    // أول شي شيل كل الكلاسات
    document.body.className = '';
    
    // قراءة الثيم من localStorage وتطبيقه على الـ body مباشرةً
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      document.body.classList.add('root_da');
    }

    // إذا الصفحة هي /chat، ضيف كلاس خاص
    if (location.pathname === '/chat') {
      document.body.classList.add('chat-page');
    }
  }, [location]);

  

  return (
    <UserProvider>
    <Routes>
      <Route path='/' element={<><Header /><Home /></>} />
      <Route path='/explore' element={<><Header /><Explore /></>} />
      <Route path='/chat' element={<><Header /><Menu /><Chat /></>} />
      <Route path='/signandlog' element={<><SignAndLog /></>} />
      <Route path='/sign_school' element={<><Sign_school /></>} />
      <Route path='/bookmark' element={<><Header /><BookMark /></>} />
      <Route path='/create_bost_image_and_ward' element={<><Header /><Create_Bost_image_and_ward /></>} />
      <Route path='/create_bost_choose_the_correct_answer' element={<><Header /><Create_Bost_choose_the_correct_answer /></>} />
      <Route path='/create_bost_true_or_false' element={<><Header /><Create_Bost_True_Or_False /></>} />
      <Route path='/create_bost_image_and_answer' element={<><Header /><Create_Bost_image_and_answer /></>} />
      <Route path='/Create_Bost_Video_and_image' element={<><Header /><Create_Bost_Video_and_image /></>} />
      <Route path='/profile' element={<><Header /><Profile /></>} />
      <Route path='/update_profile' element={<><Header /><Update_profile /></>} />
      <Route path='/Get_Shoole_By/:idParams' element={<><Header /><Get_Shoole_By_Id/></>} />
      <Route path='/Create_Bost_Ifrem' element={<><Header /><Create_Bost_Ifrem/></>} />
      <Route path='/Loading_main' element={<><Header /><Loading_main/></>} />
      <Route path="/auth/success" element={<AuthSuccess/>} />
    </Routes>
    </UserProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <CookiesProvider>

      <AppContent />
      </CookiesProvider>

    </BrowserRouter>
  );
}

export default App;
