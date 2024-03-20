import React, { useEffect, useState } from "react";
import styles from "../../sass/categoryStyles.module.scss";
import { productCategories } from "../../services/data/categoryData";
import { IoCheckbox } from "react-icons/io5";
import { useSearchParams } from "react-router-dom";
import { usePagination } from "../../services/custom-hooks/usePaginationHook";
import { PaginationBar } from "../pagination/PaginationBar";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { useDispatch } from "react-redux";
import {
  addCategory,
  removeCategory,
} from "../../services/helper-functions/categoryRequests";
import { ICategory } from "../../services/data/interfaces";

export const Category: React.FC = () => {
  const { categories } = useSelector((state: RootState) => state.user);
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsloading] = useState<boolean>(false);
  // console.log(categories);
  console.log(categories);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const page = searchParams.get("page")!;

    if (!page) {
      searchParams.set("page", "1");
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  //   get currPage number
  const currPage = Number(searchParams.get("page"));
  const pageSize = 6,
    siblings = 2;
  const totalPages = Math.ceil(productCategories.length / pageSize);

  const range = usePagination(
    productCategories.length,
    pageSize,
    currPage,
    siblings
  ); //only used to make pagination pill

  const pageData = productCategories.slice(
    (currPage - 1) * pageSize,
    currPage * pageSize
  );

  const handleInputChange = async (key: string) => {
    // if the chosen category is already present in array delete it
    // to keep the frontend and backend part in sync we will first
    if (categories && categories.includes(key)) {
      setIsloading(true);
      // we remove by id
      const categoryArr: ICategory[] = JSON.parse(
        localStorage.getItem("categories")!
      );
      const response = await removeCategory(
        categoryArr[
          categoryArr.findIndex((item) => {
            return item.title === key;
          })
        ].category_id
      );

      if (response) {
        if (
          response.status === 401 ||
          response.status === 400 ||
          response.status === 500
        ) {
          window.alert(response.data);
          setIsloading(false);
          return;
        }

        dispatch({ type: "user/remove_category", payload: key });
        // delete from local storage too
        const category: ICategory = response.data.result;

        const newArr = categoryArr.filter((item) => {
          return item.title !== category.title;
        });

        localStorage.setItem("categories", JSON.stringify(newArr));

        setIsloading(false);
      }
    } else {
      setIsloading(true);

      const response = await addCategory(key);

      if (response) {
        if (
          response.status === 401 ||
          response.status === 400 ||
          response.status === 500
        ) {
          window.alert(response.data);
          setIsloading(false);
          return;
        }

        //update state
        dispatch({ type: "user/add_category", payload: key });
        //update local storage too
        const category: ICategory = response.data.result;
        const categoryArr = JSON.parse(localStorage.getItem("categories")!);

        localStorage.setItem(
          "categories",
          JSON.stringify([...categoryArr, category])
        );

        setIsloading(false);
      }
    }
  };

  return (
    <section className={styles.main_container}>
      <div className={styles.selection_form}>
        <h1 className={styles.title}>Please mark your interests!</h1>

        <p className={styles.text}>We will keep you notified</p>

        <h2 className={styles.subtitle}>My saved interests!</h2>

        {/* interests checkboxes */}
        <div className={styles.category_container}>
          {pageData.map((item, index) => {
            return (
              <label
                htmlFor={item}
                className={styles.category_label}
                key={index}
              >
                <input
                  type="checkbox"
                  name={item}
                  id={item}
                  onChange={() => handleInputChange(item)}
                  disabled={isLoading}
                />
                <span>
                  {categories && categories.includes(item) && (
                    <IoCheckbox className={styles.check_icon} />
                  )}
                </span>
                <p>{item}</p>
              </label>
            );
          })}
        </div>

        {/* pagination bar */}
        <PaginationBar range={range} totalPages={totalPages} />
      </div>
    </section>
  );
};
