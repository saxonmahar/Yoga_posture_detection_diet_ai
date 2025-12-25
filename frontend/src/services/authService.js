import api from "./api";

// Register
export const registerRequest = async (payload) => {
  const { data } = await api.post("/auth/register", payload, {
    withCredentials: true, // ensures cookies are handled
  });
  return data;
};

// Login
export const loginRequest = async ({ email, password }) => {
  const { data } = await api.post(
    "/auth/login",
    { email, password },
    { withCredentials: true } // important to receive httpOnly cookie
  );
  return data;
};

// Get current logged-in user from cookie
export const getMeRequest = async () => {
  const { data } = await api.get("/auth/me", {
    withCredentials: true, // sends cookie automatically
  });
  return data;
};

// Logout
export const logoutRequest = async () => {
  const { data } = await api.post(
    "/auth/logout",
    {},
    { withCredentials: true } // clear cookie
  );
  return data;
};
