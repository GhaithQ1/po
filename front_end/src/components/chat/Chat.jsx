import React, { useState, useEffect } from 'react';
import './Chat.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import ChatBetweenUsers from '../ChatBetweenUsers/ChatBetweenUsers';
import axios from 'axios';
import { useUser } from '../Context';





const Chat = () => {
  const { setUserById } = useUser();
  const { userTheme ,setUserTheme} = useUser();
  const [cookies] = useCookies(["token"]);

  const [activeTab, setActiveTab] = useState('Primary');
  const {showChat, setShowChat} = useUser();
  const [sentRequests, setSentRequests] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const [myData, setMyData] = useState(null);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const [reloadToggle, setReloadToggle] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(true);

  // =============================================



// ====================================================

  const API = 'http://localhost:8000/api/v2';

  const headers = {
    headers: { Authorization: `Bearer ${cookies.token}` },
  };

  useEffect(() => {
    document.body.classList.add('chat-page');
    return () => document.body.classList.remove('chat-page');
  }, []);

  useEffect(() => {
    axios.get(`${API}/auth/get_date_my`, headers)
      .then(res => {
        const data = res.data.data;
        setMyData(data);
        setFriendRequests(data.Friend_requests);
        setFriends(data.friends);
        console.log(data)
      })
      .catch(console.error)
      .finally(() => setLoadingRequests(false));
  }, [loadingRequests]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      axios.get(`${API}/user?name=${searchTerm}`, headers)
        .then(res => setAllUsers(res.data.data))
        .catch(console.error);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  useEffect(() => {
    const savedRequests = JSON.parse(localStorage.getItem('sentRequests')) || {};
    setSentRequests(savedRequests);
  }, []);

  const sendFriendRequest = id => {
    axios.post(`${API}/auth/Send_friend_request/${id}`, {}, headers)
      .then(() => setReloadToggle(prev => !prev))
      .catch(console.error);
  };

  const handleSendRequest = id => {
    sendFriendRequest(id);
    const updated = { ...sentRequests, [id]: true };
    setSentRequests(updated);
    localStorage.setItem('sentRequests', JSON.stringify(updated));
  };

  const acceptRequest = id => {
    axios.post(`${API}/auth/Accept_friend_request/${id}`, {}, headers)
      .then(() => setLoadingRequests(prev => !prev))
      .catch(console.error);
  };

  const rejectRequest = id => {
    axios.post(`${API}/auth/Reject_friend_request/${id}`, {}, headers)
      .then(() => setReloadToggle(prev => !prev))
      .catch(console.error);
  };


  // ============================================================



  
    useEffect(() => {
      const ff = localStorage.getItem("theme")
      if(ff === "dark"){
        setUserTheme(true)
      }else{
        setUserTheme(false)
      }

    }, [userTheme]);

  // ============================================================
  return (
    <div className="chat">
      <div className="test">
        <h2>Messages</h2>
        <form onSubmit={e => e.preventDefault()}>
          <FontAwesomeIcon className="search_icon" icon={faSearch} />
          <input
            type="text"
            placeholder='search for people..'
            value={searchTerm}
            onFocus={() => setSearchTerm('')}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </form>

        <div className="request">
          {['Primary', 'General', 'Requests'].map(tab => (
            <p
              key={tab}
              className={activeTab === tab ? 'active' : ''}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </p>
          ))}
        </div>
      </div>

      {activeTab === 'Primary' && !showChat && (
        <div className="friends">
          {friends?.length ? friends.map(({ friend }, i) => (
            <div className="friend" key={i} onClick={() => { setShowChat(true); setUserById(friend._id); }}>
          <img
              src={
                friend.googleId
                  ? friend.profilImage || "/image/pngegg.png"
                  : friend.profilImage
                    ? `http://localhost:8000/user/${friend.profilImage}`
                    : "/image/pngegg.png"
              }
              alt={`Image of ${friend.name}`}
            />
              <p>{friend.name}</p>
            </div>
          )) : <img style={{margin: "auto" , width:"70%"}} src={userTheme  ?"/image/no-friend-requests-found (2).png" :  '/image/no-friend-requests-found (1).png'}/>}
        </div>
      )}

      {showChat && <ChatBetweenUsers />}

      {activeTab === 'Requests' && (
        <div className="the_requset">
          {friendRequests?.length ? friendRequests.map(({ friend }, i) => (
            <div className="req" key={i}>
              <div className="img_req">
              <img
              src={
                friend.googleId
                  ? friend.profilImage || "/image/pngegg.png"
                  : friend.profilImage
                    ? `http://localhost:8000/user/${friend.profilImage}`
                    : "/image/pngegg.png"
              }
              alt={`Image of ${friend.name}`}
            />
                <p>{friend.name}</p>
              </div>
              <div className="accept">
                <button onClick={() => rejectRequest(friend._id)}>Reject</button>
                <button onClick={() => acceptRequest(friend._id)}>Accept</button>
              </div>
            </div>
          )) : <img style={{margin: "auto" , width:"70%"}} src={userTheme ?"/image/no-friendship-requests (1).png" :  '/image/no-friendship-requests.png'}/>}
        </div>
      )}

      {activeTab === 'General' && (
        <div className="general">
          {allUsers?.length ? allUsers.filter(user => user._id !== myData?._id).map((user, i) => {
            const isFriend = friends?.some(f => f.friend._id === user._id);
            return !isFriend && (
              <div key={i} className="req">
                <div className="img_req">
                <img
              src={
                user.googleId
                  ? user.profilImage || "/image/pngegg.png"
                  : user.profilImage
                    ? `http://localhost:8000/user/${user.profilImage}`
                    : "/image/pngegg.png"
              }
              alt={`Image of ${user.name}`}
            />
                  <p>{user.name}</p>
                </div>
                <div className="accept">
                  <button
                    onClick={() => handleSendRequest(user._id)}
                    disabled={sentRequests[user._id]}
                    className={sentRequests[user._id] ? 'sent' : ''}
                    style={{
                      backgroundColor: sentRequests[user._id] ? 'white' : '',
                      color: sentRequests[user._id] ? 'black' : '',
                      border: sentRequests[user._id] ? 'none' : '',
                      cursor: sentRequests[user._id] ? 'default' : 'pointer',
                    }}
                  >
                    {sentRequests[user._id] ? 'Sent success' : 'Add a friend'}
                  </button>
                </div>
              </div>
            );
          }) : <p>No friends found</p>}
        </div>
      )}
    </div>
  );
};

export default Chat;
