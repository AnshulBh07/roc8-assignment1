import React from "react";
import styles from "../../sass/headerStyles.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { navItemsList } from "../../services/data/navItems";
import { PiMagnifyingGlass } from "react-icons/pi";
import { PiShoppingCartSimple } from "react-icons/pi";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { useDispatch } from "react-redux";

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.login);
  console.log(isAuthenticated);
  const dispatch: AppDispatch = useDispatch();

  return (
    <section className={styles.container}>
      <div className={styles.login_options}>
        <Link to={""} className={styles.redirect_options}>
          help
        </Link>
        <Link to={""} className={styles.redirect_options}>
          orders & returns
        </Link>
        {isAuthenticated ? (
          <button
            className={styles.login_btn}
            onClick={() => {
              dispatch({ type: "login/authenticate" });
              localStorage.removeItem("user");
              localStorage.removeItem("tokens");
              localStorage.removeItem("categories");
              navigate("/login");
            }}
          >
            logout
          </button>
        ) : (
          <button
            className={styles.login_btn}
            onClick={() => navigate("/login")}
          >
            login
          </button>
        )}
      </div>

      <div className={styles.navbar_wrapper}>
        {/* brand name */}
        <h1 className={styles.brand}>ecommerce</h1>

        {/* nav list */}
        <nav className={styles.navbar}>
          <ul className={styles.navItems}>
            {navItemsList.map((item, index) => {
              return (
                <li key={index}>
                  <Link to={item.link} className={styles.link}>
                    {item.text}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* cart and search bar */}
        <div className={styles.btns_wrapper}>
          <button className={styles.nav_btn}>
            <PiMagnifyingGlass className={styles.nav_icon} />
          </button>
          <button className={styles.nav_btn}>
            <PiShoppingCartSimple className={styles.nav_icon} />
          </button>
        </div>
      </div>

      <div className={styles.banner}>
        <button className={styles.arrow_btn}>
          <IoIosArrowBack className={styles.arrow_icon} />
        </button>
        <p className={styles.offer}>Get 10% off on business sign up</p>
        <button className={styles.arrow_btn}>
          <IoIosArrowForward className={styles.arrow_icon} />
        </button>
      </div>
    </section>
  );
};
