/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import React from "react";

type buttonProps = {
  id: string;
};

const ViewButton = ({ id }: buttonProps) => {
  const handleClick = (id: string) => {};
  return (
    <div>
      <Button title="View" onClick={() => handleClick(id)}>
        <Eye className="text-green-500" />
      </Button>
    </div>
  );
};

export default ViewButton;
