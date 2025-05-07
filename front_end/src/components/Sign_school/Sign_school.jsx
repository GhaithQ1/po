import React, { useState } from "react";
import axios from "axios";
import "./Sign_school.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGooglePlusG,
  faFacebookF,
  faGithub,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const Sign_school = () => {
  const [Cook, setCookies] = useCookies("token");
  const Navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    address: "",
    phone: "",
    description: "",
    role: "employee",
    Cover_image: null,
    profilImage: null,
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // إزالة الخطأ عند تعديل الحقل
    }));
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      [name]: file,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // إزالة الخطأ عند اختيار ملف
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.passwordConfirm)
      newErrors.passwordConfirm = "Password confirmation is required";
    if (formData.password !== formData.passwordConfirm)
      newErrors.passwordConfirm = "Passwords do not match";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.phone) newErrors.phone = "Phone is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.Cover_image)
      newErrors.Cover_image = "Cover image is required";
    if (!formData.profilImage)
      newErrors.profilImage = "Profile image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validateForm()) {
      return; // لا تُرسل الطلب إذا كانت هناك أخطاء
    }

    const newFormData = new FormData();
    for (let key in formData) {
      newFormData.append(key, formData[key]);
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v2/auth/sign_up",
        newFormData
      );
      setSuccessMessage(response.data.message);
      setFormData({
        name: "",
        email: "",
        password: "",
        passwordConfirm: "",
        address: "",
        phone: "",
        description: "",
        role: "employee",
        Cover_image: null,
        profilImage: null,
      });
      setErrors({});
      setCookies("token", response.data.token);
      Navigate("/");
    } catch (err) {
      setErrors({
        global: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="sign-up-container">
      <div className="con">
        <div className="color"></div>

        <form className="sign-up-form" onSubmit={handleSubmit}>
          {errors.global && <p className="error-message">{errors.global}</p>}
          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}
          <h2>Create Account School</h2>
          <div className="create_input_shoole">
          <div className="input_err">
            <input
              type="text"
              name="name"
              placeholder="School Name"
              value={formData.name}
              onChange={handleInputChange}
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>
          <div className="input_err">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="input_err">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <div className="input_err">
            <input
              type="password"
              name="passwordConfirm"
              placeholder="Confirm Password"
              value={formData.passwordConfirm}
              onChange={handleInputChange}
            />
            {errors.passwordConfirm && (
              <p className="error-text">{errors.passwordConfirm}</p>
            )}
          </div>

          <div className="input_err">
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleInputChange}
            />
            {errors.address && <p className="error-text">{errors.address}</p>}
          </div>

          <div className="input_err">
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
            {errors.phone && <p className="error-text">{errors.phone}</p>}
          </div>
          </div>


          <div className="input_err">
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleInputChange}
            />
            {errors.description && (
              <p className="error-text">{errors.description}</p>
            )}
          </div>

          <div className="img_upload">
            <div className="input_err">
              <label className="image-upload-box">
                {formData.Cover_image ? (
                  <img
                    src={URL.createObjectURL(formData.Cover_image)}
                    alt="Preview"
                    className="image-preview"
                  />
                ) : (
                  <span className="upload-placeholder">+</span>
                )}
                <input
                  type="file"
                  name="Cover_image"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </label>
              {errors.Cover_image && (
                <p className="error-text">{errors.Cover_image}</p>
              )}
            </div>

            <div className="input_err">
              <label className="image-upload-box log">
                {formData.profilImage ? (
                  <img
                    src={URL.createObjectURL(formData.profilImage)}
                    alt="Preview"
                    className="image-preview"
                  />
                ) : (
                  <span className="upload-placeholder">+</span>
                )}
                <input
                  type="file"
                  name="profilImage"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </label>
              {errors.profilImage && (
                <p className="error-text">{errors.profilImage}</p>
              )}
            </div>
          </div>

          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Sign_school;
