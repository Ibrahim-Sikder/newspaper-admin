// /* eslint-disable @typescript-eslint/no-explicit-any */

// "use client"

// import axios from "axios"
// import Image from "next/image"
// import toast from "react-hot-toast"
// import { motion } from "framer-motion"
// import { Eye, EyeOff } from "lucide-react"
// import { Form } from "@/components/ui/form"
// import { setCookie } from "@/axios/Cookies"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import TextInput from "@/utils/Form_Inputs/TextInput"
// import logo from "../../public/assets/dailyTimes24.png"
// import { useForm, type SubmitHandler } from "react-hook-form"
// import { useCallback, useEffect, useMemo, useState } from "react"
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

// type FormData = {
//   name: string
//   password: string
// }

// const ParticleBackground = () => {
//   const backgroundTexts = useMemo(() => ["সত্যের সন্ধানে সব সময়", "dailytimes24"], [])
//   const [textInstances, setTextInstances] = useState<
//     {
//       text: string
//       id: string
//       position: { top: string; left: string; animationDelay: string }
//     }[]
//   >([])

//   const generateRandomPosition = () => ({
//     top: `${Math.random() * 100}%`,
//     left: `${Math.random() * 100}%`,
//     animationDelay: `${Math.random() * 3}s`,
//   })

//   const generateTextInstances = useCallback(
//     (count: number) => {
//       const instances: {
//         text: string
//         id: string
//         position: { top: string; left: string; animationDelay: string }
//       }[] = []
//       for (let i = 0; i < count; i++) {
//         backgroundTexts.forEach((text: any) => {
//           instances.push({
//             text,
//             id: `${text}-${i}`,
//             position: generateRandomPosition(),
//           })
//         })
//       }
//       return instances
//     },
//     [backgroundTexts],
//   )

//   useEffect(() => {
//     const instances = generateTextInstances(10)
//     setTextInstances(instances)
//   }, [generateTextInstances])

//   return (
//     <div className="absolute inset-0 overflow-hidden">
//       <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900">
//         <div className="absolute inset-0 opacity-25">
//           {textInstances.map((instance) => (
//             <motion.div
//               key={instance.id}
//               className="absolute text-white text-4xl font-semibold opacity-40"
//               style={instance.position}
//               animate={{
//                 opacity: [0.3, 0.6, 0.3],
//                 scale: [1, 1.05, 1],
//                 x: ["0%", "50%", "100%"],
//                 y: ["0%", "50%", "100%"],
//               }}
//               transition={{
//                 repeat: Number.POSITIVE_INFINITY,
//                 repeatDelay: 0.8,
//                 duration: 4,
//                 ease: "easeInOut",
//                 delay: Number.parseFloat(instance.position.animationDelay),
//               }}
//             >
//               {instance.text}
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

// const Page = () => {
//   // const router = useRouter()
//   const [showPassword, setShowPassword] = useState(false)

//   const form = useForm<FormData>({
//     defaultValues: {
//       name: "",
//       password: "",
//     },
//   })

//   const onSubmit: SubmitHandler<FormData> = async (data) => {
//     try {
//       const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/login`, data);

//       const accessToken = res?.data?.data?.accessToken;

//       if (accessToken) {
//         setCookie("accessToken", accessToken, { expires: 7 });

//         localStorage.setItem("accessToken", accessToken);
//         window.location.href="/dashboard"
//         toast.success("Login successful!");
//       } else {
//         console.error("Access Token not found in response");
//       }
//     } catch (error: any) {
//       console.error("Error during login:", error);

//       // Extract error message
//       const errorMessage =
//         error?.response?.data?.message ||
//         "Something went wrong. Please try again.";

//       // Show error message in toast
//       toast.error(errorMessage);
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword)
//   }

//   return (
//     <div className="relative min-h-screen flex items-center justify-center px-2 md:px-0 overflow-hidden">
//       {/* Animated Background */}
//       <ParticleBackground />

