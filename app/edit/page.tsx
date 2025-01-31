import CommonButton from "@/app/_components/elements/CommonButton";
import CommonLink from "@/app/_components/elements/CommonLink";
import Link from "next/link";

export default function EditPage() {
  return (
    <div>
      <CommonLink href="/edit/egos">Egos</CommonLink>
      <CommonLink href="/edit/stats">Stats</CommonLink>
    </div>
  );
}
