import { useEffect, useState } from "react";
import API from "../api/api";
import Container from "../layout/Container";
import Card from "../layout/Card";
import SubT from "../layout/SubT";
import { useCaste } from "../context/CasteContext";
import notify from "../utils/notify";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    gender: "",
    caste: "",
    email: "",
    password: "",
  });

  const token = localStorage.getItem("token");

  const { caste, setSearchCaste, searchCaste } = useCaste();

  const register = async () => {
    if (
      !form.name ||
      !form.gender ||
      !form.caste ||
      !form.email ||
      !form.password
    ) {
      return notify.error("Please enter all fields");
    }

    try {
      const res = await API.post("/auth/register", form);

      notify.success(res.data?.message || "Registered successfully");
      window.location.href = "/login";
    } catch (err) {
      notify.error(err.response?.data?.message || "Registration failed");
    }
  };

  useEffect(() => {
    if (token) {
      window.location.href = "/";
    }
  }, [token]);

  // show caste list when search make component

  const CasteList = () => {
    return (
      <span className=" bg-opacity-50 rounded-lg absolute top-0 bg-pink-100 px-5 backdrop-blur-xl w-full h-44 overflow-scroll no-scrollbar ">
        {form.caste
          ? caste.slice(0, 10).map((c, i) => {
              return (
                <option
                  className="m-1 px-2 bg-white bg-opacity-50 "
                  key={i}
                  onClick={(e) => {
                    (setForm({ ...form, caste: e.target.value }),
                      setSearchCaste(""));
                  }}
                  value={c}
                >
                  {c}
                </option>
              );
            })
          : null}
      </span>
    );
  };



  return (
    <Container>
      <Card>
        <div className="grid justify-items-center gap-5 w-64 lg:w-96">
          <h1>Register</h1>

          <input
            className="p-2 w-64 outline-none rounded-lg"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <select
            className="p-2 w-64 outline-none rounded-lg bg-white"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <section className="grid">
            {searchCaste &&<span className="flex justify-center ">
              {caste==[]? null: <CasteList />}
              
            </span>}
           
            <input
              className="p-2 w-64 outline-none rounded-lg"
              placeholder="first search Caste then select"
              value={form.caste || searchCaste}
              onChange={(e) =>
                setForm({ ...form, caste: e.target.value }) ||
                setSearchCaste(e.target.value)
              }
            />
          </section>

          <input
            className="p-2 w-64 outline-none rounded-lg"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            className="p-2 w-64 outline-none rounded-lg"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            className="bg-pink-900 p-1 rounded-lg w-40 hover:bg-pink-500"
            onClick={register}
          >
            <SubT>Register</SubT>
          </button>
        </div>
      </Card>
    </Container>
  );
};

export default Register;
