import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useUser } from "../Context";
import EmojiPicker from "emoji-picker-react";
import Loading_main from "../Loading_Main/Loading_main";

const ChatBetweenUsers = () => {
  const { userById } = useUser();
  const [reload, setReload] = useState(false);
  const [loadingRequest, setLoadingRequest] = useState(true);
  const { setShowChat } = useUser();
  const [cookies] = useCookies(["token"]);
  const [sentRequests, setSentRequests] = useState({});
  const [Mydata, SetMydata] = useState();

  const [loadingMain , setLoadingMain] = useState(false)

  // ⚡️ Ref for auto-scroll
  const bottomRef = useRef(null);

  // ✅ دعم الرموز التعبيرية
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [input, setInput] = useState(""); // استخدام `input` بدلًا من `message` للحفاظ على التناسق

  const handleEmojiClick = (emojiObject) => {
    setInput((prevInput) => prevInput + emojiObject.emoji);
  };

  // =====================================================

  useEffect(() => {
    document.body.classList.add("chat-page");
    return () => {
      document.body.classList.remove("chat-page");
    };
  }, []);

  useEffect(() => {
    setLoadingMain(true)
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v2/auth/get_date_my", {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        SetMydata(res.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      })
      .finally(() => {
        setLoadingRequest(false);
      });
  }, []);

  const [chat, setChat] = useState([]);
  const user1Id = Mydata?._id;
  const [user2Id, setUser2Id] = useState(null);

  // 👇 التمرير للأسفل تلقائياً عند تغير المحادثة
  // useEffect(() => {
  //   setTimeout(() => {
  //     const messages = document.querySelectorAll('.message');
  //     if (messages.length > 0) {
  //       messages[messages.length - 1].scrollIntoView({ behavior: 'smooth' });
  //     }
  //   }, 100); // تعيين تأخير بسيط لضمان تنفيذ التمرير
  // }, []);

  useEffect(() => {
    if (!user1Id || !userById) return;

    // Create a unique chat ID for caching
    const chatCacheKey = `chat_${user1Id}_${userById._id}`;
    const lastMessageTimeKey = `last_message_time_${user1Id}_${userById._id}`;
    
    // Get the last message timestamp to check for new messages
    const getLastMessageTime = () => {
      if (chat.length === 0) return 0;
      const lastMessage = chat[chat.length - 1];
      return lastMessage.timestamp || 0;
    };

    const fetchChat = async () => {
      try {
        // Check if we need to fetch new data
        const lastMessageTime = localStorage.getItem(lastMessageTimeKey) || 0;
        
        const res = await axios.get(
          `http://localhost:8000/api/v2/chat/${user1Id}/${userById._id}`,
          {
            headers: {
              Authorization: `Bearer ${cookies.token}`,
            },
          }
        );

        const newMessages = res.data.data.messages;
        
        // Only update state if there are new messages
        if (JSON.stringify(newMessages) !== JSON.stringify(chat)) {
          setChat(newMessages);
          
          // Cache the messages
          localStorage.setItem(chatCacheKey, JSON.stringify(newMessages));
          
          // Update the last message timestamp
          if (newMessages.length > 0) {
            localStorage.setItem(lastMessageTimeKey, getLastMessageTime());
          }
        }
        
        setLoadingMain(false);
      } catch (err) {
        if (err.response?.data?.errors) {
          const formattedErrors = {};
          err.response.data.errors.forEach((error) => {
            formattedErrors[error.path] = error.msg;
          });
          console.log(formattedErrors);
        }
      }
    };

    // Try to load from cache first
    const cachedChat = localStorage.getItem(chatCacheKey);
    if (cachedChat) {
      setChat(JSON.parse(cachedChat));
      setLoadingMain(false);
    }

    // Then fetch fresh data
    fetchChat();
    
    // Use a more reasonable polling interval (3 seconds instead of 1)
    const interval = setInterval(fetchChat, 3000);
    return () => clearInterval(interval);
  }, [user1Id, userById, cookies.token]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const res = await axios.post(
        `http://localhost:8000/api/v2/chat`,
        {
          user1Id,
          user2Id: userById._id,
          content: input,
        },
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        }
      );

      setChat(res.data.chat.messages);
      setInput("");
    } catch (err) {
      console.error("فشل في الإرسال:", err.response?.data || err.message);
    }
  };

  return (
    <div className="chat-container">
      {loadingMain ? <Loading_main/> : ( <div className="chat-box">
        <div className="header_chat">
          <div className="user_img_name">
<img
  src={
    userById.profilImage
      ? userById.profilImage.startsWith("http")
        ? userById.profilImage
        : `http://localhost:8000/user/${userById.profilImage}`
      : "/image/pngegg.png"
  }
  alt={`Image of ${userById.name}`}
/>
            <p>{userById?.name}</p>
          </div>
         <FontAwesomeIcon
          className="search_icon"
          onClick={() => setShowChat(false)}
          icon={faTimes}
        /> 
        </div>
        
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.sender === Mydata?._id || msg.sender?._id === Mydata?._id
                ? "me"
                : "other"
            }`}
          >
            <p>{msg.content}</p>
            
          </div>
        ))}
        <div ref={bottomRef} />
      </div>) }
     

      {/* ✅ إدخال الرموز التعبيرية داخل مربع الإدخال */}
      <form className="chat-input" onSubmit={sendMessage}>

        <div className="Emoji_input">
          <span
          type="button"
          className="emoji-button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          😊
        </span>

        

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onClick={()=> setShowEmojiPicker(false)}
          placeholder="اكتب رسالة..."
        />
        </div>
        
        <button type="submit">Send</button>
      </form>
      {showEmojiPicker && <EmojiPicker height="calc(70% - 70px)" width="100%" style={{ position: "absolute", button: "50px", left: "0"}} onEmojiClick={handleEmojiClick} />}

    </div>
  );
};

export default ChatBetweenUsers;
