import React from "react";
import {
  Typography,
  Box,
  Button,
  Card as MuiCard,
  FormControl,
  FormLabel,
  TextField,
  styled,
  CircularProgress,
} from "@mui/material";
import useAsync from "../hooks/useAsync";
import fetchData from "../utils/fetch";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

export interface SignInProps {
  onSubmit: (data: SignInResponse) => void;
}

export interface SignInRequest {
  username?: string;
  password?: string;
}

export interface SignInResponse {
  access_token: string;
}

const SIGN_IN_URL = "http://localhost:3000/auth/login";

export default function SignIn({ onSubmit }: SignInProps) {
  const { run, data, error, isLoading, isSuccess, isError, isIdle } =
    useAsync<SignInResponse>();

  const handleSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);

      const username = data.get("username")?.toString();
      const password = data.get("password")?.toString();

      if (username && password) {
        run(
          fetchData<SignInResponse>(SIGN_IN_URL, {
            method: "POST",
            body: JSON.stringify({ username, password }),
          })
        );
      }
    },
    [run]
  );

  React.useEffect(() => {
    if (isSuccess && data) {
      onSubmit(data);
    }
  }, [isSuccess, data, onSubmit]);

  React.useEffect(() => {
    if (isError && error) {
      window.alert(error.message);
    }
  }, [isError, error]);

  return (
    <Card variant="outlined">
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
      >
        Sign in
      </Typography>
      <Box
        action=""
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: 2,
        }}
      >
        <FormControl>
          <FormLabel htmlFor="username">Username</FormLabel>
          <TextField
            id="username"
            name="username"
            placeholder="your username"
            autoFocus
            required
            fullWidth
            variant="outlined"
            sx={{ ariaLabel: "username" }}
          />
        </FormControl>
        <FormControl>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <FormLabel htmlFor="password">Password</FormLabel>
          </Box>
          <TextField
            name="password"
            placeholder="••••••"
            type="password"
            id="password"
            autoComplete="current-password"
            autoFocus
            required
            fullWidth
            variant="outlined"
          />
        </FormControl>

        <Button type="submit" fullWidth variant="contained">
          {isLoading && <CircularProgress size={20} />}
          {(isSuccess || isIdle || isError) && "Sign in"}
        </Button>
      </Box>
    </Card>
  );
}
