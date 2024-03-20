import { Navigate, Route, Routes } from "react-router-dom";
import styles from "./appStyles.module.scss";
import { Header } from "./components/header/Header";
import { LoginForm } from "./components/login/LoginForm";
import { SignupLayout } from "./components/login/SignupLayout";
import { Category } from "./components/categories/Category";
import { useSelector } from "react-redux";
import { RootState } from "./store";

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.login);

  return (
    <div className={styles.app}>
      <Header />

      <Routes>
        <Route path="/" element={""} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupLayout />} />
        {/* protected page */}
        <Route
          path="/category"
          element={isAuthenticated ? <Category /> : <Navigate to={"/login"} />}
        />
      </Routes>
    </div>
  );
}

export default App;
