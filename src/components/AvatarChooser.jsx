import { useState } from "react";
import { avatars } from "../assets/avatar";
import SubT from "../layout/SubT";

const AvatarChooser = ({ onSelect }) => {
  const [gender, setGender] = useState("male");
  const [selected, setSelected] = useState(null);

  const list = avatars[gender];

  const selectAvatar = (img) => {
    setSelected(img);
    onSelect?.(img); // parent ko bhejo
  };

  return (
  // <Card>
    <div className=" rounded-xl p-4 shadow-md w-64 h-72 lg:w-96 overflow-scroll scroll-smooth no-scrollbar ">
      
      <span className=" flex justify-center mb-3 ">
        <SubT>Choose Your Avatar</SubT>
      </span>

      {/* Gender Toggle */}
      <div className="flex justify-center gap-3 mb-4">
        {["male", "female"].map(g => (
          <button
            key={g}
            onClick={() => setGender(g)}
            className={`px-4 py-1 rounded-full border
              ${gender === g ? "bg-green-500 text-white" : "bg-gray-100"}
            `}
          >
            {g.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Avatar Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {list.map((img, i) => (
          <div
            key={i}
            onClick={() => selectAvatar(img)}
            className={`cursor-pointer rounded-lg overflow-hidden border-2
              ${selected === img ? "border-green-500 scale-105" : "border-transparent"}
              transition`}
          >
            <img
              src={img}
              alt="avatar"
              className="w-full h-24 object-cover"
            />
          </div>
        ))}
      </div>
      
    </div>
    // </Card>
  );
};

export default AvatarChooser;
