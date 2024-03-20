import React, { useRef, useState } from "react";
import styles from "../../sass/otpFormStyles.module.scss";
import { verifyUser } from "../../services/helper-functions/signupRequests";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

export const VerifyForm: React.FC = () => {
  const [code, setCode] = useState<string[]>(new Array<string>(8).fill(""));
  const signupState = useSelector((state: RootState) => state.signup);
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  //   input refs to set focus on curr box
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const formatEmail = () => {
    const email = signupState.email;

    const emailArr = email.split("@");

    return email.substring(0, 3) + "***@" + emailArr[1];
  };

  //   function to add refs to ref array using callback
  const addToRefsArray = (element: HTMLInputElement | null) => {
    // if element is not null and it is not already present in array
    if (element && !inputRefs.current.includes(element))
      inputRefs.current.push(element);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;

    // if value is not a number return
    if (isNaN(Number(value))) return;

    const newCode = [...code];

    newCode[index] = value.substring(value.length - 1);

    setCode(newCode);

    // now handle focus and move it to next
    if (value && index < code.length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (
      e.key === "Backspace" &&
      inputRefs.current[index - 1] &&
      !code[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleFormSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (code.includes("")) return;

    // console.log(code);

    // form a string to pass to server
    const codeVal = code.join("");

    // pass to server
    const response = await verifyUser(codeVal, signupState);

    if (response) {
      if (
        response.status === 400 ||
        response.status === 500 ||
        response.status === 401
      ) {
        window.alert(response.data);
        return;
      }

      // otp verification successful
      window.alert(response.data);
      dispatch({ type: "signup/verify" });

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  };

  return (
    <div className={styles.form_container}>
      <h1 className={styles.heading}>Verify your email</h1>

      <p className={styles.text}>
        Enter the 8 digits code you have received on
        <span> {formatEmail()}</span>
      </p>

      <form action="post" className={styles.form_wrapper}>
        <p className={styles.title}>code</p>

        <div className={styles.box_wrapper}>
          {code.map((item, index) => {
            return (
              <input
                type="text"
                name="code-digit"
                id="code-digit"
                className={styles.input_box}
                ref={(element) => addToRefsArray(element)}
                value={item}
                key={index}
                onChange={(e) => handleInputChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            );
          })}
        </div>

        <button className={styles.verify_btn} onClick={handleFormSubmit}>
          Verify
        </button>
      </form>
    </div>
  );
};
