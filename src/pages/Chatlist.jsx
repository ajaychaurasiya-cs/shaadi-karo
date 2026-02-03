import { useEffect, useState } from "react";
import API from "../api/api";
import Container from "../layout/Container";
import Card from "../layout/Card";
import SubT from "../layout/SubT";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

const Chatlist = () => {
  const [views, setViews] = useState([]);

  const getUserlist = async () => {
    try {
      const res = await API.get("/chat/users/list");
      setViews(res.data);
      // whenever user opens chat screen
      localStorage.setItem("chatLastSeen", Date.now());
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUserlist();
  }, []);

  //date format 
  const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};


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

  return (
    <Container>
      <Card>
        <SubT>chat list</SubT>
        <div className="w-72 lg:w-96 h-[30rem] no-scrollbar overflow-y-scroll  scroll-smooth ">
          {views.map((v) => {
            const msgDate = new Date(v.lastTime).toDateString();
            const showDate = msgDate !== lastDate;

            if (showDate) lastDate = msgDate;

            return (
              <div key={v.userId}>
                {/* USER CARD */}
                <div className="grid gap-5">
                  <span className="bg-rose-500 p-3 m-3 rounded-lg flex justify-between items-center">
                    <Link to={`/chat/${v.userId}`}>
                      <span className="font-bold text-white flex items-center gap-5">
                        {v.profilePhoto ? (
                          <img
                            className="w-8 h-8 rounded-full border"
                            src={v.profilePhoto}
                            alt="img"
                          />
                        ) : (
                          <span className="bg-green-500 rounded-full p-2">
                            <FaUser />
                          </span>
                        )}

                        <span className="grid justify-items-start">
                          {v.name?.slice(0, 15)}
                          <p className="font-normal text-gray-100 text-xs">
                            {v.lastMessage.length > 25
                              ? v.lastMessage.slice(0, 25) + "..."
                              : v.lastMessage}
                          </p>
                        </span>
                  
                      </span>
                    </Link>
                    <span className=" text-black text-xs rounded-lg ">
                      {getDateLabel(v.lastTime)}
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </Container>
  );
};

export default Chatlist;
