import clsx from "clsx";
import Link from "next/link";

export default function CommonLink({
  children,
  className,
  variant,
  ...props
}: {
  children?: React.ReactNode;
  variant?: "bordered" | "solid";
} & React.ComponentProps<typeof Link>) {
  return (
    <Link
      className={clsx(
        "border-2 border-content3 p-2 inline-block rounded-xl text-sm hover:bg-content3 transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
