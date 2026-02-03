import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../api/api";
import Card from "../layout/Card";
import Container from "../layout/Container";
import SubT from "../layout/SubT";

import { MdClose, MdDelete, MdMoreVert, MdSend } from "react-icons/md";
import { FaUser, FaArrowLeft } from "react-icons/fa";
import { useNotify } from "../context/notify";
import notify from "../utils/notify";
import BlockUser from "../components/BlockUser";

const Chat = () => {
  const { id: receiverId } = useParams();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [lastTime, setLastTime] = useState(null);

  const [isActive, setIsActive] = useState(true);
  const [tabVisible, setTabVisible] = useState(!document.hidden);

  const [deleteBin, setDeleteBin] = useState(false);
  const [isMore, setIsMore] = useState(false);

  // get user info
  const [userInfo, setUserInfo] = useState([]);

  const intervalRef = useRef(null);
  const idleTimerRef = useRef(null);

  const { setChatNoti } = useNotify();

  /* =======================
     LOAD CHAT (OPTIMIZED)
  ======================= */
  const loadChats = async () => {
    try {
      const url = lastTime
        ? `/chat/${receiverId}?after=${lastTime}`
        : `/chat/${receiverId}`;

      const res = await API.get(url);

      if (res.data.length > 0) {
        setMessages((prev) => {
          const ids = new Set(prev.map((m) => m._id));
          const fresh = res.data.filter((m) => !ids.has(m._id));
          return [...prev, ...fresh];
        });

        setLastTime(res.data[res.data.length - 1].createdAt);
      }
      // false value setlocal
      localStorage.setItem("chatLastSeen", Date.now());
      setChatNoti(false);
    } catch (err) {
      console.log(err);
    }
  };

  /* =======================
     USER ACTIVITY TRACK
  ======================= */
  useEffect(() => {
    const markActive = () => {
      setIsActive(true);
      clearTimeout(idleTimerRef.current);

      idleTimerRef.current = setTimeout(() => {
        setIsActive(false); // 20 sec idle
      }, 20000);
    };

    window.addEventListener("mousemove", markActive);
    window.addEventListener("keydown", markActive);
    window.addEventListener("click", markActive);

    markActive();

    return () => {
      window.removeEventListener("mousemove", markActive);
      window.removeEventListener("keydown", markActive);
      window.removeEventListener("click", markActive);
      clearTimeout(idleTimerRef.current);
    };
  }, []);

  /* =======================
     TAB VISIBILITY
  ======================= */
  useEffect(() => {
    const handleVisibility = () => {
      setTabVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  /* =======================
     SMART POLLING
  ======================= */
  useEffect(() => {
    if (!receiverId) return;

    if (isActive && tabVisible) {
      loadChats();

      intervalRef.current = setInterval(loadChats, 5000);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [receiverId, isActive, tabVisible]);

  /* =======================
     SEND MESSAGE
  ======================= */
  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      const res = await API.post("/chat/sendChat", {
        receiver: receiverId,
        text,
        flagged: false,
      });

      setMessages((prev) => [...prev, res.data]);
      setText("");
    } catch (err) {
      console.log(err);
      notify.error(
        err.response?.data?.message || "Request failed or user blocked",
      );
    }
  };

  // auto scroll to bottom
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // show timestamp of last message

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  // get date separator
  const getDateLabel = (date) => {
    const msgDate = new Date(date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (msgDate.toDateString() === today.toDateString()) return "Today";

    if (msgDate.toDateString() === yesterday.toDateString()) return "Yesterday";

    return formatDate(date);
  };
  let lastDate = null;
  /* =======================
     delete MESSAGE
  ======================= */
  const deleteMessage = async (messageId) => {
    try {
      await API.delete(`/chat/${messageId}`);
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    } catch (err) {
      console.log(err);
    }
  };

  // show delelte bin
  const showBin = () => {
    return deleteBin ? setDeleteBin(false) : setDeleteBin(true);
  };

  // ===================
  // get user name
  // ===================
  useEffect(() => {
    const get = async () => {
      try {
        const res = await API.get(`/users/${receiverId}`);
        setUserInfo(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    get();
  }, [receiverId]);

  // show more options
  const showMore = () => {
    setIsMore((prev) => !prev);
  };

  // back btn history
  const backBtn = () => {
    window.history.back();
  };

  /* =======================
     UI
  ======================= */
  return (
    <div>
      <Container>
        <Card>
          <span className="flex justify-between items-center m-1">
            <span className="flex items-center gap-1">
              <FaArrowLeft onClick={backBtn} className="text-white text-lg " />
              <Link to={`/user/${receiverId}`}>
                <span className="font-bold text-white flex items-center gap-2">
                  {userInfo.profilePhoto ? (
                    <img
                      className="w-8 h-8 rounded-full border"
                      src={userInfo.profilePhoto}
                      alt="img"
                    />
                  ) : (
                    <span className="bg-green-500 rounded-full p-2">
                      <FaUser />
                    </span>
                  )}
                  <span className="grid justify-items-start">
                    {userInfo.name?.slice(0, 15)}
                  </span>
                </span>
              </Link>
            </span>

            <span className="flex items-center gap-1">
              <span
                onClick={showBin}
                className="bg-pink-900 hover:bg-pink-500 p-1 rounded-lg"
              >
                <SubT>
                  <MdDelete />
                </SubT>
              </span>

              <SubT>
                <MdMoreVert onClick={showMore} />
              </SubT>
            </span>
            {isMore && (
              <span
                onClick={showMore}
                className="absolute right-0 top-5 bg-gray-100 p-5 flex rounded-lg gap-5"
              >
                  <BlockUser /><MdClose />
              </span>
            )}
          </span>
          <div className=" no-scrollbar overflow-y-scroll  scroll-smooth h-96 ">
            {messages.map((msg) => {
              const msgDate = new Date(msg.createdAt).toDateString();
              const showDate = msgDate !== lastDate;

              if (showDate) lastDate = msgDate;

              return (
                <div key={msg._id}>
                  {/* DATE WATERMARK (ONCE PER DATE) */}
                  {showDate && (
                    <div className="flex justify-center my-3">
                      <span className="bg-gray-200 bg-opacity-50 text-black text-xs px-3 py-1 rounded-full">
                        {getDateLabel(msg.createdAt)}
                      </span>
                    </div>
                  )}
                  {msg.sender === receiverId ? (
                    <span className="flex justify-start text-wrap">
                      <span className="bg-yellow-200 m-1 p-1 rounded-bl-2xl rounded-r-2xl">
                        <p className="text-wrap min-w-10 max-w-48 lg:max-w-96">
                          {msg.text}
                        </p>
                        <p className="flex justify-end text-gray-500 text-xs">
                          {formatTime(msg.createdAt)}
                        </p>
                      </span>
                    </span>
                  ) : (
                    <span className="flex justify-end  ">
                      {deleteBin && (
                        <SubT>
                          <span onClick={() => deleteMessage(msg._id)}>
                            <MdDelete />
                          </span>
                        </SubT>
                      )}
                      <span className="bg-pink-200 border m-1 p-1 rounded-t-2xl rounded-bl-2xl ">
                        <p className="text-wrap max-w-48 lg:max-w-96">
                          {msg.text}
                        </p>
                        <p className="flex justify-end text-gray-500 text-xs">
                          {formatTime(msg.createdAt)}
                        </p>
                      </span>
                    </span>
                  )}

                  <div ref={bottomRef} />
                </div>
              );
            })}
          </div>

          <span className="flex items-center bg-white m-1  p-1 rounded-lg">
            <input
              className="rounded lg:w-96 p-1 outline-none"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type message..."
            />
            <button
              className="m-1 p-1 text-2xl text-white rounded-lg bg-pink-900 hover:bg-pink-500  "
              onClick={sendMessage}
            >
              <MdSend />
            </button>
          </span>
          <div style={{ marginTop: 10, fontSize: 12, color: "#666" }}>
            Status: {isActive && tabVisible ? "Online / Active" : "Inactive"}
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default Chat;
