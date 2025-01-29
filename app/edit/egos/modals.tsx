"use client";

import CommonButton from "@/app/_components/elements/CommonButton";
import {
  Alert,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { useCallback, useState } from "react";

type EgoModalProps = {
  onCreate?: (title: string) => void;
  show?: boolean;
  error?: string;
  onInput?: (title: string) => void;
};

export function CreateEgoModal({
  onCreate,
  show = false,
  error,
  onInput,
}: EgoModalProps) {
  const [title, setTitle] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure({
    defaultOpen: show,
    onClose: () => {
      setTitle("");
    },
  });

  const create = useCallback(() => {
    return onCreate?.(title) || "";
  }, [title, onCreate]);

  const onValueChange = useCallback(
    (value: string) => {
      setTitle(value);
      onInput?.(value);
    },
    [onInput]
  );

  return (
    <div>
      <CommonButton onPress={onOpen} className="min-w-0">
        New Ego
      </CommonButton>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h3>New Ego</h3>
              </ModalHeader>
              <ModalBody>
                <Form
                  validationBehavior="native"
                  onSubmit={(e) => {
                    e.preventDefault();
                    create();
                    onClose();
                  }}
                >
                  <Input
                    autoFocus
                    isRequired
                    label="Name"
                    isClearable
                    value={title}
                    onValueChange={onValueChange}
                    isInvalid={!!error}
                    errorMessage={error}
                  />
                  <div className="flex gap-1 w-full">
                    <CommonButton className="w-full" onPress={onClose}>
                      Discard
                    </CommonButton>
                    <CommonButton
                      className="w-full"
                      type="submit"
                      color="primary"
                      variant="shadow"
                      isDisabled={!!error}
                    >
                      Create
                    </CommonButton>
                  </div>
                </Form>
              </ModalBody>
              {/* <Alert
                color="danger"
                description={error}
                isVisible={Boolean(error)}
              /> */}
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

type StatModalProps = {
  onCreate?: (title: string, value: string) => void;
  show?: boolean;
  error?: string;
};
export function CreateStatModal({
  onCreate,
  show = false,
  error = "",
}: StatModalProps) {
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure({
    onClose: () => {
      setTitle(""), setValue("");
    },
  });

  const create = useCallback(async () => {
    onCreate?.(title, value || "0");
  }, [title, value]);

  return (
    <div>
      <CommonButton onPress={onOpen} className="min-w-0">
        New Stat
      </CommonButton>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h3>New Stat</h3>
              </ModalHeader>
              <ModalBody>
                <Form
                  validationBehavior="native"
                  onSubmit={(e) => {
                    e.preventDefault();
                    onClose();
                  }}
                >
                  <Input
                    autoFocus
                    isRequired
                    label="Name"
                    isClearable
                    value={title}
                    onValueChange={setTitle}
                  />
                  <Input
                    type="number"
                    label="Value"
                    placeholder="0"
                    isClearable
                    value={value}
                    onValueChange={setValue}
                  />
                  <div className="flex gap-1 w-full">
                    <CommonButton className="w-full" onPress={onClose}>
                      Discard
                    </CommonButton>
                    <CommonButton
                      className="w-full"
                      type="submit"
                      onPress={create}
                      color="primary"
                      variant="shadow"
                    >
                      Create
                    </CommonButton>
                  </div>
                </Form>
              </ModalBody>
              <Alert
                color="danger"
                description={error}
                isVisible={Boolean(error)}
              />
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

//destroy cache
