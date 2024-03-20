import React from "react";
import styles from "../../sass/signupLayoutStyles.module.scss";
import { SignupForm } from "./SignupForm";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { VerifyForm } from "./VerifyForm";

export const SignupLayout: React.FC = () => {
  const { showVerify } = useSelector((state: RootState) => state.signup);

  return (
    <section className={styles.main_container}>
      {showVerify ? <VerifyForm /> : <SignupForm />}
    </section>
  );
};
