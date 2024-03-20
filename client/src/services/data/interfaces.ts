export interface ILinkItem {
  text: string;
  icon?: JSX.Element;
  link: string;
}

export interface ILoginState {
  email: string;
  password: string;
  isAuthenticated: boolean;
}

export interface ISignupState {
  email: string;
  name: string;
  password: string;
  showVerify: boolean;
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
  categories: string[];
  user_id: number;
}

export interface IResponseData {
  user_data: IUser;
  access_token: string;
  refresh_token: string;
}

export interface ICategory {
  category_id: number;
  user_id: number;
  title: string;
  created_at?: Date;
  updated_at?: Date;
}
