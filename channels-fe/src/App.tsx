import React from "react";
import { Container } from "@mui/material";
import SignIn, { SignInResponse } from "./components/SignIn";
import Channels from "./components/Channels";

function App() {
  const [accessToken, setAccessToken] = React.useState("");

  const onSubmit = React.useCallback((data: SignInResponse) => {
    setAccessToken(data.access_token);
  }, []);

  return (
    <Container maxWidth="sm">
      {accessToken ? (
        <Channels access_token={accessToken} />
      ) : (
        <SignIn onSubmit={onSubmit} />
      )}
    </Container>
  );
}

export default App;