//       {/* Login Form */}
//       <div className="relative z-10 w-full max-w-md">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 1, ease: "easeOut" }}
//         >
//           <Card className="backdrop-blur-lg bg-white/90 shadow-xl rounded-xl">
//             <CardHeader className="space-y-4">
//               <div className="flex justify-center">
//                 <motion.div
//                   initial={{ scale: 0.8 }}
//                   animate={{ scale: 1 }}
//                   transition={{
//                     type: "spring",
//                     stiffness: 300,
//                     damping: 40,
//                   }}
//                   className="relative w-32 h-32"
//                 >
//                   <Image
//                     src={logo || "/placeholder.svg"}
//                     alt="dailytimes24"
//                     layout="fill"
//                     className="object-contain"
//                     priority
//                   />
//                 </motion.div>
//               </div>
//               <CardTitle className="text-2xl font-semibold text-center text-gray-900">সত্যের সন্ধানে সব সময়</CardTitle>
//             </CardHeader>

//             <Form {...form}>
//               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//                 <CardContent className="space-y-4">
//                   <TextInput
//                     control={form.control}
//                     name="name"
//                     type="text"
//                     label="Username"
//                     placeholder="Enter your username"
//                     rules={{
//                       required: "Username is required",
//                       minLength: {
//                         value: 3,
//                         message: "Username must be at least 3 characters",
//                       },
//                     }}
//                   />

//                   <div className="relative">
//                     <Input
//                       className="bg-white pr-10"
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Enter your password"
//                       {...form.register("password", {
//                         required: "Password is required",
//                         minLength: {
//                           value: 6,
//                           message: "Password must be at least 6 characters",
//                         },
//                       })}
//                     />
//                     <button
//                       type="button"
//                       onClick={togglePasswordVisibility}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
//                     >
//                       {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                     </button>
//                   </div>
//                   {form.formState.errors.password && (
//                     <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
//                   )}
//                 </CardContent>

//                 <CardFooter className="flex flex-col space-y-4">
//                   <Button
//                     type="submit"
//                     className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-4 transition-all duration-300"
//                     disabled={form.formState.isSubmitting}
//                   >
//                     {form.formState.isSubmitting ? (
//                       <div className="flex items-center justify-center">
//                         <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
//                         Signing in...
//                       </div>
//                     ) : (
//                       "Sign In"
//                     )}
//                   </Button>

//                   <div className="flex items-center justify-between w-full text-sm text-gray-600">
//                     <motion.a
//                       href="#"
//                       className="hover:text-blue-600 transition-colors duration-200"
//                       whileHover={{ scale: 1.05 }}
//                     >
//                       Forgot password?
//                     </motion.a>
//                   </div>
//                 </CardFooter>
//               </form>
//             </Form>
//           </Card>
//         </motion.div>
//       </div>
//     </div>
//   )
// }

// export default Page

/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import axios from "axios";
import Image from "next/image";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { Form } from "@/components/ui/form";
import { setCookie } from "@/axios/Cookies";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TextInput from "@/utils/Form_Inputs/TextInput";
import logo from "../../public/assets/dailyTimes24.png";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { authKey } from "@/constant/authkey";
import { setToLocalStorage } from "@/utils/local.storage";

type FormData = {
  name: string;
  password: string;
};

