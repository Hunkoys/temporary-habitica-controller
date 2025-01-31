"use client";

import CommonButton from "@/app/_components/elements/CommonButton";
import clerkLogo from "@/app/_components/elements/login/clerk-logo-light-accent.svg";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Card, CardBody, CardFooter, Divider } from "@heroui/react";
import Image from "next/image";

export default function SignInCard() {
  const user = useUser();

  return (
    <section className="h-full flex flex-col items-center justify-center">
      <Card className="w-[300px] p-4 flex flex-col items-center gap-1 ">
        <CardBody className="flex flex-col items-center gap-4">
          <div className="flex flex-col items-center">
            <p className="text-gray-400">Welcome to</p>
            <h1 className="text-2xl font-bold text-secondary">Habitica+</h1>
          </div>
          {user.isLoaded ? (
            <SignInButton mode="modal">
              <CommonButton color="primary">Sign In</CommonButton>
            </SignInButton>
          ) : (
            <CommonButton isDisabled>Sign In</CommonButton>
          )}
        </CardBody>
        <Divider className="w-full" />
        <CardFooter className="text-sm text-foreground-400 flex justify-center align-baseline gap-1 mt-1 p-0">
          Secured by
          <span>
            <Image src={clerkLogo} alt="Clerk.dev" height={14} />{" "}
          </span>
        </CardFooter>
      </Card>
    </section>
  );
}
