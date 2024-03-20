import { ISignupState } from "../data/interfaces";

export const validateEmail = (email: string) => {
  // eslint-disable-next-line
  const mailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (!mailRegex.test(email)) return false;

  return true;
};

const validateName = (name: string) => {
  // name must not contain numbers, whitespaces or special char
  const username = name.toLowerCase();

  for (const ch of username) {
    if (!(ch >= "a" && ch <= "z") && ch !== " ") return false;
  }

  return true;
};

export const validatePassword: (x: string) => [boolean, string] = (
  password: string
) => {
  const n = password.length;

  if (n < 8) return [false, "Password is too short."];

  let upperCase = 0,
    lowerCase = 0,
    digit = 0,
    special = 0;

  for (const ch of password) {
    if (ch >= "a" && ch <= "z") lowerCase++;

    if (ch >= "A" && ch <= "Z") upperCase++;

    if (ch >= "0" && ch <= "9") digit++;

    if (ch === " ") return [false, "Password cannot contain empty spaces!"];

    special++;
  }

  switch (0) {
    case upperCase:
      return [false, "Password must contain at least one uppercase alphabet."];
    case lowerCase:
      return [false, "Password must contain at least one lowercase alphabet."];
    case digit:
      return [false, "Password must contain at least one digit."];
    case special:
      return [false, "Password must contain at least one special character."];
  }

  return [true, ""];
};

export const validateForm: (obj: ISignupState) => [boolean, string] = (
  signupObj: ISignupState
) => {
  const { email, password, name } = signupObj;

  if (!validateName(name)) {
    return [false, "Username invalid."];
  }

  if (!validatePassword(password)[0]) {
    return [false, validatePassword(password)[1]];
  }

  if (!validateEmail(email)) {
    return [false, "Invalid email."];
  }

  return [true, ""];
};
