import { useEffect, useState } from "react";
import API from "../api/api";
import Container from "../layout/Container";
import Card from "../layout/Card";
import Text from "../layout/Text";
import { useNavigate } from "react-router-dom";
import AvatarChooser from "../components/AvatarChooser";

import notify from "../utils/notify";
import CasteList from "../components/CasteList";
import { useCaste } from "../context/CasteContext";

const MyProfileEdit = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({});
  const [avatar, setAvatar] = useState(null);

  const [isHidden, setIsHidden] = useState(false);
  const { resCaste, setSearchCaste, searchCaste } =
    useCaste();

  const navigate = useNavigate();

  // not for render
  useEffect(() => {
    setProfile((prev) => ({ ...prev, caste: resCaste }));
  }, [resCaste]);

  /* ================= FIELD CONFIG WITH OPTIONS ================= */

  // const bioFields = [{ name: "bio", label: "Bio", type: "textarea", rows: 5, cols: 35 , placeholder: "Write something about yourself..." , maxLength: 500 }];

  const basicFields = [
    {
      name: "posted_by",
      label: "Profile Posted By",
      type: "select",
      options: ["Self", "Sibling", "Parents", "Relative", "Friend"],
    },
    {
      name: "name",
      label: "Name",
      type: "text",
    },
    {
      name: "caste",
      label: "Caste",
      type: "text",
    },
    {
      name: "gender",
      label: "Gender",
      type: "select",
      options: ["male", "female"],
    },
    {
      name: "age",
      label: "Age",
      type: "number",
    },
    {
      name: "city",
      label: "City",
      type: "text",
    },
  ];

  const personalFields = [
    {
      name: "dob",
      label: "Date of Birth",
      type: "date",
    },
    {
      name: "height",
      label: "Height (ft'inch)",
      type: "select",
      options: [
        "6'5",
        "6'3",
        "6",
        "5'10",
        "5'8",
        "5'6",
        "5'4",
        "5'2",
        "5",
        "4'10",
        "4'8",
        "4'6",
        "4'4",
        "4'2",
        "4",
        "3'10",
        "3'8",
        "3'6",
      ],
    },
    {
      name: "mother_tongue",
      label: "Mother Tongue",
      type: "select",
      options: ["Hindi", "English", "Bhojpuri", "Punjabi", "Other"],
    },
    {
      name: "diet_preferences",
      label: "Diet Preference",
      type: "select",
      options: ["Vegetarian", "Non-Vegetarian", "Eggetarian"],
    },
    {
      name: "education",
      label: "Education",
      type: "text",
      // type: "select",
      // options: ["10th", "12th", "Graduate", "Post Graduate", "Other"],
    },
    {
      name: "occupation",
      label: "Occupation (Job)",
      type: "text",
    },
    {
      name: "annual_income",
      label: "Annual Income",
      type: "select",
      options: ["Below 2L", "2L - 5L", "5L - 10L", "Above 10L"],
    },
  ];

  const contactFields = [
    {
      name: "phone",
      label: "Phone Number",
      type: "tel",
    },
    {
      name: "instagram",
      label: "Instagram",
      type: "url",
    },
    {
      name: "facebook",
      label: "Facebook",
      type: "url",
    },
    {
      name: "linkedin",
      label: "LinkedIn",
      type: "url",
    },
  ];

  /* ================= FETCH USER ================= */

  useEffect(() => {
    API.get("/users/me").then((res) => {
      setUser(res.data);
      setProfile(res.data);
      setAvatar(res.data?.profilePhoto);
      setIsHidden(res.data?.isProfileHidden); // 👈 important
    });
  }, []);

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveProfile = async () => {
    try {
      await API.put("/users/me", profile);
      notify.success("Profile updated successfully");
    } catch (err) {
      console.log(err);
      notify.error(err.response?.data?.message || "Something went wrong");
    }
  };

  // save avatar
  const saveAvatar = async () => {
    if (profile.profilePhoto === avatar) {
      notify.error("Please select an avatar first");
      return;
    }

    const profilePhoto = { profilePhoto: avatar };
    try {
      await API.put("/users/me", profilePhoto);
      notify.success("Avatar updated successfully");
    } catch (err) {
      console.log(err);
    }
  };

  if (!user) return <p>Loading...</p>;

  /* ================= FIELD RENDERER ================= */

  const renderField = (field) => {
    if (field.type === "select") {
      return (
        <select
          name={field.name}
          value={profile[field.name] || ""}
          onChange={handleChange}
          className="border p-2 w-full bg-yellow-300 outline-none"
        >
          <option value="">Select {field.label}</option>
          {field.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }
     
    return (
      <span>
        {field.name === "caste" ? (
          <span>
            {searchCaste &&
            (<span className="flex justify-center -top-48 relative ">
                <CasteList /> 
              </span>)
            }
            <input
              type={field.type} 
              name={field.name}
              value={resCaste || searchCaste || profile.caste}
              onChange={(e) =>
                setSearchCaste(e.target.value) +
                setProfile((prev) => ({
                  ...prev,
                  caste: resCaste,
                }))
              }
              placeholder={`enter your ${field.name}`}
              className="border p-2 w-full outline-none "
            />
          </span>
        ) : (
          <input
            type={field.type}
            name={field.name}
            value={profile[field.name] || ""}
            onChange={handleChange}
            placeholder={`enter your ${field.name}`}
            className="border p-2 w-full outline-none"
          />
        )}
      </span>
    );
  };

  // logout
  const loguot = () => {
    localStorage.removeItem("theme");
    localStorage.removeItem("token");
    navigate("/login");
  };
  // request password reset
  const resetPassword = () => {
    navigate("/forgot-password");
  };

  // avatar chooser component
  const ProfileSetup = () => {
    return (
      <>
        {avatar ? null : <AvatarChooser onSelect={setAvatar} />}

        {avatar && (
          <img src={avatar} className="w-40 h-40 mx-auto rounded-full" />
        )}
      </>
    );
  };
  {
    /* ================= SAVE BUTTON ================= */
  }
  const SaveButton = () => {
    return (
      <div className="flex justify-center ">
        <span
          onClick={saveProfile}
          className="cursor-pointer border px-1 py-1 rounded-lg font-bold bg-pink-500 text-white"
        >
          Save Profile
        </span>
      </div>
    );
  };

  // profile visibility toggle
  const toggleProfileVisibility = async () => {
    try {
      const res = await API.put("/users/me/hide");

      setIsHidden((prev) => !prev);
      notify.success(res.data.message);
    } catch (err) {
      console.log(err);
      notify.error("Failed to update visibility");
    }
  };

  // deactivate account
  const deactivateAccount = async () => {
    const confirm = window.confirm(
      "Are you sure? Your account will be deactivated.",
    );

    if (!confirm) return;

    try {
      await API.delete("/users/me");

      notify.success("Account deactivated successfully");

      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.log(err);
      notify.error("Account deactivation failed");
    }
  };

  return (
    <Container>
      <div className="grid justify-items-center ">
        {/* avatar  */}
        <Card>
          <ProfileSetup />
          <Text>
            <span className="flex justify-evenly m-2">
              <p
                onClick={() => setAvatar(null)}
                className="p-2 rounded-lg hover:bg-gradient-to-l from-indigo-500 via-purple-500 to-pink-500 cursor-pointer"
              >
                Choose Avatar{" "}
              </p>
              <p
                onClick={saveAvatar}
                className="p-2 rounded-lg hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 cursor-pointer"
              >
                Save Avatar{" "}
              </p>
            </span>
          </Text>
        </Card>

        {/* info */}

        {/* ================= BASIC DETAILS ================= */}
        <Card>
          <div className="grid gap-3 w-72 lg:w-96">
            <span className="flex justify-between">
              <Text>Basic Details</Text> <SaveButton />
            </span>
            {basicFields.map((field) => (
              <div key={field.name}>
                <Text>
                  <label className="text-sm">{field.label}</label>
                </Text>
                {renderField(field)}
              </div>
            ))}
          </div>
        </Card>

        {/* ================= PERSONAL DETAILS ================= */}
        <Card>
          <div className="grid gap-3 w-72 lg:w-96">
            <Text>Personal Details</Text>
            {personalFields.map((field) => (
              <div key={field.name}>
                <Text>
                  <label className="text-sm">{field.label}</label>
                </Text>
                {renderField(field)}
              </div>
            ))}
          </div>
        </Card>

        {/* ================= CONTACT DETAILS ================= */}
        <Card>
          <div className="grid gap-3 w-72 lg:w-96">
            <Text>Contact Details</Text>
            {contactFields.map((field) => (
              <div key={field.name}>
                <Text>
                  <label className="text-sm">{field.label}</label>
                </Text>
                {renderField(field)}
              </div>
            ))}
          </div>
        </Card>

        {/* ================= LOGOUT & RESET PASSWORD ================= */}
        <Text>
          <span className="flex justify-evenly m-2 p-3 w-72 border bg-gradient-to-br from-pink-500 to-blue-500 rounded-lg ">
            <p
              onClick={loguot}
              className="p-2 rounded-lg bg-slate-900  cursor-pointer"
            >
              Logout{" "}
            </p>
            <p
              onClick={resetPassword}
              className="p-2 rounded-lg bg-slate-700  cursor-pointer"
            >
              reset password{" "}
            </p>
          </span>
        </Text>
        {/* ================= PROFILE VISIBILITY TOGGLE ================= */}
        <Card>
          <div className="flex justify-between items-center w-72 lg:w-96">
            <Text>Profile Visibility</Text>

            <button
              onClick={toggleProfileVisibility}
              className={`px-3 py-1 rounded-lg text-white font-bold
        ${isHidden ? "bg-gray-500" : "bg-green-500"}`}
            >
              {isHidden ? "Hidden" : "Visible"}
            </button>
          </div>
        </Card>
        <Card>
          <div className="grid gap-2 w-72 lg:w-96 text-center">
            <Text className="text-red-600 font-bold">Danger Zone</Text>

            <button
              onClick={deactivateAccount}
              className="bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
            >
              Deactivate Account
            </button>
          </div>
        </Card>
      </div>
    </Container>
  );
};

export default MyProfileEdit;
