import Swal from "sweetalert2";

type alertProps = {
  message: string;
};

const DeleteAlert = ({ message }: alertProps) => {
  return Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleted!",
        text: message,
        icon: "success",
      });
    }
  });
};

export default DeleteAlert;
