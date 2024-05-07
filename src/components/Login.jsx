import { GoogleLogin } from "@react-oauth/google";
import { Box, Typography } from "@mui/material";
import jwt_decode from "jwt-decode";
import shareVideo from "../media/shareVideo.mp4";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
      }}
    >
      <video
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        src={shareVideo}
        type="video/mp4"
        loop
        controls={false}
        muted
        autoPlay
      />

      <Box
        style={{
          position: "absolute",
          backgroundColor: "rgba(0,0,0,.7)",
          top: "0",
          bottom: "0",
          left: "0",
          right: "0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            color: "white",
            textTransform: "uppercase",
            letterSpacing: "6px",
          }}
          mb={1}
        >
          Shortcuts App
        </Typography>

        <GoogleLogin
          onSuccess={(response) => {
            const userObj = jwt_decode(response.credential);
            localStorage.setItem("user", JSON.stringify(userObj));
            const { given_name, sub, picture } = userObj;
            const doc = {
              _id: sub,
              _type: "user",
              userName: given_name,
              image: picture,
            };

            // console.log(response, userObj);

            navigate("/", { replace: true });
          }}
          onError={() => {
            console.log("Login Failed");
          }}
          useOneTap
          // auto_select
          // cookiePolicy="single_host_origin"
        />
      </Box>
    </Box>
  );
};

export default Login;
