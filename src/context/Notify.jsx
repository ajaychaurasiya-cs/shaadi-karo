import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/api";

export const NotifyContext = createContext(null);

export const useNotify = () => useContext(NotifyContext);

const token = localStorage.getItem("token")


export const NotifyProvider = ({ children }) => {
  const [chatNoti, setChatNoti] = useState(false);
  const [viewerNoti, setViewerNoti] = useState({
    hasNew: false,
    list: []
  });
  


  useEffect(() => {
    if(!token){
      return;
    }
    /* ================= CHAT NOTIFICATION ================= */
    API.get("/chat/users/list")
      .then(res => {
        const lastSeen =
          Number(localStorage.getItem("chatLastSeen")) || 0;

        const hasNewMessage = res.data.some(
          chat => new Date(chat.lastTime).getTime() > lastSeen
        );

        setChatNoti(hasNewMessage);
      })
      .catch(() => setChatNoti(false));

    /* ================= VIEWER NOTIFICATION ================= */
API.get("/users/viewers/list")
  .then(res => {
    const lastSeen =
      Number(localStorage.getItem("viewerLastSeen")) || 0;

    const list = res.data
      .map(v => ({
        ...v,
        isNew: new Date(v.updatedAt).getTime() > lastSeen
      }))
      // 🔥 SORT BY updatedAt ONLY
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    setViewerNoti({
      hasNew: list.some(v => v.isNew),
      list
    });
  });



  }, [token]);

  return (
    <NotifyContext.Provider
      value={{
        viewerNoti,
        setViewerNoti,
        chatNoti,
        setChatNoti,
      }}
    >
      {children}
    </NotifyContext.Provider>
  );
};
