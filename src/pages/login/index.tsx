import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography } from "@mui/material";
import { fakeUser } from "../../utils/fakeAuth";

interface LoginFormInputs {
  username: string;
  password: string;
}
interface LoginProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean | string>>;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const { register, handleSubmit } = useForm<LoginFormInputs>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    if (
      data.username === fakeUser.username &&
      data.password === fakeUser.password
    ) {
      setIsAuthenticated(true);
      navigate("/");
    } else {
      alert("Username or password is wrong!");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)", // Orqa fon
        padding: "20px",
      }}
    >
      <Box
        sx={{
          width: "400px",
          padding: "30px",
          borderRadius: "12px",
          backgroundColor: "#fff",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)", // Karta uslubidagi shadow
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <Typography variant="h4" textAlign="center" color="primary">
          Login
        </Typography>

        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <TextField
            label="Username"
            {...register("username", { required: true })}
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            autoComplete="off"
            {...register("password", { required: true })}
            variant="outlined"
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default Login;
