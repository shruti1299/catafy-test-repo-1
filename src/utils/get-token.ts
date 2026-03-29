import Cookies from "js-cookie";

export const AUTH_TOKEN = "auth_token";

const TOKEN_EXPIRED_IN = 30; //days

export const setUserCookies = (token: string, user: any) => {
  Cookies.set(AUTH_TOKEN, token, { expires: TOKEN_EXPIRED_IN });
  Cookies.set("user", JSON.stringify(user), { expires: TOKEN_EXPIRED_IN });
  return true;
};

export const deleteUserToken = () => {
  Cookies.remove(AUTH_TOKEN);
  Cookies.remove("user");
  return true;
};

export const getToken = () => {
  if (typeof window === undefined) {
    return null;
  }
  return Cookies.get(AUTH_TOKEN);
};

export const getUser = () => {
  if (typeof window === undefined) {
    return null;
  }
  const user = Cookies.get("user");
  return user ? JSON.parse(user) : {};
};