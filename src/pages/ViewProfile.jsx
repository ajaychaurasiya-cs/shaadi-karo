import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/api";
import Container from "../layout/Container";
import Card from "../layout/Card";
import SubT from "../layout/SubT";
import {
  FaBookReader,
  FaComment,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaMale,
  FaRupeeSign,
} from "react-icons/fa";
import {
  MdCalendarMonth,
  MdFoodBank,
  MdLanguage,
  MdLocationPin,
  MdManageAccounts,
  MdPeople,
  MdPermContactCalendar,
  MdWork,
} from "react-icons/md";
import Text from "../layout/Text";

const ViewProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    API.get(`/users/${id}`).then((res) => setUser(res.data));
  }, [id]);

  if (!user) return <p>Loading...</p>;

  return (
    <>
      <Container>
        {/* <Card> */}
        <div className=" grid justify-items-center backdrop-blur-sm p-1 bg-gradient-to-b from-[#00000080] to-[#ec489a81] rounded-lg ">
          <div className="w-96 grid justify-items-center lg:flex lg:justify-center lg:items-center ">
            <img className="w-40 h-40 rounded-lg" src={user.profilePhoto} />
            <Card>
              <span className="grid">
                <SubT>{user.name}</SubT>
                <Text>
                  {user.age}, {user.city}, {user.occupation}
                </Text>
              </span>

              <div className=" flex justify-around items-center">
                <Text>connect</Text>

                <div className=" m-5 p-2 rounded-md bg-pink-200 bg-opacity-50 flex gap-5 text-xl text-white">
                  <a
                    href={user.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaInstagram className="bg-pink-400 rounded-sm " />
                  </a>
                  <a
                    href={user.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaFacebookF className="bg-blue-500 rounded-sm" />
                  </a>
                  <a
                    href={user.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaLinkedinIn className="bg-sky-500 rounded-sm" />
                  </a>
                </div>
                <span className=" m-5 p-2 rounded-md bg-pink-200 bg-opacity-50 flex justify-around">
                  <Link to={`/chat/${id}`}>
                    <SubT>
                      <FaComment />
                    </SubT>
                  </Link>
                </span>
              </div>
              <span className=" bg-opacity-80 bg-pink-900 rounded-lg p-2 mb-3 flex">
                <Text>
                  <span className="flex items-center gap-2">
                    <MdManageAccounts size={25} /> Manage by Id:{" "}
                    {user.posted_by}
                  </span>
                </Text>
              </span>
            </Card>
          </div>

          <Card>
            <div className="w-72 lg:w-auto grid">
              <span className="flex justify-center mb-2 ">
                <SubT>Bio data</SubT>
              </span>

              <Text>
                <span className="grid lg:flex gap-2 ">
                  <div className="grid gap-2">
                    <span className="bg-yellow-800 grid rounded-lg p-2">
                      <p className="flex gap-2">
                        <MdPeople size={25} />
                        Caste: {user.caste}
                      </p>
                      <p className="flex gap-2">
                        <MdLanguage size={25} /> Mother Tongue:{" "}
                        {user.mother_tongue}
                      </p>
                      <p className="flex gap-2">
                        <MdFoodBank size={25} /> Diet Preferences:{" "}
                        {user.diet_preferences}
                      </p>
                    </span>

                    <div className="  p-2 rounded-md bg-opacity-90 bg-slate-700  gap-5 ">
                      <p className="flex gap-2">
                        <MdPermContactCalendar size={25} /> Age: {user.age}
                      </p>
                      <p className="flex gap-2">
                        <FaMale size={25} /> Height: {user.height}
                      </p>
                      <p className="flex gap-2">
                        <MdCalendarMonth size={25} /> Date of brith:{" "}
                        {user.dob && user.dob.slice(0, 15)}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <div className="  p-2 rounded-md bg-opacity-90 bg-red-900  gap-5 ">
                      <p className="flex gap-2">
                        <FaBookReader size={25} /> Education: {user.education}
                      </p>
                      <p className="flex gap-2">
                        <MdWork size={25} /> Occupation: {user.occupation}
                      </p>
                      <p className="flex gap-2">
                        <FaRupeeSign size={25} /> Annual Income:{" "}
                        {user.annual_income}
                      </p>
                    </div>

                    <span className=" bg-slate-800  grid rounded-lg p-2">
                      <p className="flex gap-2">
                        <MdLocationPin size={25} /> City: {user.city}
                      </p>
                    </span>
                  </div>
                </span>
              </Text>
            </div>
          </Card>
        </div>
        {/* </Card> */}
      </Container>
    </>
  );
};

export default ViewProfile;
