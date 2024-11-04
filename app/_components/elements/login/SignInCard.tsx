"use client";

import CommonButton from "@/app/_components/elements/CommonButton";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
} from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import clerkLogo from "@/app/_components/elements/login/clerk-logo-light-accent.svg";
import Image from "next/image";
import { SignInButton, useUser } from "@clerk/nextjs";
import clsx from "clsx";

export default function SignInCard() {
  const [isLoading, setIsLoading] = useState(false);
  const onClick = useCallback(() => setIsLoading(true), []);

  const user = useUser();

  useEffect(() => {
    setIsLoading(false);
  }, [isLoading]);

  return (
    <section className="h-full flex flex-col items-center justify-center">
      <Card className="w-[300px] p-4 flex flex-col items-center gap-1 bg-matter-950">
        <CardBody className="flex flex-col items-center gap-4">
          <div className="flex flex-col items-center">
            <p className="text-gray-400">Welcome to</p>
            <h1 className="text-2xl font-bold text-secondary-400">Habitica+</h1>
          </div>
          <CommonButton
            as={"div"}
            color="primary"
            isDisabled={!user.isLoaded}
            isLoading={isLoading}
            onClick={onClick}
          >
            {user.isLoaded ? (
              <SignInButton mode="modal">
                {isLoading ? "Signing In..." : "Sign In"}
              </SignInButton>
            ) : (
              ""
            )}
          </CommonButton>
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
/*           {isLoading ? (
            <>
              <Spinner color="primary" />
              <p className="text-gray-400">Signing in...</p>
            </>
          ) : (
            <UniversalButton
              variant="flat"
              color="primary"
              size="lg"
              spinner={<CircularProgress color="primary" />}
              isLoading={isLoading}
              onClick={onClick}
            >
              Sign In
              {/* <SignInButton>Sign In</SignInButton> }
              </UniversalButton>
            )}
            */
