import { useEffect, useState , useRef} from "react";
import axios from "axios";
import Menu from "../main_menu/Menu";
import Chat from "../chat/Chat";
import "./Update_profile.css";
import { useCookies } from "react-cookie";

import { useNavigate } from 'react-router-dom';

import Loading_input from "../Loading_input/Loading_input";

export default function UpdateProfile() {
  const Navigate = useNavigate();

  const [cookies] = useCookies(["token"]);

  const [LoadInput, setLoadInput] = useState(false)

  // حالة البيانات
  const [userData, setUserData] = useState({
    name: "",
    phone: "",
    profilImage: "",
    Cover_image: "",
    description: "",
    address: ""
  });

  // حالة الصور الجديدة
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [previewProfileImage, setPreviewProfileImage] = useState(null);

  const [newCoverImage, setNewCoverImage] = useState(null);
  const [previewCoverImage, setPreviewCoverImage] = useState(null);

  // مرجع لاستخدام إدخال الملف عند النقر على الصورة
  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // استرجاع بيانات المستخدم عند تحميل الصفحة
  useEffect(() => {
    setLoadInput(true)
    const fetchUserData = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v2/auth/get_date_my", {
          headers: { Authorization: `Bearer ${cookies.token}` },
        });
        setUserData(res.data.data);
        setPreviewProfileImage(`http://localhost:8000/user/${res.data.data.profilImage}`);
        setPreviewCoverImage(`http://localhost:8000/user/${res.data.data.Cover_image}`);
        setLoadInput(false)
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchUserData();
  }, []);

  // تحديث البيانات
  const updateProfile = async () => {
    try {
      let formData = new FormData();
  
      // التحقق من القيم المُدخلة وإضافتها إلى FormData فقط إذا كانت غير فارغة
      if (userData.name) formData.append("name", userData.name);
      if (userData.phone) formData.append("phone", userData.phone);
      if (userData.description) formData.append("description", userData.description);
      if (userData.address) formData.append("address", userData.address);
  
      // إضافة الصور فقط إذا تم تغييرها
      if (newProfileImage) {
        formData.append("profilImage", newProfileImage);
      }
      if (newCoverImage) {
        formData.append("Cover_image", newCoverImage);
      }
  
      console.log("Data being sent:", formData);
  
      await axios.put("http://localhost:8000/api/v2/user", formData, {
        headers: { 
          Authorization: `Bearer ${cookies.token}`,
          "Content-Type": "multipart/form-data",
        }
      });
      Navigate("/profile")
    } catch (error) {
      console.error("Error updating data", error);
    }
  };

  // تحديث الصورة عند اختيار ملف جديد
  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewProfileImage(file);
      setPreviewProfileImage(URL.createObjectURL(file));
    }
  };

  const handleCoverImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewCoverImage(file);
      setPreviewCoverImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="home">
      <div className="container">
        <Menu />
        <div className="update_profile">
          <h1>Update Profile</h1>

          <form>
            <div className="lod_and_input">
              {LoadInput ? <Loading_input/> : null}
              <input 
              type="text" 
              value={userData.name} 
              onChange={(e) => setUserData({ ...userData, name: e.target.value })} 
              placeholder="Name"
            />
            </div>
            
            <div className="lod_and_input">
            {LoadInput ? <Loading_input/> : null}
              <input 
              type="text" 
              value={userData.phone} 
              onChange={(e) => setUserData({ ...userData, phone: e.target.value })} 
              placeholder="Phone"
            />
            </div>
            <div className="lod_and_input">
            {LoadInput ? <Loading_input/> : null}
               <input 
              type="text" 
              value={userData.address} 
              onChange={(e) => setUserData({ ...userData, address: e.target.value })} 
              placeholder="Address"
            />
            </div>
           
            <div className="lod_and_input">
            {LoadInput ? <Loading_input/> : null}
              <textarea 
              value={userData.description} 
              onChange={(e) => setUserData({ ...userData, description: e.target.value })} 
              placeholder="Description"
            />
            </div>
            <div className="img_lod_and_input">
            <div className="lod_and_input">
            {LoadInput ? <Loading_input/> : null}
              <div className="image-upload" onClick={() => profileInputRef.current.click()}>
              <input type="file" ref={profileInputRef} style={{ display: "none" }} onChange={handleProfileImageChange} />
              {previewProfileImage ? (
                <img src={previewProfileImage} alt="Profile" className="image-preview" />
              ) : (
                <div className="placeholder">+</div>
              )}
            </div>
            </div>
            {/* اختيار صورة الملف الشخصي */}
            
            <div className="lod_and_input">
            {LoadInput ? <Loading_input/> : null}
              <div className="image-upload" onClick={() => coverInputRef.current.click()}>
              <input type="file" ref={coverInputRef} style={{ display: "none" }} onChange={handleCoverImageChange} />
              {previewCoverImage ? (
                <img src={previewCoverImage} alt="Cover" className="image-preview" />
              ) : (
                <div className="placeholder">+</div>
              )}
            </div>
            </div>
            {/* اختيار صورة الغلاف */}
            </div>

            

            <button type="button" onClick={updateProfile}>Update</button>
          </form>

        </div>
        <Chat />
      </div>
    </div>
  );
}