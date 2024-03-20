import React from "react";
import styles from "../../sass/signupFormStyles.module.scss";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "../../store";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { validateForm } from "../../services/helper-functions/formValidation";
import { addUser } from "../../services/helper-functions/signupRequests";

export const SignupForm: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const signupState = useSelector((state: RootState) => state.signup);

  const { email, password, name } = signupState;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;

    switch (name) {
      case "email":
        dispatch({ type: "signup/email", payload: e.target.value });
        break;
      case "pwd":
        dispatch({ type: "signup/password", payload: e.target.value });
        break;
      case "name":
        dispatch({ type: "signup/name", payload: e.target.value });
        break;
      default:
        return;
    }
  };

  const handleFormSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // validate fields
    if (email.length === 0 || password.length === 0 || name.length === 0) {
      window.alert("All fields are mandatory!");
      return;
    }

    if (!validateForm(signupState)[0]) {
      window.alert(validateForm(signupState)[1]);
      return;
    }

    // proceed with signup
    const response = await addUser(signupState);

    if (response) {
      if (
        response.status === 400 ||
        response.status === 500 ||
        response.status === 401
      ) {
        window.alert(response.data);
        return;
      }

      //request was successful and otp was sent, navigate to verify page
      dispatch({ type: "signup/verify" });
    }
  };

  return (
    <div className={styles.form_container}>
      <h1 className={styles.title}>Create your account</h1>

      <form action="post" className={styles.form_wrapper}>
        <label htmlFor="name" className={styles.input_field}>
          Name
          <input
            type="text"
            name="name"
            id="name"
            placeholder="enter full name"
            value={name}
            onChange={handleInputChange}
          />
        </label>

        <label htmlFor="email" className={styles.input_field}>
          Email
          <input
            type="text"
            name="email"
            id="email"
            placeholder="enter email"
            value={email}
            onChange={handleInputChange}
          />
        </label>

        <label htmlFor="pwd" className={styles.input_field}>
          Password
          <input
            type="password"
            name="pwd"
            id="pwd"
            placeholder="enter password"
            value={password}
            onChange={handleInputChange}
          />
        </label>

        <button className={styles.signup_btn} onClick={handleFormSubmit}>
          create account
        </button>
      </form>

      <div className={styles.separator}></div>

      <div className={styles.redirect}>
        <p>Have an account?</p>
        <Link to={"/login"}>Login</Link>
      </div>
    </div>
  );
};
