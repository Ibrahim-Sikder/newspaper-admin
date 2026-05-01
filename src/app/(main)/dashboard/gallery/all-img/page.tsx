'use client'

import React from "react";
import AllImages from "./_components/AllImages";
import TopBar from "./_components/TopBar";


const Page = () => {
  // const [isOpen, setIsOpen] = useState(false);

  // const handleOpenChange = (open: boolean) => {
  //   setIsOpen(open);
  // };
  return (
    <>
      <TopBar  />
      <AllImages />
    </>
  );
};

export default Page;
