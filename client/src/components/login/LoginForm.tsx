import React from "react";
import styles from "../../sass/loginFormStyles.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../store";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  validateEmail,
  validatePassword,
} from "../../services/helper-functions/formValidation";
import { fetchUser } from "../../services/helper-functions/loginRequests";

export const LoginForm: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const loginState = useSelector((state: RootState) => state.login);
  const { email, password } = loginState;
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;

    switch (name) {
      case "email":
        dispatch({ type: "login/email", payload: e.target.value });
        break;
      case "pwd":
        dispatch({ type: "login/password", payload: e.target.value });
        break;
      default:
        return;
    }
  };

  const handleFormSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // check for valid inputs
    if (email.length === 0 || password.length === 0) {
      window.alert("All fields are mandatory!");
      return;
    }

    if (!validateEmail(email)) {
      window.alert("Invalid email");
      return;
    }

    if (!validatePassword(password)[0]) {
      window.alert(validatePassword(password)[1]);
      return;
    }

    // proceed with login
    const response = await fetchUser(loginState);

    if (response) {
      if (
        response.status === 400 ||
        response.status === 500 ||
        response.status === 401
      ) {
        window.alert(response.data);
        return;
      }

      // request was successful, so we update user state and store data in local storage
      localStorage.setItem("user", JSON.stringify(response.data));
      const tokens = {
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
      };
      localStorage.setItem("tokens", JSON.stringify(tokens));

      localStorage.setItem(
        "categories",
        JSON.stringify(response.data.user_data.categories)
      );
      // authenticate user
      dispatch({ type: "login/authenticate" });
      // redirect to category
      navigate("/category");
    }
  };

  return (
    <section className={styles.main_container}>
      <div className={styles.form_container}>
        <h2 className={styles.title}>login</h2>

        <p className={styles.text}>
          Welcome back to ECOMMERCE
          <span>The next gen business marketplace</span>
        </p>

        <form action="post" className={styles.form_wrapper}>
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

          <button className={styles.login_btn} onClick={handleFormSubmit}>
            login
          </button>
        </form>

        <div className={styles.separator}></div>

        <div className={styles.redirect}>
          <p>Don't have an account?</p>
          <Link to={"/signup"}>sign up</Link>
        </div>
      </div>
    </section>
  );
};
