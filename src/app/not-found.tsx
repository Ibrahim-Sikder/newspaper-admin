"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import dynamic from "next/dynamic";
import notFoundAnimation from "@public/assets/not-found.json";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => (
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
  ),
});

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-[400px]">
        <Lottie animationData={notFoundAnimation} />
      </div>

      <div className="flex flex-col items-center space-y-4 text-center">
        <h1 className="py-1 text-3xl font-semibold">404 - Page Not Found</h1>
        <p className="mt-2 text-gray-600">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="mt-4">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
