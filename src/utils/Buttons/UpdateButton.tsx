/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

type buttonProps = {
  id: string;
};

const UpdateButton = ({ id }: buttonProps) => {
  const handleClick = (id: string) => {};
  return (
    <div>
      <Button title="Edit" onClick={() => handleClick(id)}>
        <Edit className="text-yellow-500" />
      </Button>
    </div>
  );
};

export default UpdateButton;
