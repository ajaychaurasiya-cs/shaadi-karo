import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SubT from "../layout/SubT";
import Card from "../layout/Card";
import { FaSadTear } from "react-icons/fa";
import API from "../api/api";
import notify from "../utils/notify";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    // 🔹 if already logged in → home
    const authToken = localStorage.getItem("token");
    if (authToken) {
      navigate("/");
      return;
    }

    const verify = async () => {
      try {
        await API.get(`/auth/verify-email/${token}`);
        setStatus("success");
        notify.success("Email verified successfully!");

        // 🔥 auto redirect to login
        setTimeout(() => {
          navigate("/login");
        }, 2000);

      } catch (err) {
        setStatus("error");
        notify.error(
          err.response?.data?.message || "Invalid or expired verification link"
        );
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center h-dvh bg-black bg-opacity-80">
      <div className="grid justify-items-center">
        {status === "error" && <FaSadTear size={150} color="white" />}

        <Card>
          <div className="p-4 text-center">
            {status === "verifying" && <SubT>Verifying your email...</SubT>}

            {status === "success" && (
              <SubT>✅ Email Verified Successfully<br />Redirecting to login...</SubT>
            )}

            {status === "error" && (
              <SubT>❌ Invalid or Expired Verification Link</SubT>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;
