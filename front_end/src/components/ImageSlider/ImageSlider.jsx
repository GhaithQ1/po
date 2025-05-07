import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ImageSlider.css";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Context";
import Loading_img from "../Loading_img/Loading_img";
const ImageSlider = () => {
  const [cookies, setCookies] = useCookies(["token"]);
  const Navigate = useNavigate();
  const { setGatUserById } = useUser();

  const [AllImageShoole, SetAllImageShoole] = useState([]);
  const [load_img, SetLoad_img] = useState(false);
  useEffect(() => {
    SetLoad_img(true)
    axios
      .get(`http://localhost:8000/api/v2/user`, {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        // SetAllImageShoole(res.data.data);
         // تصفية البيانات بحيث يتم الاحتفاظ فقط بالعناصر التي تملك role === 'وظف'
    const filteredData = res.data.data.filter(user => user.role === 'employee' || user.role === 'admin' );
    SetAllImageShoole(filteredData);
    SetLoad_img(false)
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  }, []);
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    swipeToSlide: true,
  };

  const images = [
    "./image/test.jpg",
    "./image/test.jpg",
    "./image/test.jpg",
    "./image/test.jpg",
  ];
  return (
    <>
      {/* ImageSlider */}
      {load_img ? <Loading_img/> : <div className="shoole">
        <Slider {...settings}>
          {AllImageShoole.map((src, index) => (
            <div className="img_shoole" key={index}>

              <div className="transparent_layer"
              onClick={() => {
                Navigate(`/Get_Shoole_By/${src._id}`);
              }}>
                <p>{src.name}</p>
              </div>

              <img
              className="log"
               src={
                  src.profilImage
                    ? `http://localhost:8000/user/${src.profilImage}`
                    : "/image/test.jpg"
                } alt="" />
              
              <img
                onClick={() => {
                  Navigate(`/Get_Shoole_By/${src._id}`);
                }}
                src={
                  src.Cover_image
                    ? `http://localhost:8000/user/${src.Cover_image}`
                    : "/image/test.jpg"
                }
                alt={`Image of ${src.name}`}
              />
            </div>
          ))}
        </Slider>
      </div>}
      
      {/* ImageSlider */}
    </>
  );
};

export default ImageSlider;
