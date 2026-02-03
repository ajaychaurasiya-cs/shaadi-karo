import { FaCheckCircle, FaHeart } from "react-icons/fa";
import API from "../api/api";
import { useEffect, useState } from "react";
import notify from "../utils/notify";

const Connect = ({ receiverId }) => {
  const [love, setLove] = useState(false);

  const sendMessage = async () => {
    const text = "hi, i like your profile";
    try {
      await API.post("/chat/sendChat", {
        receiver: receiverId,
        text,
        flagged: false,
      });
      // false value setlocal
      localStorage.setItem("chatLastSeen", Date.now());
      // alert("connected");
      setLove(true);
    } catch (err) {
      console.log(err);
     notify.error(err.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (!love) return;

    const timer = setTimeout(() => {
      setLove(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [love]);

  return (
    <span
      className={`cursor-pointer p-1 bg-pink-500 rounded-lg text-white ${love && `animate-ping`}`}
    >
      {/* {love?'':<FaHeart size={20} onClick={sendMessage} />} */}
      <FaHeart size={20} onClick={sendMessage} />
    </span>
  );
};

export default Connect;
