import { render, screen } from "@testing-library/react";
import Channels, { Channel } from "./Channels";
import fetchMock from "fetch-mock";

describe("Channels", () => {
  it("should render channels cards if channels api succeed", async () => {
    fetchMock.get("end:channels/", mockChannels);
    render(<Channels access_token="TEST_TOKEN" />);

    await screen.findByText(mockChannels[0].name);
  });

  it("should render error div if channels api fails", async () => {
    fetchMock.get("end:channels/", 500);
    render(<Channels access_token="TEST_TOKEN" />);

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
