/** @format */

"use client";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface IFormInput {
  org_code: string;
  user_id: string;
  date_of_birth: string;
  remember_me: boolean;
}

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: IFormInput) => {
    setIsLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
    });

    if (result?.error) {
      setIsLoading(false);
      alert("Login failed");
    } else {
      setIsLoading(false);
      window.location.href = "/";
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8">
        <div className="mx-auto w-[300px]"></div>

        <div className="mx-auto w-[350px] p-6 pt-4">
          <div className="flex flex-col space-y-1.5 text-center mt-4 mb-8">
            <h2 className="font-semibold tracking-tight text-2xl">
              Account Login
            </h2>
          </div>
        </div>
      </div>
    </>
  );
}
