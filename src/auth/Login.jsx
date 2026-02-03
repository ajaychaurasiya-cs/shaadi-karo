import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router";
import Container from "../layout/Container";
import Card from "../layout/Card";
import Text from "../layout/Text";
import SubT from "../layout/SubT";
import notify from "../utils/notify";

const token = localStorage.getItem("token");

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const login = async () => {
    try {
    const res = await API.post("auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      //
      window.location.href = "/";
    } catch (error) {
      notify.error(error.response?.data?.message || "Login failed");
    }
  };

  useEffect(() => {
    if (token) return (window.location.href = "/");
  }, []);

  return (
    <>
      <Container>
        <Card>
          <div className="grid justify-items-center gap-5 w-64 lg:w-96">
            <h1>Login</h1>
            <input
              className="p-2 w-64 outline-none rounded-lg"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="p-2 w-64 outline-none rounded-lg"
              placeholder="Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="bg-pink-900 p-1 rounded-lg w-40 hover:bg-pink-500" onClick={login}>
              <SubT>Login</SubT>{" "}
            </button>
             <Text>
              <span className="flex items-center gap-2">
            <button className=" p-2 rounded-lg hover:bg-pink-500" onClick={() => navigate("/forgot-password")}>For get Password</button> |
            <button className=" p-2 rounded-lg hover:bg-pink-500" onClick={() => navigate("/register")}>Register</button>
            </span>
          </Text>
          </div>
         
        </Card>
      </Container>
    </>
  );
};

export default Login;
