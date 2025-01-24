import CommonButton from "@/app/_components/elements/CommonButton";
import Link from "next/link";

export default function EditPage() {
  return (
    <div>
      <CommonButton>
        <Link href="/edit/egos">Egos</Link>
      </CommonButton>
      <CommonButton>
        <Link href="/edit/tasks">Tasks</Link>
      </CommonButton>
    </div>
  );
}
