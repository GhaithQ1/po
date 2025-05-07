import { useState, useRef } from "react";
import "./Create_Bost_Video_End_Image.css";
import Menu from "../main_menu/Menu";
import Chat from "../chat/Chat";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faVideo } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Create_Bost_Video_and_image = () => {
  const [formErrors, setFormErrors] = useState({});
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();

  const [qus1, Setrqs1] = useState("");

  // ✅ تخزين الملفات بشكل صحيح
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // ✅ معالجة رفع الصور المتعددة
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageFiles((prev) => [...prev, ...files]);
    }
  };

  // ✅ معالجة رفع الفيديوهات المتعددة
  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setVideoFiles((prev) => [...prev, ...files]);
    }
  };

  // ✅ حذف صورة محددة
  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ حذف فيديو محدد
  const removeVideo = (index) => {
    setVideoFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ تعديل `handleSubmit` لإرسال عدة صور وفيديوهات
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    if (qus1) {
      formData.append("writing", qus1);
    }

    // ✅ إضافة جميع الصور بشكل صحيح
    imageFiles.forEach((file) => formData.append("img_post", file));

    // ✅ إضافة جميع الفيديوهات بشكل صحيح
    videoFiles.forEach((file) => formData.append("video_post", file));

    // ✅ طباعة `FormData` للتحقق
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v2/post/post",
        formData,
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("تم الإرسال:", response.data);

      // ✅ تصفية الفورم بعد الإرسال
      setImageFiles([]);
      setVideoFiles([]);
      Setrqs1("");
      imageInputRef.current.value = "";
      videoInputRef.current.value = "";

      navigate("/");
    } catch (err) {
      if (err.response?.data?.errors) {
        const formattedErrors = {};
        err.response.data.errors.forEach((error) => {
          formattedErrors[error.path] = error;
        });
        setFormErrors(formattedErrors);
      }
    }
  };

  return (
    <div className="home">
      <div className="container">
        <Menu />
        <div className="Create_Bost_Video_and_image">
          <h2>Create Bost True Or False</h2>
          <div className="all_form">
            {formErrors[""] && <p className="_error">{formErrors[""].msg}</p>}
            <div className="form">
              <textarea
                type="text"
                placeholder="Put the first question."
                value={qus1}
                onChange={(e) => Setrqs1(e.target.value)}
              ></textarea>

              {/* أيقونات رفع الملفات */}
              <div className="iconvideandimg">
                <FontAwesomeIcon
                  className="icon_v_m"
                  icon={faImage}
                  onClick={() => imageInputRef.current.click()}
                  style={{ cursor: "pointer", marginRight: "15px" }}
                />
                <FontAwesomeIcon
                  className="icon_v_m"
                  icon={faVideo}
                  onClick={() => videoInputRef.current.click()}
                  style={{ cursor: "pointer" }}
                />
              </div>

              {/* إدخال مخفي للصورة */}
              <input
                type="file"
                accept="image/*"
                ref={imageInputRef}
                onChange={handleImageChange}
                style={{ display: "none" }}
                multiple
              />

              {/* إدخال مخفي للفيديو */}
              <input
                type="file"
                accept="video/*"
                ref={videoInputRef}
                onChange={handleVideoChange}
                style={{ display: "none" }}
                multiple
              />
            </div>

            {/* ✅ عرض الصور والفيديوهات بعد الرفع */}
            <div className="img_vid_flex">
              {imageFiles.map((img, index) => (
                <div key={index} style={{ position: "relative", width: "50%" }}>
                  <img
                    src={URL.createObjectURL(img)}
                    alt="Selected"
                    style={{ width: "100%", borderRadius: "8px" }}
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="remove-btn"
                  >
                    ×
                  </button>
                </div>
              ))}

              {videoFiles.map((video, index) => (
                <div key={index} style={{ position: "relative", width: "50%" }}>
                  <video
                    src={URL.createObjectURL(video)}
                    controls
                    style={{ width: "100%", borderRadius: "8px" }}
                  ></video>
                  <button
                    onClick={() => removeVideo(index)}
                    className="remove-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="submit_btn" onClick={handleSubmit}>
            Submit
          </button>
        </div>
        <Chat />
      </div>
    </div>
  );
};

export default Create_Bost_Video_and_image;
