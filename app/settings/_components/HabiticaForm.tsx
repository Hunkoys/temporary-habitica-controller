"use client";

import { saveHabiticaCreds } from "@/app/_actions/user";
import CommonButton from "@/app/_components/CommonButton";
import { HabiticaKeys } from "@/app/_types/habitica.types";
import { Button, Input } from "@nextui-org/react";
import clsx from "clsx";
import { useCallback, useState } from "react";

export default function HabiticaForm({
  habiticaCreds,
}: {
  habiticaCreds: HabiticaKeys;
}) {
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // disable on load

  const [APIUserValue, setAPIUserValue] = useState<string>(habiticaCreds.id);
  const [APIKeyValue, setAPIKeyValue] = useState<string>(habiticaCreds.token);

  const edit = useCallback(() => {
    setEditMode(true);
  }, []);

  const save = useCallback(() => {
    (async () => {
      const result = await saveHabiticaCreds({
        id: APIUserValue,
        token: APIKeyValue,
      });

      switch (result.status) {
        case "error":
          setError("Unknown error occurred. Please try again later.");
          break;
        case "invalid":
          setError("Invalid User ID or API Key.");
          break;
        case "success":
          setError(null);
          setEditMode(false);
          setShowPassword(false);
          break;
        default:
          result.status satisfies never;
      }
    })();
  }, [APIUserValue, APIKeyValue]);

  const cancel = useCallback(() => {
    setEditMode(false);
    setShowPassword(false);
    setAPIUserValue("");
    setAPIKeyValue("");

    setAPIUserValue(habiticaCreds.id);
    setAPIKeyValue(habiticaCreds.token);
  }, []);

  const togglePassword = useCallback(
    () => setShowPassword((prev) => !prev),
    []
  );

  const onAPIUserChange = useCallback((value: string) => {
    setError(null);
    setAPIUserValue(value);
  }, []);

  const onAPIKeyChange = useCallback((value: string) => {
    setError(null);
    setAPIKeyValue(value);
  }, []);

  return (
    <>
      <h2>Habitica</h2>
      <Input
        variant={editMode ? "faded" : "bordered"}
        label="User ID"
        isDisabled={!editMode}
        isInvalid={!!error}
        value={APIUserValue}
        onValueChange={onAPIUserChange}
      />
      <Input
        variant={editMode ? "faded" : "bordered"}
        label="API Key"
        isDisabled={!editMode}
        type={showPassword ? "text" : "password"}
        endContent={
          <Button onClick={togglePassword} isIconOnly>
            {showPassword ? eyeIcon : closedEyeIcon}
          </Button>
        }
        isInvalid={!!error}
        errorMessage={error}
        value={APIKeyValue}
        onValueChange={onAPIKeyChange}
      />
      <div className="self-end flex gap-1">
        <CommonButton className={clsx(editMode && "hidden")} onClick={edit}>
          Edit
        </CommonButton>
        <CommonButton
          className={clsx(editMode || "hidden")}
          onClick={cancel}
          color="danger"
        >
          Cancel
        </CommonButton>
        <CommonButton className={clsx(editMode || "hidden")} onClick={save}>
          Save
        </CommonButton>
      </div>
    </>
  );
}

const eyeIcon = (
  <svg
    width="20"
    height="16"
    viewBox="0 0 20 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 8C0 9.64 0.425 10.191 1.275 11.296C2.972 13.5 5.818 16 10 16C14.182 16 17.028 13.5 18.725 11.296C19.575 10.192 20 9.639 20 8C20 6.36 19.575 5.809 18.725 4.704C17.028 2.5 14.182 0 10 0C5.818 0 2.972 2.5 1.275 4.704C0.425 5.81 0 6.361 0 8ZM10 4.25C9.00544 4.25 8.05161 4.64509 7.34835 5.34835C6.64509 6.05161 6.25 7.00544 6.25 8C6.25 8.99456 6.64509 9.94839 7.34835 10.6517C8.05161 11.3549 9.00544 11.75 10 11.75C10.9946 11.75 11.9484 11.3549 12.6517 10.6517C13.3549 9.94839 13.75 8.99456 13.75 8C13.75 7.00544 13.3549 6.05161 12.6517 5.34835C11.9484 4.64509 10.9946 4.25 10 4.25Z"
      fill="white"
    />
  </svg>
);

