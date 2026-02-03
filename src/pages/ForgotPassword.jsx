import { useState } from "react";
import API from '../api/api';
import Text from '../layout/Text';
import Card from '../layout/Card';
import notify from "../utils/notify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await API.post("/auth/forgot-password",{ email });

      setMsg(res.data.message || "Reset link sent to email");
      notify.success(res.data.message || "Reset link sent to email");
    } catch (err) {
      setMsg(err.response?.data?.message || "Something went wrong");
      notify.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="flex justify-center items-center ">
      <Card>
      <Text>Forgot Password</Text>

      <form onSubmit={handleSubmit} className=" grid">
        <input
          className="w-64 rounded-lg p-2 m-2 outline-none"
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button disabled={loading}>
          <Text>
          {loading ? "Sending..." : "Send Reset Link"}
          </Text>
        </button>
      </form>

      {msg && <Text>{msg}</Text>}
      </Card>
    </div>
  );
};



export default ForgotPassword;
