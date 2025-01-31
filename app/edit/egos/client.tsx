"use client";

import CommonButton from "@/app/_components/elements/CommonButton";
import { rebuildEgos, UserEgoPayload } from "@/app/edit/egos/actions";
import { CreateEgoModal, CreateStatModal } from "@/app/edit/egos/modals";
import {
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  CheckboxGroup,
  Chip,
  Divider,
  Form,
  input,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import clsx from "clsx";
import { FormEvent, useCallback, useReducer, useState } from "react";

function reducer(
  user: UserEgoPayload,
  { action, payload }: ActionPayloadMap
): UserEgoPayload {
  switch (action) {
    case "ego":
      return {
        ...user,
        egos: [
          ...user.egos,
          {
            title: payload.title,
            stats: [],
          },
        ],
      };
    case "stat":
      return {
        ...user,
        stats: [
          ...user.stats,
          {
            title: payload.title,
            value: parseFloat(payload.value || "0"),
            egos: [],
          },
        ],
      };
    case "delete-ego":
      return {
        ...user,
        egos: user.egos.filter((e) => !payload.titles.includes(e.title)),
      };
    case "delete-stat":
      return {
        ...user,
        stats: user.stats.filter((s) => !payload.titles.includes(s.title)),
        egos: user.egos.map((e) => ({
          ...e,
          stats: e.stats.filter((s) => !payload.titles.includes(s.title)),
        })),
      };
    case "assign-stat":
      return {
        ...user,
        egos: user.egos.map((e) => {
          if (e.title === payload.ego) {
            const statList = new Set<string>([
              ...e.stats.map(({ title }) => title),
              ...payload.stats,
            ]);
            return {
              ...e,
              stats: user.stats.filter((s) => statList.has(s.title)),
            };
          }
          return e;
        }),
      };
    case "remove-stat":
      return {
        ...user,
        egos: user.egos.map((e) => {
          if (e.title === payload.ego) {
            return {
              ...e,
              stats: e.stats.filter((s) => !payload.stats.includes(s.title)),
            };
          }
          return e;
        }),
      };
    case "edit-stat":
      return {
        ...user,
        stats: user.stats.map((s) => {
          if (s.title === payload.title) {
            return {
              ...s,
              title: payload.newTitle || s.title,
              value: payload.value ? parseFloat(payload.value || "0") : s.value,
            };
          }
          return s;
        }),
        egos: user.egos.map((e) => ({
          ...e,
          stats: e.stats.map((s) => {
            if (s.title === payload.title) {
              return {
                ...s,
                title: payload.newTitle || s.title,
              };
            }
            return s;
          }),
        })),
      };
    case "edit-ego":
      return {
        ...user,
        egos: user.egos.map((e) => {
          if (e.title === payload.title) {
            return {
              ...e,
              title: payload.newTitle,
            };
          }
          return e;
        }),
      };
    default:
      action satisfies never;
      throw Error("Invalid action");
  }
}

export default function EgosClientPage({
  userInitial,
}: {
  userInitial: UserEgoPayload;
}) {
  const [selectedStats, setSelectedStats] = useState<string[]>([]);
  const [selectedEgos, setSelectedEgos] = useState<string[]>([]);
  const [egoError, setEgoError] = useState("");
  const [statError, setStatError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [user, modUser] = useReducer(reducer, userInitial);

  const selectAllEgos = useCallback(
    (checked: boolean) => {
      if (checked) setSelectedEgos(user.egos.map((e) => e.title));
      else setSelectedEgos([]);
    },
    [user]
  );

  const selectAllStats = useCallback(
    (checked: boolean) => {
      if (checked) setSelectedStats(user.stats.map((s) => s.title));
      else setSelectedStats([]);
    },
    [user]
  );

  const deselectAll = useCallback(() => {
    setSelectedEgos([]);
    setSelectedStats([]);
  }, []);

  const egoInput = useCallback(
    (title: string) => {
      if (exists(user.egos, title))
        setEgoError("Ego with that name already exists");
      else setEgoError("");
    },
    [user]
  );

  const statInput = useCallback(
    (title: string) => {
      if (exists(user.stats, title))
        setStatError("Stat with that name already exists");
      else setStatError("");
    },
    [user]
  );

  const createEgo = useCallback((title: string) => {
    modUser({ action: "ego", payload: { title } });
  }, []);

  const createStat = useCallback((title: string, value: string) => {
    modUser({ action: "stat", payload: { title, value } });
  }, []);

  const deleteSelected = useCallback(() => {
    modUser({
      action: "delete-ego",
      payload: {
        titles: selectedEgos,
      },
    });
    modUser({
      action: "delete-stat",
      payload: {
        titles: selectedStats,
      },
    });

    setSelectedEgos([]);
    setSelectedStats([]);
  }, [selectedEgos, selectedStats]);

  const save = useCallback(async () => {
    setIsSaving(true);
    await rebuildEgos(user);
    setIsSaving(false);
  }, [user]);

  const assign = useCallback(
    (ego: string) => {
      modUser({
        action: "assign-stat",
        payload: {
          ego,
          stats: selectedStats,
        },
      });

      setSelectedStats([]);
    },
    [selectedStats]
  );

  const remove = useCallback((ego: string, stat: string) => {
    modUser({
      action: "remove-stat",
      payload: {
        ego,
        stats: [stat],
      },
    });
  }, []);

  const [editing, setEditing] = useState<"Ego" | "Stat" | "">("");

  const edit = useCallback(() => {
    if (selectedEgos.length === 1) setEditing("Ego");
    else if (selectedStats.length === 1) setEditing("Stat");
  }, [selectedEgos, selectedStats]);

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onOpenChange: onEditOpenChange,
  } = useDisclosure({
    onOpen: edit,
  });

  const updateStat = useCallback(
    (
      title: string,
      { value, newTitle }: { value?: string; newTitle?: string }
    ) => {
      setSelectedStats([]);
      modUser({
        action: "edit-stat",
        payload: {
          title,
          value,
          newTitle,
        },
      });
    },
    []
  );

  const updateEgo = useCallback((title: string, newTitle: string) => {
    setSelectedEgos([]);
    modUser({
      action: "edit-ego",
      payload: {
        title,
        newTitle,
      },
    });
  }, []);

  return (
    <>
      <div
        className="h-full flex flex-col gap-3 items-stretch justify-between"
        onMouseDownCapture={deselectAll}
      >
        <div className="w-[100%] overflow-auto h-full">
          <div className="flex gap-2 p-2 h-full w-[140%] sm:w-full transition-all">
            <Card className="w-full max-h-[100%]">
              <CardHeader className="flex justify-between">
                <h2>Egos</h2>
                <div className="flex gap-1 justify-end">
                  <Checkbox size="lg" onValueChange={selectAllEgos} />
                  <CreateEgoModal
                    onCreate={createEgo}
                    error={egoError}
                    onInput={egoInput}
                  />
                </div>
              </CardHeader>
              <CardBody>
                <CheckboxGroup
                  value={selectedEgos}
                  onValueChange={setSelectedEgos}
                >
                  {user.egos.map((ego) => (
                    <EgoCard
                      key={ego.title}
                      {...ego}
                      selection={selectedEgos}
                      setSelection={setSelectedEgos}
                      onAssign={assign}
                      onRemove={remove}
                      disabled={!selectedStats.length}
                    />
                  ))}
                </CheckboxGroup>
              </CardBody>
            </Card>

            <Card className="w-full">
              <CardHeader className="flex justify-between">
                <h2>Stats</h2>
                <div className="flex gap-1 justify-end">
                  <Checkbox size="lg" onValueChange={selectAllStats} />
                  <CreateStatModal
                    onCreate={createStat}
                    error={statError}
                    onInput={statInput}
                  />
                </div>
              </CardHeader>
              <CardBody>
                <CheckboxGroup
                  value={selectedStats}
                  onValueChange={setSelectedStats}
                >
                  {user.stats.map((stat) => (
                    <StatCard
                      key={stat.title}
                      {...stat}
                      onValueEdit={updateStat}
                      setSelection={setSelectedStats}
                    />
                  ))}
                </CheckboxGroup>
              </CardBody>
            </Card>
          </div>
        </div>

        <div className="flex justify-between gap-2 px-2">
          <div className="flex items-center gap-2">
            <CommonButton
              color="danger"
              isDisabled={!(selectedEgos.length + selectedStats.length)}
              onPress={deleteSelected}
            >
              Delete
            </CommonButton>
            <CommonButton
              onPress={onEditOpen}
              isDisabled={selectedEgos.length + selectedStats.length !== 1}
            >
              Edit
            </CommonButton>
          </div>
          <CommonButton
            variant="solid"
            color="primary"
            isDisabled={userInitial == user}
            onPress={save}
            isLoading={isSaving}
          >
            Save
          </CommonButton>
        </div>
      </div>
      <Modal isOpen={isEditOpen} onOpenChange={onEditOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-baseline gap-4">
                Edit {editing}:
                <Chip
                  variant="bordered"
                  size="lg"
                  radius="sm"
                  className="text-xl font-bold"
                >
                  {editing === "Ego" ? selectedEgos[0] : selectedStats[0]}
                </Chip>
              </ModalHeader>
              <ModalBody>
                {editing === "Ego" ? (
                  <EgoEditForm
                    title={selectedEgos[0]}
                    onSave={updateEgo}
                    onCancel={onClose}
                  />
                ) : (
                  <StatEditForm
                    stat={user.stats.find((s) => s.title === selectedStats[0])}
                    onSave={updateStat}
                    onCancel={onClose}
                  />
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

function EgoEditForm({
  title: currentTitle,
  onSave,
  onCancel,
}: {
  title: string;
  onSave?: (title: string, newTitle: string) => void;
  onCancel?: () => void;
}) {
  const [title, setTitle] = useState(currentTitle);
  const onSubmit = useCallback(
    (e: FormEvent) => {
      onCancel?.();
      e.preventDefault();
      onSave?.(currentTitle, title);
    },
    [title]
  );

  return (
    <Form onSubmit={onSubmit}>
      <Input label="Title" autoFocus value={title} onValueChange={setTitle} />
      <div className="w-full flex justify-end gap-1">
        <CommonButton onPress={onCancel}>Cancel</CommonButton>
        <CommonButton type="submit" variant="solid" color="primary">
          Save
        </CommonButton>
      </div>
    </Form>
  );
}

function StatEditForm({
  stat: { title: currentTitle, value: currentValue } = { title: "", value: 0 },
  onSave,
  onCancel,
}: {
  stat?: {
    title: string;
    value: number;
  };
  onSave?: (
    title: string,
    { newTitle, value }: { newTitle: string; value: string }
  ) => void;
  onCancel?: () => void;
}) {
  const [title, setTitle] = useState(currentTitle);
  const [value, setValue] = useState(currentValue.toString());

  const onSubmit = useCallback(
    (e: FormEvent) => {
      onCancel?.();
      e.preventDefault();
      onSave?.(currentTitle, { newTitle: title, value });
    },
    [title, value]
  );

  return (
    <Form onSubmit={onSubmit}>
      <Input label="Title" autoFocus value={title} onValueChange={setTitle} />
      <Input
        label="Value"
        type="number"
        value={value}
        onValueChange={setValue}
      />
      <div className="w-full flex justify-end gap-1">
        <CommonButton onPress={onCancel}>Cancel</CommonButton>
        <CommonButton type="submit" variant="solid" color="primary">
          Save
        </CommonButton>
      </div>
    </Form>
  );
}

function exists(arr: { title: string }[], title: string) {
  return arr.find((i) => i.title === title);
}

function StatCard({
  title,
  value,
  setSelection,
}: {
  title: string;
  value: number;
  setSelection?: (selection: string[]) => void;
}) {
  const select = useCallback(() => {
    setSelection?.([title]);
  }, [title]);

  return (
    <Card onMouseDown={select}>
      <CardBody
        className={clsx(
          "flex flex-row items-center justify-between bg-content2 border-2 border-transparent"
        )}
      >
        <div className="flex items-center">
          <Checkbox value={title} size="lg" />
          <div>{title}</div>
        </div>
        <span>{value}</span>
      </CardBody>
    </Card>
  );
}

function EgoCard({
  title,
  stats,
  disabled,
  selection,
  setSelection,
  onAssign,
  onRemove,
}: UserEgoPayload["egos"][number] & {
  disabled?: boolean;
  selection?: string[];
  setSelection?: (selection: string[]) => void;
  onAssign?: (title: string) => void;
  onRemove?: (ego: string, stat: string) => void;
}) {
  const assign = useCallback(() => {
    onAssign?.(title);
  }, [title, onAssign]);

  const isSelected = selection?.includes(title);

  const select = useCallback(() => {
    setSelection?.([title]);
  }, [title]);

  const remove = useCallback(
    (stat: string) => {
      onRemove?.(title, stat);
    },
    [title]
  );

  return (
    <div className="flex gap-3 items-center">
      <Card
        className={clsx(
          "bg-content2 w-full border-2",
          isSelected ? "border-primary" : "border-transparent"
        )}
        onMouseDown={select}
      >
        <CardHeader className="flex justify-between">
          <h3>{title}</h3>
          <Checkbox value={title} size="lg" />
        </CardHeader>
        <CardBody>
          <div className="flex flex-col gap-1 border-2 border-content3 rounded-lg p-2 min-h-10">
            {stats.map((stat) => (
              <EgoStatStrip
                key={stat.title}
                title={stat.title}
                onRemove={remove}
              />
            ))}
          </div>
        </CardBody>
      </Card>
      <CommonButton
        className="min-w-0"
        variant="solid"
        color={disabled ? "default" : "primary"}
        isDisabled={disabled}
        onPress={assign}
      >
        {"<-"}
      </CommonButton>
    </div>
  );
}

function EgoStatStrip({
  title,
  onRemove,
}: {
  title: string;
  onRemove: (title: string) => void;
}) {
  const remove = useCallback(() => {
    onRemove?.(title);
  }, [title]);

  return (
    <div className="flex justify-between items-center bg-content3 rounded-md py-1 px-3">
      <span>{title}</span>
      <CommonButton
        className="min-w-0 min-h-0 p-0 h-5 w-5"
        onPress={remove}
        variant="light"
        radius="full"
        color="danger"
      >
        X
      </CommonButton>
    </div>
  );
}

type ActionPayloadMap =
  | {
      action: "stat";
      payload: {
        title: string;
        value: string;
      };
    }
  | {
      action: "delete-stat";
      payload: {
        titles: string[];
      };
    }
  | {
      action: "edit-stat";
      payload: {
        title: string;
        value?: string;
        newTitle?: string;
      };
    }
  | {
      action: "ego";
      payload: {
        title: string;
      };
    }
  | {
      action: "delete-ego";
      payload: {
        titles: string[];
      };
    }
  | {
      action: "edit-ego";
      payload: {
        title: string;
        newTitle: string;
      };
    }
  | {
      action: "assign-stat";
      payload: {
        ego: string;
        stats: string[];
      };
    }
  | {
      action: "remove-stat";
      payload: {
        ego: string;
        stats: string[];
      };
    };
