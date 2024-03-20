import React from "react";
import { RxDoubleArrowRight } from "react-icons/rx";
import styles from "../../sass/paginationStyles.module.scss";
import { useSearchParams } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";

interface IProps {
  range: (string | number)[];
  totalPages: number;
}

export const PaginationBar: React.FC<IProps> = ({ range, totalPages }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page"));

  return (
    <div className={styles.pagination_bar}>
      <button
        className={styles.double_left}
        onClick={() => {
          searchParams.set("page", "1");
          setSearchParams(searchParams);
        }}
      >
        <RxDoubleArrowRight className={styles.btn_icon} />
      </button>

      <button
        className={styles.single_left}
        onClick={() => {
          searchParams.set("page", String(page - 1));
          setSearchParams(searchParams);
        }}
        disabled={page === 1}
      >
        <IoIosArrowForward className={styles.btn_icon} />
      </button>
      {/* middle navigation pill */}
      <ul className={styles.pagination_pill}>
        {range.map((item, index) => {
          if (typeof item === "number") {
            return (
              <li key={index}>
                <button
                  className={styles.pagination_btn}
                  onClick={() => {
                    searchParams.set("page", String(item));
                    setSearchParams(searchParams);
                  }}
                  style={page === item ? { backgroundColor: "#f1f1f1" } : {}}
                >
                  {item}
                </button>
              </li>
            );
          } else {
            // "..."
            return <li key={index}>{item}</li>;
          }
        })}
      </ul>

      <button
        className={styles.single_right}
        disabled={page === totalPages}
        onClick={() => {
          searchParams.set("page", String(page + 1));
          setSearchParams(searchParams);
        }}
      >
        <IoIosArrowForward className={styles.btn_icon} />
      </button>

      <button
        className={styles.double_right}
        onClick={() => {
          searchParams.set("page", String(totalPages));
          setSearchParams(searchParams);
        }}
      >
        <RxDoubleArrowRight className={styles.btn_icon} />
      </button>
    </div>
  );
};
