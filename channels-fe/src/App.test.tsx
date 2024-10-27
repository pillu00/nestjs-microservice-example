import { render, screen, waitFor } from "@testing-library/react";
import fetchMock from "fetch-mock";
import App from "./App";
import userEvent from "@testing-library/user-event";
import { Channel } from "./components/Channels";

describe("App", () => {
  it("should render SignIn Form first", async () => {
    render(<App />);
    await screen.findByRole("button");
    screen.getByText(/Username/);
    screen.getByText(/Password/);
  });

  it("should render Channels if Signin is success", async () => {
    fetchMock.post("end:login", { access_token: "TEST_TOKEN" });
    render(<App />);
    const signInButton = await screen.findByRole("button");

    const loginInput = screen.getByLabelText("Username");
    await userEvent.type(loginInput, "test");

    const passwordInput = screen.getByLabelText("Password");
    await userEvent.type(passwordInput, "test");

    fetchMock.get("end:channels/", mockChannels);
    await userEvent.click(signInButton);

    await screen.findByText(mockChannels[0].name);
  });

  it("should not render Channels if Signin failed", async () => {
    fetchMock.post("end:login", 401);
    const alertSpy = jest
      .spyOn(window, "alert")
      .mockImplementation(() => jest.fn());

    render(<App />);
    const signInButton = await screen.findByRole("button");

    const loginInput = screen.getByLabelText("Username");
    await userEvent.type(loginInput, "test");

    const passwordInput = screen.getByLabelText("Password");
    await userEvent.type(passwordInput, "test");

    fetchMock.get("end:channels/", mockChannels);
    await userEvent.click(signInButton);

    await waitFor(() => {
      expect(alertSpy).toBeCalledWith("Unknown Response");
    });

    expect(fetchMock.lastUrl()).toBe("http://localhost:3000/auth/login");
  });

  it("should show error if channels api failed", async () => {
    fetchMock.post("end:login", { access_token: "TEST_TOKEN" });

    render(<App />);
    const signInButton = await screen.findByRole("button");

    const loginInput = screen.getByLabelText("Username");
    await userEvent.type(loginInput, "test");

    const passwordInput = screen.getByLabelText("Password");
    await userEvent.type(passwordInput, "test");

    fetchMock.get("end:channels/", 500);
    await userEvent.click(signInButton);

    await screen.findByText(/An Error Occurred!!/);
  });
});

const mockChannels: Channel[] = [
  {
    id: 1293177,
    name: "San Diego - Estación Meteorológica",
    description:
      "San Diego, Cerro Largo, Uruguay\r\nEstación Meteorológica Solar\r\n(Temp, Hum, Presion, Lluvia, Viento).\r\nESP8266, UNO R3, BME 680\r\nUpdate Interval - 15 seg\r\nhttps://clima.santiago.ovh/",
    latitude: "-31.9939484",
    longitude: "-53.9575388",
    created_at: "2021-01-30T16:32:32Z",
    elevation: "136",
    last_entry_id: 4713277,
    public_flag: true,
    url: "http://clima.santiago.ovh/",
    ranking: 100,
    github_url: "https://github.com/santiagoacevedo",
    tags: [
      {
        id: 3063,
        name: "uruguay",
      },
      {
        id: 12931428,
        name: "cerro largo",
      },
      {
        id: 23638,
        name: "san diego",
      },
      {
        id: 12931429,
        name: "estacion solar",
      },
      {
        id: 244,
        name: "solar",
      },
      {
        id: 12931430,
        name: "cerro largo uy",
      },
      {
        id: 12931431,
        name: "uy",
      },
    ],
  },
];
