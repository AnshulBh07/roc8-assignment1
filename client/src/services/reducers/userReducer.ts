import { ICategory, IResponseData, IUser } from "../data/interfaces";

const val: IResponseData = JSON.parse(localStorage.getItem("user")!);
const catArr: ICategory[] = JSON.parse(localStorage.getItem("categories")!);

const initialState: IUser = {
  email: val ? val.user_data.email : "",
  name: val ? val.user_data.name : "",
  password: val ? val.user_data.password : "", //this password is md5 encrypted
  categories: catArr
    ? catArr.map((item) => {
        return item.title;
      })
    : new Array<string>(),
  user_id: 0,
};

type actionType = { type: string; payload?: string | number };

export const userReducer = (state = initialState, action: actionType) => {
  switch (action.type) {
    case "user/email":
      return { ...state, email: String(action.payload!) };
    case "user/name":
      return { ...state, name: String(action.payload!) };
    case "user/password":
      return { ...state, password: String(action.payload!) };
    case "user/id":
      return { ...state, user_id: Number(action.payload!) };
    case "user/add_category":
      return {
        ...state,
        categories: [...state.categories, String(action.payload)],
      };
    case "user/remove_category":
      return {
        ...state,
        categories: state.categories.filter((item) => {
          return item !== String(action.payload!);
        }),
      };
    default:
      return state;
  }
};
