/* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { instance } from "@/axios/axiosInstance";
// import { authKey } from "@/constant/authkey";
// import { decodedToken } from "@/utils/jwt";
// import { getFromLocalStorage, removeFromLocalStorage, setToLocalStorage } from "@/utils/local.storage";




// export const storeUserInfo = ({ accessToken }: { accessToken: string }) => {
//   return setToLocalStorage(authKey, accessToken);
// };

// export const getUserInfo = () => {
//   const authToken = getFromLocalStorage(authKey);
//   if (authToken) {
//     const decodedData: any = decodedToken(authToken);
//     return {
//       ...decodedData,
//       role: decodedData?.role.toLowerCase(),
//     };
//   }

//   return authToken;
// };

// export const isLoggedIn = () => {
//   const authToken = getFromLocalStorage(authKey);
//   if (authToken) {
//     return !!authToken;
//   }
// };

// export const removeUser = () => {
//   return removeFromLocalStorage(authKey);
// };

// export const getNewAccessToken = async () => {
//   return await instance({
//     url: `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/refresh-token`,
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     withCredentials: true,
//   });
// };


/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { authKey } from "@/constant/authkey";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const getNewAccessToken = async () => {
  try {
    const refreshToken = await getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/refresh-token`,
      {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to refresh token");
    }

    return result;
  } catch (error: any) {
    // If refresh fails, clear tokens and redirect to login
    await removeUserInfo();
    redirect("/login");
  }
};

export const getRefreshToken = async () => {
  if (typeof window !== 'undefined') {
    // Client-side: get from localStorage
    return localStorage.getItem("refreshToken");
  } else {
    // Server-side: get from cookies
    const cookieStore = await cookies();
    return cookieStore.get("refreshToken")?.value;
  }
};

export const removeUserInfo = async () => {
  if (typeof window !== 'undefined') {
    // Client-side: remove from localStorage
    localStorage.removeItem(authKey);
    localStorage.removeItem("refreshToken");
  }
  
  // Remove from cookies
  const cookieStore = await cookies();
  cookieStore.delete(authKey);
  cookieStore.delete("refreshToken");
  
  redirect("/login");
};
