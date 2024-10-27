import { render, screen, waitFor } from "@testing-library/react";
import SignIn from "./SignIn";
import fetchMock from "fetch-mock";
import userEvent from "@testing-library/user-event";

describe("Sign In", () => {
  const handleSubmit = jest.fn();
  it("should render", async () => {
    render(<SignIn onSubmit={handleSubmit} />);

    await screen.findByRole("button");
    screen.getByText(/Username/);
    screen.getByText(/Password/);

    expect(handleSubmit).not.toBeCalled();
  });

  it("should call onSubmit callback if login is success", async () => {
    fetchMock.post("end:login", { access_token: "TEST_TOKEN" });
    render(<SignIn onSubmit={handleSubmit} />);

    const signInButton = await screen.findByRole("button");

    const loginInput = screen.getByLabelText("Username");
    await userEvent.type(loginInput, "test");

    const passwordInput = screen.getByLabelText("Password");
    await userEvent.type(passwordInput, "test");

    await userEvent.click(signInButton);

    await waitFor(() => {
      expect(handleSubmit).toBeCalledWith({ access_token: "TEST_TOKEN" });
    });
  });

  it("should not call onSubmit callback if login is failed", async () => {
    fetchMock.post("end:login", 500);
    const alertSpy = jest
      .spyOn(window, "alert")
      .mockImplementation(() => jest.fn());

    render(<SignIn onSubmit={handleSubmit} />);

    const signInButton = await screen.findByRole("button");

    const loginInput = screen.getByLabelText("Username");
    await userEvent.type(loginInput, "test");

    const passwordInput = screen.getByLabelText("Password");
    await userEvent.type(passwordInput, "test");

    await userEvent.click(signInButton);

    await waitFor(() => {
      expect(alertSpy).toBeCalledWith("Unknown Response");
    });

    expect(handleSubmit).not.toBeCalled();
  });
});
