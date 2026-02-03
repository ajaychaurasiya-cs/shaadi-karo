import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";

import Container from "../layout/Container";
import Card from "../layout/Card";
import SubT from "../layout/SubT";
import Text from "../layout/Text";
import { useNotify } from "../context/notify";

const Viewers = () => {
  const { viewerNoti, setViewerNoti } = useNotify();

  /* ================= MARK AS SEEN ================= */
  useEffect(() => {
    localStorage.setItem("viewerLastSeen", Date.now());

    setViewerNoti((prev) => ({
      ...prev,
      hasNew: false,
      list: prev.list.map((v) => ({ ...v, isNew: false })),
    }));
  }, [setViewerNoti]);

  /* ================= DATE HELPERS ================= */
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getDateLabel = (date) => {
    const msgDate = new Date(date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (msgDate.toDateString() === today.toDateString()) return "Today";
    if (msgDate.toDateString() === yesterday.toDateString()) return "Yesterday";

    return formatDate(date);
  };

  /* ================= GROUP BY DATE ================= */
  const groupedViews = viewerNoti.list.reduce((acc, v) => {
    const key = new Date(v.updatedAt).toDateString();
    if (!acc[key]) acc[key] = [];
    acc[key].push(v);
    return acc;
  }, {});

  /* ================= SORT DATES (NEW DAY ON TOP) ================= */
  const sortedDates = Object.keys(groupedViews).sort(
    (a, b) => new Date(b) - new Date(a),
  );

  return (
    <Container>
      <Card>
        <SubT>Who Viewed My Profile</SubT>

        <div className="w-72 lg:w-96 h-[30rem] overflow-y-scroll scroll-smooth no-scrollbar">
          {sortedDates.map((date) => (
            <div key={date}>
              {/* 👤 VIEWERS OF THIS DATE */}
              {groupedViews[date].map((v) => (
                <div key={v._id} className="grid gap-5">
                  <span className="relative bg-pink-500 p-3 m-3 rounded-lg flex justify-between items-center">
                    <Link to={`/user/${v.viewer._id}`}>
                      <span className="flex items-center gap-5 font-bold text-white">
                        {v.viewer.profilePhoto ? (
                          <img
                            src={v.viewer.profilePhoto}
                            className="w-8 h-8 rounded-full border"
                            alt="profile"
                          />
                        ) : (
                          <span className="bg-pink-900 rounded-full p-2">
                            <FaUser />
                          </span>
                        )}

                        <span className="grid justify-items-start">
                          <Text>{v.viewer.name}</Text>
                          <p className="font-normal text-xs">{v.viewer.city}</p>
                        </span>
                      </span>
                    </Link>
                    <span className=" text-black text-xs rounded-lg ">
                      {getDateLabel(date)}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Card>
    </Container>
  );
};

export default Viewers;
