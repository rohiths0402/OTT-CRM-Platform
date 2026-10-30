import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { authApi } from "../services/api";

export default function SocialAuthButtons({ onError }) {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    const credential = credentialResponse?.credential;

    if (!credential) {
      onError?.("Google sign-in did not return a credential.");
      return;
    }

    try {
      await authApi.googleLogin(credential);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      onError?.(error.message || "Google login failed. Please try again.");
    }
  };


  return (
    <div className="space-y-3">
      <div className="flex justify-center overflow-hidden rounded-xl">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => onError?.("Google sign-in was unsuccessful.")}
          text="continue_with"
          shape="rectangular"
          theme="filled_black"
          size="large"
          width="360"
        />
      </div>

      
    </div>
  );
}
