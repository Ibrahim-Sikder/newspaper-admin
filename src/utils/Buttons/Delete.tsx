/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button";
import { DeleteIcon } from "lucide-react";

type buttonProps = {
  id: string;
};

const Delete = ({ id }: buttonProps) => {
  const handleClick = (id: string) => {};
  return (
    <div>
      <Button title="Delete" onClick={() => handleClick(id)}>
        <DeleteIcon className="text-red-500" />
      </Button>
    </div>
  );
};

export default Delete;
