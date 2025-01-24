"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { Card, Progress, Skeleton } from "@heroui/react";
import { useMemo, useState } from "react";

const LightningIcon = ({ className }: { className?: string }) => (
  <svg
    height="14"
    viewBox="0 0 14 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.00005 1C9.00016 0.780168 8.92783 0.566425 8.79425 0.391834C8.66067 0.217244 8.47328 0.091536 8.26107 0.0341569C8.04885 -0.0232223 7.82365 -0.00907517 7.62028 0.0744099C7.41692 0.157895 7.24674 0.306065 7.13605 0.496L0.136052 12.496C0.0473714 12.648 0.000358931 12.8207 -0.000238377 12.9966C-0.000835685 13.1726 0.045003 13.3456 0.13265 13.4981C0.220297 13.6507 0.346649 13.7774 0.498947 13.8656C0.651245 13.9537 0.824098 14.0001 1.00005 14H5.00005V21C4.99994 21.2198 5.07227 21.4336 5.20585 21.6082C5.33944 21.7828 5.52683 21.9085 5.73904 21.9658C5.95125 22.0232 6.17646 22.0091 6.37982 21.9256C6.58318 21.8421 6.75337 21.6939 6.86405 21.504L13.8641 9.504C13.9527 9.35203 13.9997 9.17935 14.0003 9.0034C14.0009 8.82744 13.9551 8.65445 13.8675 8.50188C13.7798 8.34931 13.6535 8.22256 13.5012 8.13444C13.3489 8.04632 13.176 7.99995 13.0001 8H9.00005V1Z"
      className={className}
    />
  </svg>
);

export default function Header() {
  const [value, setValue] = useState(2);
  const user = useUser();

  const profile = useMemo(() => {
    if (user.isLoaded && user.isSignedIn) {
      return user.user;
    }
    return null;
  }, [user.isLoaded, user.isSignedIn, user.user]);

  return (
    <div className="p-2 w-full">
      <Card className="w-full flex-row justify-between py-2 px-3 sm:px-4 transition-all bg-matter">
        <div className="flex gap-2 items-center">
          {profile && <UserButton />}
          <div>
            {profile?.fullName || profile?.username || (
              <Skeleton className="h-[1em] w-3/5 rounded-lg"></Skeleton>
            )}
            <Progress
              label={
                <span className="flex items-center gap-1">
                  {value} <LightningIcon className="fill-primary" />
                </span>
              }
              size="sm"
              value={value}
              color="primary"
              showValueLabel={true}
              valueLabel={10}
              maxValue={10}
              className="w-20"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

{
  /* <Progress
              size="sm"
              value={30}
              color="primary"
              showValueLabel={true}
              valueLabel={'1'}
              maxValue={10}
              
              className="w-10"
            /> */
}
