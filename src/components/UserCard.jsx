import { Link, useNavigate } from "react-router-dom";
import Card from "../layout/Card";
import Text from "../layout/Text";
import SubT from "../layout/SubT";
import Container from "../layout/Container";

import { MdLocationPin, MdMessage, MdPeople, MdWork } from "react-icons/md";
import { FaMale } from "react-icons/fa";
import Connect from "./Connect";

const UserCard = ({ user }) => {
  const navigate = useNavigate();

  return (
    <Container>
    <Card>
      <div className="flex justify-items-center w-64 gap-4 lg:w-96 lg:flex ">
        <Link to={`/user/${user._id}`}>
          <img
            className=" lg:max-w-40 max-w-24 h-40  object-cover rounded-lg"
            src={user.profilePhoto}
            // src={ userImg}
            alt={user.name}
          />
        </Link>

        <div className="w-64 lg:w-48 ">
          <Link to={`/user/${user._id}`}>
          <span className="grid">
            <SubT>{user.name}</SubT>
            <Text> <p className="flex items-center gap-2"><FaMale />{user.height} | {user.age} </p> </Text>
            <Text><p className="flex items-center gap-2"><MdPeople/> {user.caste} </p></Text>
            <Text><p className="flex items-center gap-2"><MdWork /> {user.occupation}</p></Text>
            <Text><p className="flex items-center gap-2"><MdLocationPin />{user.city}</p></Text>
            <Text>{user.gender}</Text>
            </span>
          </Link>

          <div className="flex justify-end gap-2">
            <Connect receiverId={user._id} />
            <span
              className="cursor-pointer p-1 bg-pink-500 rounded-lg text-white"
              onClick={() => navigate(`/chat/${user._id}`)}
            >
              <MdMessage size={20} />
            </span>
          </div>
        </div>
      </div>
    </Card>
    </Container>
  );
};

export default UserCard;
