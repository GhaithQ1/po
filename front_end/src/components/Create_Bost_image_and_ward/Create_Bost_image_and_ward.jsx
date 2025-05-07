import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import "./Create_Bost_image_and_ward.css";
import Menu from "../main_menu/Menu";
import Chat from "../chat/Chat";

const Create_Bost_image_and_ward = () => {
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();

  // الحالة لتتبع النماذج المضافة
  const [forms, setForms] = useState([{ image: null, audio: null, word: "" }]);
  const [formErrors, setFormErrors] = useState({});

  const handleAddForm = () => {
    setForms([...forms, { image: null, audio: null, word: "" }]);
    setTimeout(() => {
      const lastQuestion = document.querySelector('.form:last-child');
      lastQuestion?.scrollIntoView({ behavior: 'smooth' });
    }, 0); // إضافة نموذج جديد
  };

  const handleFormChange = (index, field, value) => {
    setForms((prevForms) =>
      prevForms.map((form, idx) =>
        idx === index ? { ...form, [field]: value } : form
      )
    );
  };

  const handleRemoveForm = (index) => {
    setForms((prevForms) => prevForms.filter((_, idx) => idx !== index)); // إزالة النموذج
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();

    forms.forEach((form, index) => {
      if (form.image) {
        formData.append(`boxes[${index}][postImage]`, form.image);
      }
      if (form.audio) {
        formData.append(`boxes[${index}][audio]`, form.audio);
      }
      formData.append(`boxes[${index}][word]`, form.word);
    });

    axios
      .post("http://localhost:8000/api/v2/post/post_1", formData, {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        navigate("/");
        console.log(res);
      })
      .catch((err) => {
        if (err.response?.data?.errors) {
          const formattedErrors = {};
          err.response.data.errors.forEach((error) => {
            formattedErrors[error.path] = error.msg;
            setFormErrors(formattedErrors);
            console.log(formattedErrors)
          });
        }
      });
  };

  return (
    <div className="home">
      <div className="container">
        <Menu />
        <div className="bost_image_and_ward">
          <h2>Create Bost Image, Audio, and Word</h2>
          <form className="unified_form">
            {forms.map((form, index) => (
              <div className="form" key={index}>
                {/* زر الإغلاق */}
                <button
                  type="button"
                  className="remove_form_btn"
                  onClick={() => handleRemoveForm(index)}
                >
                  X
                </button>
                <label className="image-box">
                  {form.image ? (
                    <img
                      src={URL.createObjectURL(form.image)}
                      alt="preview"
                      className="preview-image"
                    />
                  ) : formErrors[`files[${index}]`] ? (
                    <p className="image_error">
                      {formErrors[`files[${index}]`]}
                    </p>
                  ) : (
                    <span className="plus-sign">+</span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) =>
                      handleFormChange(index, "image", e.target.files[0])
                    }
                  />
                </label>

                <label className="audio-box">
                  <div className="audio-container">
                    {form.audio ? (
                      <p className="audio-name">
                        Uploaded Audio: {form.audio.name}
                      </p>
                    ) : formErrors[`boxes[${index}][audio]`] ? (
                      <p className="image_error">
                        {formErrors[`boxes[${index}][audio]`]}
                      </p>
                    ) : (
                      <div className="upload-placeholder">
                        <span className="upload-icon">🎵</span>
                        <p className="upload-text">
                          Click to upload an audio file
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="audio/*"
                      style={{ display: "none" }}
                      onChange={(e) =>
                        handleFormChange(index, "audio", e.target.files[0])
                      }
                    />
                  </div>
                </label>

                <div className="word_error">
                  {formErrors[`boxes[${index}][word]`] && (
                    <p className="_error">
                      {formErrors[`boxes[${index}][word]`]}
                    </p>
                  )}
                  <input
                    className="input_ward"
                    type="text"
                    value={form.word}
                    onChange={(e) =>
                      handleFormChange(index, "word", e.target.value)
                    }
                    placeholder="Enter word..."
                  />
                </div>
              </div>
            ))}
          </form>
          <div className="butin">
                      <button type="button" className="add-question-btn" onClick={handleAddForm}>
            <span className="icon">＋</span> Another Question
          </button>
          <button type="submit" className="submit_btn" onClick={handleSubmit}>
            Submit
          </button>
          </div>

        </div>
        <Chat />
      </div>
    </div>
  );
};

export default Create_Bost_image_and_ward;
