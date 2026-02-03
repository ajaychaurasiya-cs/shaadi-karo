import { useEffect, useState } from "react";
import API from "../api/api";
import notify from "../utils/notify";
import { useParams } from "react-router-dom";

const BlockUser = () => {
    const [isBlocked, setIsBlocked] = useState(false);
    const {id} = useParams();

    useEffect(() => {
    API.get(`/users/blockedGet/${id}`)
      .then((res) => {
        setIsBlocked(res.data.isBlocked); 
        })
    },[]);

  const toggleBlockUser = async () => {
    try {
      const res = await API.post("/users/toggleBlockUser", { userId: id });
      setIsBlocked((prev) => !prev);

      notify.success(res.data.message || "Action successful");
    } catch (err) {
      console.log(err);
      notify.error(err.response?.data?.message || "Something went wrong");
    }


  };
  return (
    <span className="flex justify-center items-center ">
      <button
        onClick={toggleBlockUser}
        className={` ${isBlocked?"bg-gray-600":"bg-red-600"} text-white text-center font-semibold rounded-lg p-2 `}
      >
       {isBlocked?"Unblock User":"Block User"}
      </button>
    </span>
  );
};

export default BlockUser;
