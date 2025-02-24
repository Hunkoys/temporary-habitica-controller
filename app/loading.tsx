import { Spinner } from "@heroui/react";

export default function Loading() {
  return (
    <div className="flex justify-center align-middle h-full">
      <Spinner color="primary" />
    </div>
  );
}
