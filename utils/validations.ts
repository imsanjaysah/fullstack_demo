export const validateUsername = (username: string) =>
  username.length >= 3 && username.length <= 200;

export const validatePassword = (password: string) =>
  password.length >= 6 && password.length <= 30;

export const validateEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return emailRegex.test(email);
};
