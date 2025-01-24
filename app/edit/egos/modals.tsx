"use client";

import CommonButton from "@/app/_components/elements/CommonButton";
import { createStat } from "@/app/edit/egos/actions";
import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { useCallback, useState } from "react";

export function CreateStatModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");

  const create = useCallback(async () => {
    await createStat(title, parseFloat(value));
  }, [title, value]);

  return (
    <div>
      <CommonButton onPress={onOpen}>New Ego</CommonButton>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h3>New Ego</h3>
              </ModalHeader>
              <ModalBody>
                <Input label="Name" value={title} onValueChange={setTitle} />
                <Input
                  type="number"
                  label="Value"
                  value={value}
                  onValueChange={setValue}
                />
              </ModalBody>
              <ModalFooter>
                <CommonButton onPress={onClose}>Discard</CommonButton>
                <CommonButton onPress={create}>Create</CommonButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export function CreateEgoModal() {
  return <div></div>;
}
