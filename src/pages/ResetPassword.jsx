import { useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import Card from "../layout/Card";
import Text from "../layout/Text";
import notify from "../utils/notify";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await API.post(
        `/auth/reset-password/${token}`,
        { password }
      );

      setMsg(res.data.message || "Password reset successful");
      notify.success(res.data.message || "Password reset successful");

      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);

    } catch (err) {
      setMsg(err.response?.data?.message || "Invalid or expired token");
      notify.error(err.response?.data?.message || "Invalid or expired token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center ">
      <Card>
      <Text>Reset Password</Text>

      <form onSubmit={handleSubmit} className="grid">
        <input
          className="w-64 rounded-lg p-2 m-2 outline-none"
          type="password"
          placeholder="New password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button disabled={loading}>
          <Text>
            {loading ? "Resetting..." : "Reset Password"}
          </Text>
        </button>
      </form>

      {msg && <Text>{msg}</Text>}
      </Card>
    </div>
  );
};


export default ResetPassword;