const ParticleBackground = () => {
  const backgroundTexts = useMemo(
    () => ["সত্যের সন্ধানে সব সময়", "dailytimes24"],
    [],
  );
  const [textInstances, setTextInstances] = useState<
    {
      text: string;
      id: string;
      position: { top: string; left: string; animationDelay: string };
    }[]
  >([]);

  const generateRandomPosition = () => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 3}s`,
  });

  const generateTextInstances = useCallback(
    (count: number) => {
      const instances: {
        text: string;
        id: string;
        position: { top: string; left: string; animationDelay: string };
      }[] = [];
      for (let i = 0; i < count; i++) {
        backgroundTexts.forEach((text: any) => {
          instances.push({
            text,
            id: `${text}-${i}`,
            position: generateRandomPosition(),
          });
        });
      }
      return instances;
    },
    [backgroundTexts],
  );

  useEffect(() => {
    const instances = generateTextInstances(10);
    setTextInstances(instances);
  }, [generateTextInstances]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="absolute inset-0 opacity-25">
          {textInstances.map((instance) => (
            <motion.div
              key={instance.id}
              className="absolute text-white text-4xl font-semibold opacity-40"
              style={instance.position}
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.05, 1],
                x: ["0%", "50%", "100%"],
                y: ["0%", "50%", "100%"],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 0.8,
                duration: 4,
                ease: "easeInOut",
                delay: Number.parseFloat(instance.position.animationDelay),
              }}
            >
              {instance.text}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormData>({
    defaultValues: {
      name: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/login`,
        data,
      );

      const accessToken = res?.data?.data?.accessToken;
      const refreshToken = res?.data?.data?.refreshToken;
      const user = res?.data?.data?.user;

      if (accessToken) {
        // Store with "Bearer " prefix as expected by baseApi
        const tokenWithBearer = `Bearer ${accessToken}`;

        // Store in localStorage (for baseApi to read)
        setToLocalStorage(authKey, tokenWithBearer);

        // Store refresh token if available
        if (refreshToken) {
          setToLocalStorage("refreshToken", refreshToken);
        }

        // Store user info if available
        if (user) {
          setToLocalStorage("user", JSON.stringify(user));
        }

        // Also store in cookies (if needed for other parts of your app)
        setCookie("accessToken", accessToken, { expires: 7 });

        // Store plain token without "Bearer " for cookies (optional)
        localStorage.setItem("accessToken", accessToken);

        toast.success("Login successful!");

        // Use router.push instead of window.location for better Next.js navigation
        router.push("/dashboard");
      } else {
        console.error("Access Token not found in response:", res.data);
        toast.error("Login failed: No access token received");
      }
    } catch (error: any) {
      console.error("Error during login:", error);

      // Extract error message
      let errorMessage = "Something went wrong. Please try again.";

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "No response from server. Please check your connection.";
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = error.message || "Error setting up login request";
      }

      // Show error message in toast
      toast.error(errorMessage);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-2 md:px-0 overflow-hidden">
      {/* Animated Background */}
      <ParticleBackground />

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <Card className="backdrop-blur-lg bg-white/90 shadow-xl rounded-xl">
            <CardHeader className="space-y-4">
              <div className="flex justify-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 40,
                  }}
                  className="relative w-32 h-32"
                >
                  <Image
                    src={logo || "/placeholder.svg"}
                    alt="dailytimes24"
                    layout="fill"
                    className="object-contain"
                    priority
                  />
                </motion.div>
              </div>
              <CardTitle className="text-2xl font-semibold text-center text-gray-900">
                সত্যের সন্ধানে সব সময়
              </CardTitle>
            </CardHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <CardContent className="space-y-4">
                  <TextInput
                    control={form.control}
                    name="name"
                    type="text"
                    label="Username"
                    placeholder="Enter your username"
                    rules={{
                      required: "Username is required",
                      minLength: {
                        value: 3,
                        message: "Username must be at least 3 characters",
                      },
                    }}
                  />

                  <div className="relative">
                    <Input
                      className="bg-white pr-10"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...form.register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {form.formState.errors.password && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-4 transition-all duration-300"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Signing in...
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </Button>

                  <div className="flex items-center justify-between w-full text-sm text-gray-600">
                    <motion.a
                      href="#"
                      className="hover:text-blue-600 transition-colors duration-200"
                      whileHover={{ scale: 1.05 }}
                    >
                      Forgot password?
                    </motion.a>
                  </div>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Page;