const closedEyeIcon = (
  <svg
    width="20"
    height="12"
    viewBox="0 0 20 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.500001 2C0.499628 1.63723 0.63074 1.28661 0.869052 1.01309C1.10736 0.739571 1.43673 0.561685 1.79614 0.51238C2.15555 0.463076 2.52065 0.545695 2.82381 0.744934C3.12698 0.944173 3.34767 1.24653 3.445 1.596C5.392 8.098 14.603 8.099 16.554 1.601C16.6088 1.41096 16.7007 1.23364 16.8243 1.07924C16.9479 0.924838 17.1009 0.796413 17.2743 0.701355C17.4478 0.606296 17.6383 0.546481 17.835 0.525351C18.0317 0.504222 18.2305 0.522196 18.4202 0.578238C18.6099 0.634281 18.7867 0.727285 18.9403 0.851899C19.0939 0.976513 19.2213 1.13028 19.3152 1.30433C19.4092 1.47839 19.4678 1.66932 19.4876 1.86611C19.5075 2.0629 19.4883 2.26168 19.431 2.451C19.0893 3.61862 18.5395 4.71489 17.808 5.687L18.768 6.647C18.9112 6.78544 19.0254 6.95101 19.1039 7.13406C19.1824 7.3171 19.2237 7.51395 19.2254 7.71312C19.227 7.91229 19.189 8.10979 19.1134 8.29409C19.0379 8.4784 18.9265 8.64583 18.7856 8.7866C18.6447 8.92737 18.4771 9.03867 18.2928 9.114C18.1084 9.18934 17.9108 9.2272 17.7117 9.22537C17.5125 9.22355 17.3157 9.18208 17.1327 9.10338C16.9498 9.02468 16.7843 8.91033 16.646 8.767L15.636 7.757C15.111 8.1166 14.5516 8.4231 13.966 8.672L14.209 9.578C14.3012 9.95857 14.2409 10.3601 14.041 10.6968C13.8411 11.0335 13.5175 11.2787 13.1393 11.38C12.761 11.4814 12.3582 11.4308 12.0167 11.239C11.6753 11.0473 11.4224 10.7297 11.312 10.354L11.061 9.419C10.356 9.492 9.644 9.492 8.939 9.419L8.689 10.354C8.5861 10.7383 8.33475 11.066 7.99024 11.265C7.64574 11.4639 7.2363 11.5179 6.852 11.415C6.4677 11.3121 6.14002 11.0607 5.94105 10.7162C5.74207 10.3717 5.6881 9.9623 5.791 9.578L6.033 8.671C5.44777 8.42236 4.88869 8.11619 4.364 7.757L3.354 8.767C3.2157 8.91033 3.05023 9.02468 2.86727 9.10338C2.6843 9.18208 2.48749 9.22355 2.28832 9.22537C2.08915 9.2272 1.89162 9.18934 1.70724 9.114C1.52286 9.03867 1.35533 8.92737 1.21442 8.7866C1.07352 8.64583 0.962061 8.4784 0.886553 8.29409C0.811044 8.10979 0.772999 7.91229 0.774635 7.71312C0.776271 7.51395 0.817556 7.3171 0.896082 7.13406C0.974608 6.95101 1.0888 6.78544 1.232 6.647L2.192 5.687C1.46223 4.71648 0.913444 3.6223 0.572001 2.457C0.524512 2.30931 0.500223 2.15514 0.500001 2Z"
      fill="white"
    />
  </svg>
);
