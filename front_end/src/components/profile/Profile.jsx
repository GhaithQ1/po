import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTimes,
  faHeart,
  faComment,
  faBookmark,
  faChevronLeft,
  faChevronRight,
  faTrashAlt,
  faEllipsisVertical, faTrash
} from "@fortawesome/free-solid-svg-icons";
import { useCookies } from "react-cookie";
import { Relod_post } from "../Relod_post/Relod_post";
import "./Profile.css";
import Menu from "../main_menu/Menu";
import Chat from "../chat/Chat";
import Create_menu from "../Create_menu/Create_menu";
import { formatDistanceToNow } from "date-fns";

import { Relod_like } from "../Relod_like/Relod_like";
import Loading_main from "../Loading_Main/Loading_main";

import Loading_coment from "../Loading_coment/Loading_coment";

import Loading_Bookmark from "../Loading_Bookmark/Loading_Bookmark";

import { useNavigate } from 'react-router-dom';

const Profile = () => {

  const Navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [MyData, setMyData] = useState([]);
  const [cookies] = useCookies(["token"]);

  const [likeds, setLikeds] = useState(false);
  const [Relod_likee, setRelod_likee] = useState(false);
  const [Relod_likeeid, setRelod_likeeid] = useState("");

  const audioRefs = useRef([]);
  // const [posts, setPosts] = useState([]);
  // const [cookies] = useCookies(["token"]);
  const inputRef = useRef();
  const [NewComment, SetNewComment] = useState([]);
  const [showCommentForPostId, setShowCommentForPostId] = useState(null);
  const [liked, setLiked] = useState(false);
  const [bookMark, setbookMark] = useState(false);
  const [Mydata, SetMydata] = useState();
  const [bookId, SetbookId] = useState();
  const [solvedPost_3, SetsolvedPost_3] = useState();
  const [solvedPost_2, SetsolvedPost_2] = useState();
  const [solvedPost_4, SetsolvedPost_4] = useState();
  const [lod, setlod] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const bottomRef = useRef(null);

  const [relod, setrelod] = useState(false);

  const [relod_1, setrelod_1] = useState(false);

  const [relod_coment, setrelod_coment] = useState(false);

  const [relod_Bookmark, setrelod_Bookmark] = useState(false);

  const [Deleting_Please, setDeleting_Please] = useState(false)
  const [Confirm_deletionn, setConfirm_deletionn] = useState(false)

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/v2/auth/get_date_my`, {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setMyData(res.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  }, []);

  const user1Id = MyData?._id;
  useEffect(() => {
    setrelod_1(true);
  }, []);

  useEffect(() => {
    if (!user1Id) return; // لا تعمل شي إذا ما وصل الاي دي
    axios
      .get(`http://localhost:8000/api/v2/post/getUserPosts/${user1Id}`, {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setPosts(res.data.data);
        setRelod_likee(false);
        setrelod_1(false);
        setrelod_coment(false);

      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  }, [user1Id, likeds, NewComment, relod_Bookmark, Deleting_Please]);

  // =========================================

  const playSound = (index) => audioRefs.current[index].play();

  const Commentary = async (id, e) => {
    e.preventDefault();
    const commentValue = inputRef.current.value;
    try {
      setrelod_coment(true);
      const res = await axios.post(
        `http://localhost:8000/api/v2/post/create_post_comments/${id}`,
        {
          comment: commentValue,
        },
        {
          headers: { Authorization: `Bearer ${cookies.token}` },
        }
      );
      inputRef.current.value = "";
      SetNewComment(res.data.data.comments);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const handleCommentClick = (postId) =>
    setShowCommentForPostId(showCommentForPostId === postId ? null : postId);
  const handleCloseComment = () => setShowCommentForPostId(null);

  const Likes = async (id) => {
    try {
      setRelod_likee(true);
      await axios.post(
        `http://localhost:8000/api/v2/post/toggle_post_like/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${cookies.token}` },
        }
      );
      setLikeds(!likeds);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };


  const handleBook = (id) => setbookMark(id);

  useEffect(() => {
    const fetchMyData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/v2/auth/get_date_my",
          {
            headers: { Authorization: `Bearer ${cookies.token}` },
          }
        );
        SetMydata(res.data.data._id);
        SetbookId(res.data.data.savedPosts);
        SetsolvedPost_3(res.data.data.solvedPost_3);
        SetsolvedPost_2(res.data.data.solvedPost_2);
        SetsolvedPost_4(res.data.data.solvedPost_4);
        setrelod(false);
        setrelod_Bookmark(false);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchMyData();
  }, [lod, relod, relod_Bookmark, bookId]);

  const bookMarks = async (id) => {
    try {
      setrelod_Bookmark(true);
      await axios.post(
        `http://localhost:8000/api/v2/auth/toggleSavedPost/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${cookies.token}` },
        }
      );
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [NewComment]);

  const [answerTest, setanswerTest] = useState([]);

  let answers = [];

  const chick_post_3 = async (IdPost, id, answer) => {
    try {
      answers = [
        ...answers,
        {
          questionId: id,
          answer: answer,
        },
      ];

      // إرسال البيانات إلى API
      const res = await axios.post(
        `http://localhost:8000/api/v2/post/post_3_chick`, // URL الخاص بالـ API
        {
          postId: IdPost,
          answers,
        },
        {
          headers: { Authorization: `Bearer ${cookies.token}` }, // إضافة التوكن في الهيدر
        }
      );

      // استلام البيانات من الـ API
    } catch (error) {
      console.error("Error fetching data", error); // في حال حدوث خطأ
    }
  };

  const chick_post_2 = async (IdPost, id, answer) => {
    try {
      answers = [
        ...answers,
        {
          questionId: id,
          answer: answer,
        },
      ];

      // إرسال البيانات إلى API
      const res = await axios.post(
        `http://localhost:8000/api/v2/post/post_2_chick`, // URL الخاص بالـ API
        {
          postId: IdPost,
          answers,
        },
        {
          headers: { Authorization: `Bearer ${cookies.token}` }, // إضافة التوكن في الهيدر
        }
      );

      // استلام البيانات من الـ API
      console.log(res.data);
    } catch (error) {
      console.error("Error fetching data", error); // في حال حدوث خطأ
    }
  };

  // ========================================

  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState({});
  const [activeIcon, setActiveIcon] = useState({});
  const [localAnswers, setLocalAnswers] = useState({});

  // ===========================================

  const [id, setid] = useState();

  // ثاني شيء الريلود:

  // ===============================================================

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // =========================================

  const [questionIndices, setQuestionIndices] = useState({});

  const chick_post_4 = async (IdPost, id, answer) => {
    try {
      answers = [
        ...answers,
        {
          questionId: id,
          answer: answer,
        },
      ];

      // إرسال البيانات إلى API
      const res = await axios.post(
        `http://localhost:8000/api/v2/post/post_4_chick`, // URL الخاص بالـ API
        {
          postId: IdPost,
          answers,
        },
        {
          headers: { Authorization: `Bearer ${cookies.token}` }, // إضافة التوكن في الهيدر
        }
      );

      // استلام البيانات من الـ API
      console.log(res.data);
    } catch (error) {
      console.error("Error fetching data", error); // في حال حدوث خطأ
    }
  };

  // ================================

  const [currentPagee, setcurrentPagee] = useState(0); // صفحة البداية

  const [pageByPost, setPageByPost] = useState({});

  const addNewQuestion = () => {
    setTimeout(() => {
      const lastQuestion = document.querySelector(".comment section");
      console.log(lastQuestion);
      lastQuestion?.scrollIntoView({ behavior: "smooth" });
    });
  };
  const addNewQuestion_com = () => {
    setTimeout(() => {
      const lastQuestion = document.querySelector(".comment > *:last-child");
      console.log(lastQuestion);
      lastQuestion?.scrollIntoView({ behavior: "smooth" });
    });
  };


  // ======================================


  const [Confirm_deletionnID, setConfirm_deletionnID] = useState("")



  const Delete_Post = async () => {
    try {
      setDeleting_Please(true)
      await axios.delete(
        `http://localhost:8000/api/v2/post/${Confirm_deletionnID}`,
        {
          headers: { Authorization: `Bearer ${cookies.token}` },
        }
      );
      setDeleting_Please(false)
      setConfirm_deletionn(false)
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };


  const [showMenus, setShowMenus] = useState({});
  const toggleMenu = (event, id) => {
    setShowMenus(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };


  return (
    <>
      <div className="home">
        <div className="container">
          {Confirm_deletionn ? (<div className="Confirm_deletion" >
            <div className="Confirm_delet">
              <div className="card-content">
                <p className="card-heading">Delete post ?</p>
                {Deleting_Please ? <p className="card-description">Deleting Please wait....</p> : <p className="card-description">Are you sure you want to delete this post ? It cannot be recovered after deletion !</p>}

              </div>
              <div className="card-button-wrapper">
                <button className="card-button secondary" onClick={() => setConfirm_deletionn(false)}>Cancel</button>
                <button className="card-button primary" onClick={Delete_Post}>Delete</button>
              </div>
              <button className="exit-button" onClick={() => setConfirm_deletionn(false)}>
                <svg height="20px" viewBox="0 0 384 512">
                  <path
                    d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>) : null}

          <Menu />

          <div className="main_profile_post">
            {relod_1 ? (
              <Loading_main />
            ) : (
              <>
                <div className="profile">
                  <div className="back_img">
                    <img
                      src={
                        MyData.Cover_image
                          ? `http://localhost:8000/user/${MyData.Cover_image}`
                          : "./image/back1.jpg"
                      }
                      alt=""
                    />
                  </div>
                  <div className="profile_all">
<img
  src={
    MyData.profilImage
      ? MyData.profilImage.startsWith("http")
        ? MyData.profilImage
        : `http://localhost:8000/user/${MyData.profilImage}`
      : "/image/pngegg.png"
  }
  alt={`Image of ${MyData.name}`}
/>
                    <h2>{MyData.name}</h2>
                    <div className="info_me">
                      <h3>Information:</h3>
                      {MyData.address ? <p><span>Addres: </span> {MyData.address}</p> : null}
                      {MyData.phone ? <p><span>Phone: </span> {MyData.phone}</p> : null}
                      <p><span>Email: </span> {MyData.email}</p>
                    </div>

                    <button onClick={() => Navigate("/update_profile")}>Update</button>
                  </div>
                </div>
                {MyData.description && MyData.role === "employee" ? (
                  <div className="description_profile">
                    <h3>Description:</h3>
                    {MyData.description}
                  </div>
                ) : null}
                <Create_menu />
                <div className="bosts">
                  {posts.length === 0 ? (
                    <h2>
                      {MyData.name} has not published any posts yet. Stay tuned
                      for the latest news and events soon!📢
                    </h2>
                  ) : (
                    posts.map((post, index) => {
                      if (post.type === "post_1") {
                        const itemsPerPage = 2;

                        const handleNext = (postId) => {
                          setPageByPost((prevPages) => {
                            const currentPagee = prevPages[postId] || 0;
                            if (
                              (currentPagee + 1) * itemsPerPage <
                              post.boxes.length
                            ) {
                              return {
                                ...prevPages,
                                [postId]: currentPagee + 1,
                              };
                            }
                            return prevPages;
                          });
                        };

                        const handlePrev = (postId) => {
                          setPageByPost((prevPages) => {
                            const currentPagee = prevPages[postId] || 0;
                            if (currentPagee > 0) {
                              return {
                                ...prevPages,
                                [postId]: currentPagee - 1,
                              };
                            }
                            return prevPages;
                          });
                        };

                        const currentPagee = pageByPost[post._id] || 0;
                        const currentBoxes = post.boxes.slice(
                          currentPagee * itemsPerPage,
                          (currentPagee + 1) * itemsPerPage
                        );

                        return (
                          <div
                            key={index}
                            className="all_bost click_and_listen posts1">
                            <div key={post._id} className="remove_div-but">
                              {/* أيقونة النقاط الثلاث */}
                              <FontAwesomeIcon
                                className="buttonnn"
                                icon={faEllipsisVertical}
                                onClick={(e) => toggleMenu(e, post._id)} // تمرير الـ event والإحداثيات
                                style={{ cursor: "pointer" }}
                              />

                              {/* قائمة الحذف */}
                              <div
                                id={`remove_but-${post._id}`} // إضافة ID خاص بكل قائمة
                                className="remove_but"
                                style={{
                                  display: showMenus[post._id] ? "block" : "none", // عرض/إخفاء بناءً على الـ ID
                                }}
                              >
                                <p
                                  onClick={() => {
                                    setConfirm_deletionnID(post._id);
                                    setConfirm_deletionn(true);
                                  }}
                                >
                                  <span><FontAwesomeIcon icon={faTrash} /></span> Remove
                                </p>
                              </div>
                            </div>
                            <div className="name_shoole">
                              <img
                                src={
                                  post.user
                                    ? `http://localhost:8000/user/${post.user.profilImage}`
                                    : "/image/pngegg.png"
                                }
                                alt=""
                              />
                              <div className="date_shoole">
                                <p>{post.user ? post.user.name : null}</p>
                                <span>
                                  {formatDistanceToNow(
                                    new Date(post.createdAt),
                                    { addSuffix: true }
                                  )}
                                </span>
                              </div>
                            </div>
                            <h2>Click on the image and listen</h2>
                            <div className="click_listen">
                              {currentBoxes.map((pos) => {
                                const handlePlayAudio = (audioId) => {
                                  const audioElement =
                                    document.getElementById(audioId);
                                  if (audioElement) {
                                    audioElement.play();
                                  }
                                };

                                return (
                                  <div
                                    className="click_img"
                                    onClick={() => handlePlayAudio(pos._id)}
                                    style={{ cursor: "pointer" }}
                                    key={pos._id}
                                  >
                                    <img
                                      src={
                                        pos
                                          ? `http://localhost:8000/posts/${pos.postImage}`
                                          : null
                                      }
                                      alt={`Image ${pos._id}`}
                                    />
                                    <audio
                                      id={pos._id}
                                      src={
                                        pos
                                          ? `http://localhost:8000/posts/${pos.postAudio}`
                                          : null
                                      }
                                    ></audio>
                                    <p>{pos ? pos.word : null}</p>
                                  </div>
                                );
                              })}
                            </div>

                            {/* أزرار التنقل المخصصة */}
                            <div className="pagination-controls">
                              <button
                                onClick={() => handlePrev(post._id)}
                                disabled={currentPagee === 0}
                              >
                                <FontAwesomeIcon icon={faChevronLeft} />
                              </button>
                              <span>
                                {currentPagee + 1}/
                                {Math.ceil(post.boxes.length / itemsPerPage)}
                              </span>
                              <button
                                onClick={() => handleNext(post._id)}
                                disabled={
                                  (currentPagee + 1) * itemsPerPage >=
                                  post.boxes.length
                                }
                              >
                                <FontAwesomeIcon icon={faChevronRight} />
                              </button>
                            </div>
                            <div className="comment_lenght">
                              <p>
                                Comments : <span>{post.comments.length}</span>
                              </p>
                              <p>
                                Like : <span>{post.likes.length}</span>
                              </p>
                            </div>
                            <div className="interaction">
                              <div className="inter">
                                {Relod_likee && Relod_likeeid === post._id ? (
                                  <Relod_like />
                                ) : (
                                  <FontAwesomeIcon
                                    onClick={() => {
                                      Likes(post._id);
                                      setRelod_likeeid(post._id);
                                    }}
                                    icon={faHeart}
                                    className={`inter-icon 
                                  ${post.likes.includes(Mydata)
                                        ? "active_hart"
                                        : ""
                                      }`}
                                  />
                                )}
                                <FontAwesomeIcon
                                  icon={faComment}
                                  className="inter-icon"
                                  onClick={() => {
                                    handleCommentClick(post._id);
                                    addNewQuestion_com();
                                  }}
                                />
                              </div>
                              {relod_Bookmark && bookMark === post._id ? (
                                <Loading_Bookmark />
                              ) : (
                                <FontAwesomeIcon
                                  onClick={() => {
                                    bookMarks(post._id);
                                    handleBook(post._id);
                                  }}
                                  className={`inter-icon
                      
        ${bookId && bookId.some((item) => item.post?._id === post._id)
                                      ? "active_book"
                                      : ""
                                    }`}
                                  icon={faBookmark}
                                />
                              )}
                            </div>
                            {showCommentForPostId === post._id && (
                              <div className="blore">
                                <div className="comments">
                                  <div className="publisher">
                                    <FontAwesomeIcon
                                      className="out_icon"
                                      onClick={handleCloseComment}
                                      icon={faTimes}
                                    />
                                    <p>
                                      publication <span>{post.user.name}</span>
                                    </p>
                                  </div>
                                  <div className="comment">
                                    {post.comments.map((com, index) => (
                                      <div key={index} className="com">
                                        <img
                                          src={
                                            com.user_comment.profilImage
                                              ? `http://localhost:8000/user/${com.user_comment.profilImage}`
                                              : "/image/pngegg.png"
                                          }
                                          alt={`Image of ${com.user_comment.name}`}
                                        />
                                        <div className="name_user_comment">
                                          <span>{com.user_comment.name}</span>
                                          <p style={{ whiteSpace: "pre-line" }}>
                                            {com.comment}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                    {relod_coment ? <Loading_coment /> : null}
                                  </div>
                                  <form
                                    action=""
                                    onSubmit={(e) => Commentary(post._id, e)}
                                  >
                                    <input
                                      type="text"
                                      placeholder="Write a comment..."
                                      ref={inputRef}
                                    />
                                    <button
                                      type="submit"
                                      onClick={addNewQuestion}
                                    >
                                      Send
                                    </button>
                                  </form>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      } else if (post.type === "post_2") {
                        return (
                          <div
                            key={index}
                            className="all_bost choose_the_correct_answer My_profile"
                          >
                            <div key={post._id} className="remove_div-but">
                              {/* أيقونة النقاط الثلاث */}
                              <FontAwesomeIcon
                                className="buttonnn"
                                icon={faEllipsisVertical}
                                onClick={(e) => toggleMenu(e, post._id)} // تمرير الـ event والإحداثيات
                                style={{ cursor: "pointer" }}
                              />

                              {/* قائمة الحذف */}
                              <div
                                id={`remove_but-${post._id}`} // إضافة ID خاص بكل قائمة
                                className="remove_but"
                                style={{
                                  display: showMenus[post._id] ? "block" : "none", // عرض/إخفاء بناءً على الـ ID
                                }}
                              >
                                <p
                                  onClick={() => {
                                    setConfirm_deletionnID(post._id);
                                    setConfirm_deletionn(true);
                                  }}
                                >
                                  <span><FontAwesomeIcon icon={faTrash} /></span> Remove
                                </p>
                              </div>
                            </div>


                            <div className="name_shoole">
                              <img
                                src={
                                  post.user
                                    ? `http://localhost:8000/user/${post.user.profilImage}`
                                    : "/image/pngegg.png"
                                }
                                alt={`Image of ${post.name}`}
                              />
                              <div className="date_shoole">
                                <p>{post.user ? post.user.name : null}</p>

                                <span>
                                  {formatDistanceToNow(
                                    new Date(post.createdAt),
                                    { addSuffix: true }
                                  )}
                                </span>
                              </div>

                            </div>
                            <div className="choose_answer">
                              <h2>Choose the correct answer!!!</h2>
                              {(() => {
                                if (!post || !post.questions) return null;

                                const questionsPerPage = 1;
                                const startIndex =
                                  (pages[post._id] || 0) * questionsPerPage;
                                const endIndex = startIndex + questionsPerPage;
                                const visibleQuestions = post.questions.slice(
                                  startIndex,
                                  endIndex
                                );

                                const currentPage = pages[post._id] || 0;

                                const handlePrev = () => {
                                  if (currentPage > 0) {
                                    setPages((prev) => ({
                                      ...prev,
                                      [post._id]: currentPage - 1,
                                    }));
                                  }
                                };

                                const handleNext = () => {
                                  const totalQuestions = post.questions.length;
                                  if (
                                    (currentPage + 1) * questionsPerPage <
                                    totalQuestions
                                  ) {
                                    setPages((prev) => ({
                                      ...prev,
                                      [post._id]: currentPage + 1,
                                    }));
                                  }
                                };
                                const handleAnswer = (questionId, answer) => {
                                  setLocalAnswers((prev) => ({
                                    ...prev,
                                    [questionId]: answer,
                                  }));
                                  chick_post_2(post._id, questionId, answer); // لازم نستناه
                                };

                                return (
                                  <>
                                    {visibleQuestions.map((res) => {
                                      const solved = solvedPost_2?.find(
                                        (p) => p.postId === post._id
                                      );
                                      const question = solved?.result.find(
                                        (q) => q.questionId === res._id
                                      );
                                      const userAnswer = localAnswers[res._id];
                                      const isCorrect = question?.isCorrect;
                                      const correctAnswer =
                                        question?.correctAnswer; // اجابة السيرفر الصحيحة
                                      const isAnswered =
                                        isCorrect !== undefined;

                                      return (
                                        <div
                                          className="qustion_choose"
                                          key={res._id}
                                        >
                                          <h3>{res.question}</h3>

                                          {[
                                            "Answer_1",
                                            "Answer_2",
                                            "Answer_3",
                                            "Answer_4",
                                          ].map((key, idx) => {
                                            const answerText = res[key];
                                            let answerClass = "answer";

                                            if (isAnswered) {
                                              if (
                                                answerText === correctAnswer
                                              ) {
                                                answerClass += " active_true";
                                              } else {
                                                answerClass += " active_false";
                                              }
                                            }
                                            return (
                                              <div key={idx}>
                                                <div
                                                  className={answerClass}
                                                  onClick={() => {
                                                    if (!isAnswered) {
                                                      setid(res._id);
                                                      setrelod(true);
                                                      handleAnswer(
                                                        res._id,
                                                        answerText
                                                      );
                                                      setlod(!lod);
                                                    }
                                                  }}
                                                >
                                                  <p>
                                                    {String.fromCharCode(
                                                      65 + idx
                                                    )}
                                                    - {answerText}
                                                  </p>
                                                  {relod && id === res._id ? (
                                                    <Relod_post />
                                                  ) : null}
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      );
                                    })}

                                    <div className="pagination-controls">
                                      <button
                                        onClick={handlePrev}
                                        disabled={currentPage === 0}
                                      >
                                        <FontAwesomeIcon icon={faChevronLeft} />
                                      </button>
                                      <span>
                                        {currentPage + 1}/
                                        {Math.ceil(
                                          post.questions.length /
                                          questionsPerPage
                                        )}
                                      </span>
                                      <button
                                        onClick={handleNext}
                                        disabled={
                                          (currentPage + 1) *
                                          questionsPerPage >=
                                          post.questions.length
                                        }
                                      >
                                        <FontAwesomeIcon
                                          icon={faChevronRight}
                                        />
                                      </button>
                                    </div>
                                  </>
                                );
                              })()}
                            </div>
                            <div className="comment_lenght">
                              <p>
                                Comments : <span>{post.comments.length}</span>
                              </p>
                              <p>
                                Like : <span>{post.likes.length}</span>
                              </p>
                            </div>
                            <div className="interaction">
                              <div className="inter">
                                {Relod_likee && Relod_likeeid === post._id ? (
                                  <Relod_like />
                                ) : (
                                  <FontAwesomeIcon
                                    onClick={() => {
                                      Likes(post._id);
                                      setRelod_likeeid(post._id);
                                    }}
                                    icon={faHeart}
                                    className={`inter-icon 
                                  ${post.likes.includes(Mydata)
                                        ? "active_hart"
                                        : ""
                                      }`}
                                  />
                                )}
                                <FontAwesomeIcon
                                  icon={faComment}
                                  className="inter-icon"
                                  onClick={() => {
                                    handleCommentClick(post._id);
                                    addNewQuestion_com();
                                  }}
                                />
                              </div>
                              {relod_Bookmark && bookMark === post._id ? (
                                <Loading_Bookmark />
                              ) : (
                                <FontAwesomeIcon
                                  onClick={() => {
                                    bookMarks(post._id);
                                    handleBook(post._id);
                                  }}
                                  className={`inter-icon
                      
        ${bookId && bookId.some((item) => item.post?._id === post._id)
                                      ? "active_book"
                                      : ""
                                    }`}
                                  icon={faBookmark}
                                />
                              )}
                            </div>
                            {showCommentForPostId === post._id && (
                              <div className="blore">
                                <div className="comments">
                                  <div className="publisher">
                                    <FontAwesomeIcon
                                      className="out_icon"
                                      onClick={handleCloseComment}
                                      icon={faTimes}
                                    />
                                    <p>
                                      publication <span>{post.user.name}</span>
                                    </p>
                                  </div>
                                  <div className="comment">
                                    {post.comments.map((com, index) => (
                                      <div key={index} className="com">
                                        <img
                                          src={
                                            com.user_comment.profilImage
                                              ? `http://localhost:8000/user/${com.user_comment.profilImage}`
                                              : "/image/pngegg.png"
                                          }
                                          alt={`Image of ${com.user_comment.name}`}
                                        />
                                        <div className="name_user_comment">
                                          <span>{com.user_comment.name}</span>
                                          <p style={{ whiteSpace: "pre-line" }}>
                                            {com.comment}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                    {relod_coment ? <Loading_coment /> : null}
                                  </div>
                                  <form
                                    action=""
                                    onSubmit={(e) => Commentary(post._id, e)}
                                  >
                                    <input
                                      type="text"
                                      placeholder="Write a comment..."
                                      ref={inputRef}
                                    />
                                    <button
                                      type="submit"
                                      onClick={addNewQuestion}
                                    >
                                      Send
                                    </button>
                                  </form>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      } else if (post.type === "post_3") {
                        return (
                          <div
                            key={index}
                            className="all_bost bost_true_or-false posts3"
                          >
                            <div key={post._id} className="remove_div-but">
                              {/* أيقونة النقاط الثلاث */}
                              <FontAwesomeIcon
                                className="buttonnn"
                                icon={faEllipsisVertical}
                                onClick={(e) => toggleMenu(e, post._id)} // تمرير الـ event والإحداثيات
                                style={{ cursor: "pointer" }}
                              />

                              {/* قائمة الحذف */}
                              <div
                                id={`remove_but-${post._id}`} // إضافة ID خاص بكل قائمة
                                className="remove_but"
                                style={{
                                  display: showMenus[post._id] ? "block" : "none", // عرض/إخفاء بناءً على الـ ID
                                }}
                              >
                                <p
                                  onClick={() => {
                                    setConfirm_deletionnID(post._id);
                                    setConfirm_deletionn(true);
                                  }}
                                >
                                  <span><FontAwesomeIcon icon={faTrash} /></span> Remove
                                </p>
                              </div>
                            </div>
                            <div className="name_shoole">
                              <img
                                src={
                                  post.user
                                    ? `http://localhost:8000/user/${post.user.profilImage}`
                                    : "/image/pngegg.png"
                                }
                                alt=""
                              />
                              <div className="date_shoole">
                                <p>{post.user.name}</p>
                                <span>
                                  {formatDistanceToNow(
                                    new Date(post.createdAt),
                                    { addSuffix: true }
                                  )}
                                </span>
                              </div>
                            </div>
                            <h2>True Or False!!!</h2>
                            {(() => {
                              if (!post || !post.questions) return null;

                              // لتخزين الأيقونات النشطة لكل سؤال
                              const questionsPerPage = 5;
                              const startIndex =
                                (pages[post._id] || 0) * questionsPerPage;
                              const endIndex = startIndex + questionsPerPage;
                              const visibleQuestions = post.questions.slice(
                                startIndex,
                                endIndex
                              );

                              const currentPage = pages[post._id] || 0;

                              const handlePrev = () => {
                                const currentPage = pages[post._id] || 0;
                                if (currentPage > 0) {
                                  setPages((prev) => ({
                                    ...prev,
                                    [post._id]: currentPage - 1,
                                  }));
                                }
                              };

                              const handleNext = () => {
                                const current = pages[post._id] || 0;
                                const totalQuestions = post.questions.length;

                                if (
                                  (current + 1) * questionsPerPage <
                                  totalQuestions
                                ) {
                                  setPages((prev) => ({
                                    ...prev,
                                    [post._id]: current + 1,
                                  }));
                                }
                              };

                              const toggleActiveIcon = (
                                questionId,
                                iconType
                              ) => {
                                setActiveIcon((prev) => ({
                                  ...prev,
                                  [questionId]: iconType,
                                }));
                              };
                              const handleAnswer = (questionId, answer) => {
                                // تخزين الإجابة مؤقتاً
                                setLocalAnswers((prev) => ({
                                  ...prev,
                                  [questionId]: answer,
                                }));

                                // إرسال الإجابة للسيرفر
                                chick_post_3(
                                  post._id,
                                  questionId,
                                  answer ? true : false
                                );
                              };

                              return (
                                <>
                                  {visibleQuestions.map((item, index) => {
                                    const solved = solvedPost_3?.find(
                                      (p) => p.postId === post._id
                                    );
                                    const question = solved?.result.find(
                                      (q) => q.questionId === item._id
                                    );

                                    // const local = localAnswers[item._id];
                                    const isCorrect = question?.isCorrect;

                                    // أول شيء الكلاس:
                                    const answerClass =
                                      isCorrect !== undefined
                                        ? `que_tr_or_fa ${isCorrect
                                          ? "active_true"
                                          : "active_false"
                                        }`
                                        : "que_tr_or_fa";

                                    const iconClass =
                                      isCorrect !== undefined
                                        ? `icon_true_or_false ${isCorrect ? "iconnone" : "iconnone"
                                        }`
                                        : "icon_true_or_false";

                                    return (
                                      <div
                                        className="true_or_false"
                                        key={item._id}
                                      >
                                        <div className={answerClass}>
                                          <p>{item.question}</p>
                                          {relod && id === item._id ? (
                                            <Relod_post />
                                          ) : (
                                            <div className={iconClass}>
                                              <FontAwesomeIcon
                                                icon={faTimes}
                                                className="error-icon"
                                                onClick={() => {
                                                  setid(item._id);
                                                  setrelod(true);
                                                  toggleActiveIcon(
                                                    item._id,
                                                    "error"
                                                  );
                                                  handleAnswer(item._id, false);
                                                  setlod(!lod);
                                                }}
                                              />
                                              <FontAwesomeIcon
                                                icon={faCheck}
                                                className="check-icon"
                                                onClick={() => {
                                                  setid(item._id);
                                                  setrelod(true);
                                                  toggleActiveIcon(
                                                    item._id,
                                                    "check"
                                                  );
                                                  handleAnswer(item._id, true);
                                                  setlod(!lod);
                                                }}
                                              />
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}

                                  <div className="pagination-controls">
                                    <button
                                      onClick={handlePrev}
                                      disabled={currentPage === 0}
                                    >
                                      <FontAwesomeIcon icon={faChevronLeft} />
                                    </button>
                                    <span>
                                      {currentPage + 1}/
                                      {Math.ceil(
                                        post.questions.length / questionsPerPage
                                      )}
                                    </span>
                                    <button
                                      onClick={handleNext}
                                      disabled={
                                        (currentPage + 1) * questionsPerPage >=
                                        post.questions.length
                                      }
                                    >
                                      <FontAwesomeIcon icon={faChevronRight} />
                                    </button>
                                  </div>
                                </>
                              );
                            })()}

                            <div className="comment_lenght">
                              <p>
                                Comments : <span>{post.comments.length}</span>
                              </p>
                              <p>
                                Like : <span>{post.likes.length}</span>
                              </p>
                            </div>
                            <div className="interaction">
                              <div className="inter">
                                {Relod_likee && Relod_likeeid === post._id ? (
                                  <Relod_like />
                                ) : (
                                  <FontAwesomeIcon
                                    onClick={() => {
                                      Likes(post._id);
                                      setRelod_likeeid(post._id);
                                    }}
                                    icon={faHeart}
                                    className={`inter-icon 
                                  ${post.likes.includes(Mydata)
                                        ? "active_hart"
                                        : ""
                                      }`}
                                  />
                                )}
                                <FontAwesomeIcon
                                  icon={faComment}
                                  className="inter-icon"
                                  onClick={() => {
                                    handleCommentClick(post._id);
                                    addNewQuestion_com();
                                  }}
                                />
                              </div>
                              {relod_Bookmark && bookMark === post._id ? (
                                <Loading_Bookmark />
                              ) : (
                                <FontAwesomeIcon
                                  onClick={() => {
                                    bookMarks(post._id);
                                    handleBook(post._id);
                                  }}
                                  className={`inter-icon
                      
        ${bookId && bookId.some((item) => item.post?._id === post._id)
                                      ? "active_book"
                                      : ""
                                    }`}
                                  icon={faBookmark}
                                />
                              )}
                            </div>
                            {showCommentForPostId === post._id && (
                              <div className="blore">
                                <div className="comments">
                                  <div className="publisher">
                                    <FontAwesomeIcon
                                      className="out_icon"
                                      onClick={handleCloseComment}
                                      icon={faTimes}
                                    />
                                    <p>
                                      publication <span>{post.user.name}</span>
                                    </p>
                                  </div>
                                  <div className="comment">
                                    {post.comments.map((com, index) => (
                                      <div key={index} className="com">
                                        <img
                                          src={
                                            com.user_comment.profilImage
                                              ? `http://localhost:8000/user/${com.user_comment.profilImage}`
                                              : "/image/pngegg.png"
                                          }
                                          alt={`Image of ${com.user_comment.name}`}
                                        />
                                        <div className="name_user_comment">
                                          <span>{com.user_comment.name}</span>
                                          <p style={{ whiteSpace: "pre-line" }}>
                                            {com.comment}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                    {relod_coment ? <Loading_coment /> : null}
                                  </div>
                                  <form
                                    action=""
                                    onSubmit={(e) => Commentary(post._id, e)}
                                  >
                                    <input
                                      type="text"
                                      placeholder="Write a comment..."
                                      ref={inputRef}
                                    />
                                    <button
                                      type="submit"
                                      onClick={addNewQuestion}
                                    >
                                      Send
                                    </button>
                                  </form>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      } else if (post.type === "post_4") {
                        return (
                          <div
                            key={index}
                            className="all_bost image_and_answer posts4"
                          >

                            <div key={post._id} className="remove_div-but">
                              {/* أيقونة النقاط الثلاث */}
                              <FontAwesomeIcon
                                className="buttonnn"
                                icon={faEllipsisVertical}
                                onClick={(e) => toggleMenu(e, post._id)} // تمرير الـ event والإحداثيات
                                style={{ cursor: "pointer" }}
                              />

                              {/* قائمة الحذف */}
                              <div
                                id={`remove_but-${post._id}`} // إضافة ID خاص بكل قائمة
                                className="remove_but"
                                style={{
                                  display: showMenus[post._id] ? "block" : "none", // عرض/إخفاء بناءً على الـ ID
                                }}
                              >
                                <p
                                  onClick={() => {
                                    setConfirm_deletionnID(post._id);
                                    setConfirm_deletionn(true);
                                  }}
                                >
                                  <span><FontAwesomeIcon icon={faTrash} /></span> Remove
                                </p>
                              </div>
                            </div>
                            <div className="name_shoole">
                              <img
                                src={
                                  post.user
                                    ? `http://localhost:8000/user/${post.user.profilImage}`
                                    : "/image/pngegg.png"
                                }
                                alt=""
                              />
                              <div className="date_shoole">
                                <p>{post.user ? post.user.name : null}</p>
                                <span>
                                  {formatDistanceToNow(
                                    new Date(post.createdAt),
                                    { addSuffix: true }
                                  )}
                                </span>
                              </div>
                            </div>
                            {(() => {
                              if (!post || !post.questions) return null;

                              const questionsPerPage = 1;
                              const currentPage =
                                questionIndices[post._id] || 0;

                              const startIndex = currentPage * questionsPerPage;
                              const endIndex = startIndex + questionsPerPage;
                              const visibleQuestions = post.questions.slice(
                                startIndex,
                                endIndex
                              );

                              const handlePrev = () => {
                                if (currentPage > 0) {
                                  setQuestionIndices((prev) => ({
                                    ...prev,
                                    [post._id]: currentPage - 1,
                                  }));
                                }
                              };

                              const handleNext = () => {
                                const totalQuestions = post.questions.length;
                                if (
                                  (currentPage + 1) * questionsPerPage <
                                  totalQuestions
                                ) {
                                  setQuestionIndices((prev) => ({
                                    ...prev,
                                    [post._id]: currentPage + 1,
                                  }));
                                }
                              };

                              const handleAnswer = (questionId, answer) => {
                                setLocalAnswers((prev) => ({
                                  ...prev,
                                  [questionId]: answer,
                                }));
                                chick_post_4(post._id, questionId, answer);
                              };

                              return (
                                <>
                                  {visibleQuestions.map((item) => {
                                    const solved = solvedPost_4?.find(
                                      (p) => p.postId === post._id
                                    );
                                    const question = solved?.result.find(
                                      (q) => q.questionId === item._id
                                    );

                                    const userAnswer = localAnswers[item._id];
                                    const isCorrect = question?.isCorrect;
                                    const correctAnswer =
                                      question?.correctAnswer;
                                    const isAnswered = isCorrect !== undefined;

                                    return (
                                      <div
                                        className="image_answer"
                                        key={item._id}
                                      >
                                        <h2>What's in the picture?</h2>
                                        <div className="img_ans">
                                          <img
                                            src={`http://localhost:8000/posts/${item.img}`}
                                            alt="Question"
                                          />
                                          <div className="anwser">
                                            {[
                                              "word_1",
                                              "word_2",
                                              "word_3",
                                              "word_4",
                                            ].map((key, idx) => {
                                              const word = item[key];

                                              let answerClass = "testans";

                                              if (isAnswered) {
                                                if (word === correctAnswer) {
                                                  answerClass += " active_true";
                                                } else {
                                                  answerClass +=
                                                    " active_false";
                                                }
                                              }

                                              return (
                                                <div
                                                  key={idx}
                                                  className={answerClass}
                                                  onClick={() => {
                                                    if (!isAnswered) {
                                                      setid(item._id);
                                                      setrelod(true);
                                                      handleAnswer(
                                                        item._id,
                                                        word
                                                      );
                                                      setlod(!lod);
                                                    }
                                                  }}
                                                >
                                                  {String.fromCharCode(
                                                    65 + idx
                                                  )}
                                                  - {word}
                                                  {relod && id === item._id ? (
                                                    <Relod_post />
                                                  ) : null}
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}

                                  <div className="pagination-controls">
                                    <button
                                      onClick={handlePrev}
                                      disabled={currentPage === 0}
                                    >
                                      <FontAwesomeIcon icon={faChevronLeft} />
                                    </button>
                                    <span>
                                      {currentPage + 1}/
                                      {Math.ceil(
                                        post.questions.length / questionsPerPage
                                      )}
                                    </span>
                                    <button
                                      onClick={handleNext}
                                      disabled={
                                        (currentPage + 1) * questionsPerPage >=
                                        post.questions.length
                                      }
                                    >
                                      <FontAwesomeIcon icon={faChevronRight} />
                                    </button>
                                  </div>
                                </>
                              );
                            })()}

                            <div className="comment_lenght">
                              <p>
                                Comments : <span>{post.comments.length}</span>
                              </p>
                              <p>
                                Like : <span>{post.likes.length}</span>
                              </p>
                            </div>

                            <div className="interaction">
                              <div className="inter">
                                {Relod_likee && Relod_likeeid === post._id ? (
                                  <Relod_like />
                                ) : (
                                  <FontAwesomeIcon
                                    onClick={() => {
                                      Likes(post._id);
                                      setRelod_likeeid(post._id);
                                    }}
                                    icon={faHeart}
                                    className={`inter-icon 
                                  ${post.likes.includes(Mydata)
                                        ? "active_hart"
                                        : ""
                                      }`}
                                  />
                                )}
                                <FontAwesomeIcon
                                  icon={faComment}
                                  className="inter-icon"
                                  onClick={() => {
                                    handleCommentClick(post._id);
                                    addNewQuestion_com();
                                  }}
                                />
                              </div>
                              {relod_Bookmark && bookMark === post._id ? (
                                <Loading_Bookmark />
                              ) : (
                                <FontAwesomeIcon
                                  onClick={() => {
                                    bookMarks(post._id);
                                    handleBook(post._id);
                                  }}
                                  className={`inter-icon
                      
        ${bookId && bookId.some((item) => item.post?._id === post._id)
                                      ? "active_book"
                                      : ""
                                    }`}
                                  icon={faBookmark}
                                />
                              )}
                            </div>

                            {showCommentForPostId === post._id && (
                              <div className="blore">
                                <div className="comments">
                                  <div className="publisher">
                                    <FontAwesomeIcon
                                      className="out_icon"
                                      onClick={handleCloseComment}
                                      icon={faTimes}
                                    />
                                    <p>
                                      publication <span>{post.user.name}</span>
                                    </p>
                                  </div>
                                  <div className="comment">
                                    {post.comments.map((com, idx) => (
                                      <div key={idx} className="com">
                                        <img
                                          src={
                                            com.user_comment.profilImage
                                              ? `http://localhost:8000/user/${com.user_comment.profilImage}`
                                              : "/image/pngegg.png"
                                          }
                                          alt={`Image of ${com.user_comment.name}`}
                                        />
                                        <div className="name_user_comment">
                                          <span>{com.user_comment.name}</span>
                                          <p style={{ whiteSpace: "pre-line" }}>
                                            {com.comment}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                    {relod_coment ? <Loading_coment /> : null}
                                  </div>
                                  <form
                                    action=""
                                    onSubmit={(e) => Commentary(post._id, e)}
                                  >
                                    <input
                                      type="text"
                                      placeholder="Write a comment..."
                                      ref={inputRef}
                                    />
                                    <button
                                      type="submit"
                                      onClick={addNewQuestion}
                                    >
                                      Send
                                    </button>
                                  </form>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      } else if (post.type === "post_5") {
                        return (
                          <div
                            key={index}
                            className="all_bost video_img_word posts4"
                          >
      <div key={post._id} className="remove_div-but">
        {/* أيقونة النقاط الثلاث */}
        <FontAwesomeIcon
          className="buttonnn"
          icon={faEllipsisVertical}
          onClick={(e) => toggleMenu(e, post._id)} // تمرير الـ event والإحداثيات
          style={{ cursor: "pointer" }}
        />

        {/* قائمة الحذف */}
        <div
          id={`remove_but-${post._id}`} // إضافة ID خاص بكل قائمة
          className="remove_but"
          style={{
            display: showMenus[post._id] ? "block" : "none", // عرض/إخفاء بناءً على الـ ID
            position: "absolute", // استخدم position absolute لتحديد مكان القائمة
          }}
        >
          <p
            onClick={() => {
              setConfirm_deletionnID(post._id);
              setConfirm_deletionn(true);
            }}
          >
            <span><FontAwesomeIcon icon={faTrash} /></span> Remove
          </p>
        </div>
      </div>
                            <div className="name_shoole">
                              <img
                                src={
                                  post.user
                                    ? `http://localhost:8000/user/${post.user.profilImage}`
                                    : "/image/pngegg.png"
                                }
                                alt=""
                              />
                              <div className="date_shoole">
                                <p>{post.user.name}</p>
                                <span>
                                  {formatDistanceToNow(
                                    new Date(post.createdAt),
                                    { addSuffix: true }
                                  )}
                                </span>
                              </div>
                            </div>
                            <div className="image_video_word">
                              <p style={{ whiteSpace: "pre-line" }}>
                                {post.writing ? post.writing : null}
                              </p>
                              <img
                                src={
                                  post.img_post
                                    ? `http://localhost:8000/posts/${post.img_post}`
                                    : null
                                }
                                alt=""
                              />
                              {post.video_post ? (
                                <video
                                  src={`http://localhost:8000/posts/${post.video_post}`}
                                  controls
                                ></video>
                              ) : null}

                              <div className="comment_lenght">
                                <p>
                                  Comments : <span>{post.comments.length}</span>
                                </p>
                                <p>
                                  Like : <span>{post.likes.length}</span>
                                </p>
                              </div>
                            </div>
                            <div className="interaction">
                              <div className="inter">
                                {Relod_likee && Relod_likeeid === post._id ? (
                                  <Relod_like />
                                ) : (
                                  <FontAwesomeIcon
                                    onClick={() => {
                                      Likes(post._id);
                                      setRelod_likeeid(post._id);
                                    }}
                                    icon={faHeart}
                                    className={`inter-icon 
                                  ${post.likes.includes(Mydata)
                                        ? "active_hart"
                                        : ""
                                      }`}
                                  />
                                )}
                                <FontAwesomeIcon
                                  icon={faComment}
                                  className="inter-icon"
                                  onClick={() => {
                                    handleCommentClick(post._id);
                                    addNewQuestion_com();
                                  }}
                                />
                              </div>
                              {relod_Bookmark && bookMark === post._id ? (
                                <Loading_Bookmark />
                              ) : (
                                <FontAwesomeIcon
                                  onClick={() => {
                                    bookMarks(post._id);
                                    handleBook(post._id);
                                  }}
                                  className={`inter-icon
                      
        ${bookId && bookId.some((item) => item.post?._id === post._id)
                                      ? "active_book"
                                      : ""
                                    }`}
                                  icon={faBookmark}
                                />
                              )}
                            </div>
                            {showCommentForPostId === post._id && (
                              <div className="blore">
                                <div className="comments">
                                  <div className="publisher">
                                    <FontAwesomeIcon
                                      className="out_icon"
                                      onClick={handleCloseComment}
                                      icon={faTimes}
                                    />
                                    <p>
                                      publication <span>{post.user.name}</span>
                                    </p>
                                  </div>
                                  <div className="comment" ref={bottomRef}>
                                    {post.comments.map((com, index) => (
                                      <div key={index} className="com">
                                        <img
                                          src={
                                            com.user_comment
                                              ? com.user_comment.profilImage
                                                ? `http://localhost:8000/user/${com.user_comment.profilImage}`
                                                : "/image/pngegg.png"
                                              : "/image/pngegg.png"
                                          }
                                          alt={`Image of ${com.user_comment.name}`}
                                        />
                                        <div className="name_user_comment">
                                          <span>{com.user_comment.name}</span>
                                          <span
                                            style={{ whiteSpace: "pre-line" }}
                                          >
                                            {com.comment}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  <form
                                    action=""
                                    onSubmit={(e) => Commentary(post._id, e)}
                                  >
                                    <input
                                      type="text"
                                      placeholder="Write a comment..."
                                      ref={inputRef}
                                    />
                                    <button
                                      type="submit"
                                      onClick={addNewQuestion}
                                    >
                                      Send
                                    </button>
                                  </form>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      } else if (post.type === "post_6") {
                        return (
                          <div key={index} className="all_bost ifrems posts6">
                            {/* <button className="buttonnn" type="button" onClick={() => { setConfirm_deletionnID(post._id); setConfirm_deletionn(true) }}>
                              <span className="button__text">Delete</span>
                              <span className="button__icon">
                                <svg
                                  className="svg"
                                  height="24"
                                  viewBox="0 0 512 512"
                                  width="24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M112,112l20,320c.95,18.49,14.4,32,32,32H348c17.67,0,30.87-13.51,32-32l20-320"
                                    style={{
                                      fill: "none",
                                      stroke: "#fff",
                                      strokeLinecap: "round",
                                      strokeLinejoin: "round",
                                      strokeWidth: "32px",
                                    }}
                                  />
                                  <line
                                    x1="80"
                                    x2="432"
                                    y1="112"
                                    y2="112"
                                    style={{
                                      stroke: "#fff",
                                      strokeLinecap: "round",
                                      strokeMiterlimit: "10",
                                      strokeWidth: "32px",
                                    }}
                                  />
                                </svg>
                              </span>
                            </button> */}
                            <div key={post._id} className="remove_div-but">
                              {/* أيقونة النقاط الثلاث */}
                              <FontAwesomeIcon
                                className="buttonnn"
                                icon={faEllipsisVertical}
                                onClick={(e) => toggleMenu(e, post._id)} // تمرير الـ event والإحداثيات
                                style={{ cursor: "pointer" }}
                              />

                              {/* قائمة الحذف */}
                              <div
                                id={`remove_but-${post._id}`} // إضافة ID خاص بكل قائمة
                                className="remove_but"
                                style={{
                                  display: showMenus[post._id] ? "block" : "none", // عرض/إخفاء بناءً على الـ ID
                                }}
                              >
                                <p
                                  onClick={() => {
                                    setConfirm_deletionnID(post._id);
                                    setConfirm_deletionn(true);
                                  }}
                                >
                                  <span><FontAwesomeIcon icon={faTrash} /></span> Remove
                                </p>
                              </div>
                            </div>
                            <div className="name_shoole">
                              <img
                                src={
                                  post.user
                                    ? `http://localhost:8000/user/${post.user.profilImage}`
                                    : "/image/pngegg.png"
                                }
                                alt=""
                              />
                              <div className="date_shoole">
                                <p>{post.user ? post.user.name : null}</p>
                                <span>
                                  {formatDistanceToNow(
                                    new Date(post.createdAt),
                                    { addSuffix: true }
                                  )}
                                </span>
                              </div>
                            </div>
                            <div className="ifrem">
                              <h2>What's in the picture?</h2>
                              <p>{post.ifrem.des}</p>
                              <iframe
                                src={post.ifrem ? post.ifrem.url : null}
                                frameBorder="0"
                                width="100%"
                                height="569"
                                allowFullScreen
                                mozallowfullscreen="true"
                                webkitallowfullscreen="true"
                              />
                              <div className="comment_lenght">
                                <p>
                                  Comments : <span>{post.comments.length}</span>
                                </p>
                                <p>
                                  Like : <span>{post.likes.length}</span>
                                </p>
                              </div>
                            </div>
                            <div className="interaction">
                              <div className="inter">
                                {Relod_likee && Relod_likeeid === post._id ? (
                                  <Relod_like />
                                ) : (
                                  <FontAwesomeIcon
                                    onClick={() => {
                                      Likes(post._id);
                                      setRelod_likeeid(post._id);
                                    }}
                                    icon={faHeart}
                                    className={`inter-icon 
                                  ${post.likes.includes(Mydata)
                                        ? "active_hart"
                                        : ""
                                      }`}
                                  />
                                )}
                                <FontAwesomeIcon
                                  icon={faComment}
                                  className="inter-icon"
                                  onClick={() => {
                                    handleCommentClick(post._id);
                                    addNewQuestion_com();
                                  }}
                                />
                              </div>
                              {relod_Bookmark && bookMark === post._id ? (
                                <Loading_Bookmark />
                              ) : (
                                <FontAwesomeIcon
                                  onClick={() => {
                                    bookMarks(post._id);
                                    handleBook(post._id);
                                  }}
                                  className={`inter-icon
                      
        ${bookId && bookId.some((item) => item.post?._id === post._id)
                                      ? "active_book"
                                      : ""
                                    }`}
                                  icon={faBookmark}
                                />
                              )}
                            </div>
                            {showCommentForPostId === post._id && (
                              <div className="blore">
                                <div className="comments">
                                  <div className="publisher">
                                    <FontAwesomeIcon
                                      className="out_icon"
                                      onClick={handleCloseComment}
                                      icon={faTimes}
                                    />
                                    <p>
                                      publication <span>{post.user.name}</span>
                                    </p>
                                  </div>
                                  <div className="comment" ref={bottomRef}>
                                    {post.comments.map((com, index) => (
                                      <div key={index} className="com">
                                        <img
                                          src={
                                            com.user_comment
                                              ? com.user_comment.profilImage
                                                ? `http://localhost:8000/user/${com.user_comment.profilImage}`
                                                : "/image/pngegg.png"
                                              : "/image/pngegg.png"
                                          }
                                          alt={`Image of ${com.user_comment.name}`}
                                        />
                                        <div className="name_user_comment">
                                          <span>{com.user_comment.name}</span>
                                          <span
                                            style={{ whiteSpace: "pre-line" }}
                                          >
                                            {com.comment}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  <form
                                    action=""
                                    onSubmit={(e) => Commentary(post._id, e)}
                                  >
                                    <input
                                      type="text"
                                      placeholder="Write a comment..."
                                      ref={inputRef}
                                    />
                                    <button
                                      type="submit"
                                      onClick={addNewQuestion}
                                    >
                                      Send
                                    </button>
                                  </form>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      } else {
                        return null;
                      }
                    })
                  )}
                </div>
              </>
            )}
          </div>
          <Chat />
        </div>
      </div>
    </>
  );
};

export default Profile;
