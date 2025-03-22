import API_ROUTE from "@/constants/api";
import { ACCESS_TOEKN } from "@/constants/cookie";
import { Axios } from "@/lib/Axios";

const { VITE_API_URL } = import.meta.env;

const authAxios = new Axios(true, VITE_API_URL, ACCESS_TOEKN);

interface SolveData {
  flag1: string;
  flag2: string;
}

interface PasswordData {
  password: string;
}

export const solve = async (data: SolveData) => {
  const res = await authAxios.post<PasswordData>(API_ROUTE.SOLVE, data);
  return res;
};
