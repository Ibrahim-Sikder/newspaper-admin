"use client";

import { ReactNode, useEffect } from "react";
import { Provider as ReduxProvider } from "react-redux";
// import { SessionProvider } from "next-auth/react";
import { store } from "@/redux/store";


const Providers = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    const darkMode = localStorage.getItem("theme") === "dark";

    document.documentElement.classList.toggle("dark", darkMode);
  }, []);

  return (
    <ReduxProvider store={store}>
      {/* <SessionProvider>{children}</SessionProvider> */}
      {children}
      
    </ReduxProvider>
  );
};

export default Providers;
