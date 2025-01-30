"use client";

import CommonButton from "@/app/_components/elements/CommonButton";
import { rebuildEgos, UserEgoPayload } from "@/app/edit/egos/actions";
import { CreateEgoModal, CreateStatModal } from "@/app/edit/egos/modals";
import {
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  CheckboxGroup,
} from "@heroui/react";
import clsx from "clsx";
import { useCallback, useReducer, useState } from "react";

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
            value: parseFloat(payload.value),
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

  const [user, modUser] = useReducer(reducer, userInitial);

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
    await rebuildEgos(user);
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

  console.log(selectedStats);

  return (
    <>
      <div className="h-full flex flex-col gap-3 items-stretch justify-between">
        <div className="w-[100%] overflow-auto h-full">
          <div className="flex gap-2 p-2 h-full w-[140%] sm:w-full transition-all">
            <Card className="w-full max-h-[100%]">
              <CardHeader className="flex justify-between">
                <h2>Egos</h2>
                <div className="flex gap-1 justify-end">
                  <Checkbox size="lg" />
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
                    />
                  ))}
                </CheckboxGroup>
              </CardBody>
            </Card>

            <Card className="w-full">
              <CardHeader className="flex justify-between">
                <h2>Stats</h2>
                <div className="flex gap-1 justify-end">
                  <Checkbox size="lg" />
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
                    <StatCard key={stat.title} {...stat} />
                  ))}
                </CheckboxGroup>
              </CardBody>
            </Card>
          </div>
        </div>

        <div className="flex justify-between gap-2">
          <CommonButton
            color="danger"
            isDisabled={!(selectedEgos.length + selectedStats.length)}
            onPress={deleteSelected}
          >
            Delete
          </CommonButton>
          <CommonButton
            variant="solid"
            color="primary"
            isDisabled={userInitial == user}
            onPress={save}
          >
            Save
          </CommonButton>
        </div>
      </div>
    </>
  );
}

function exists(arr: { title: string }[], title: string) {
  return arr.find((i) => i.title === title);
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="flex gap-2 items-stretch w-full">
      <Checkbox
        className={`max-w-full w-full bg-content2 items-center justify-start cursor-pointer
        rounded-lg gap-2 m-0 border-2 border-transparent hover:border-primary-200 data-[selected=true]:border-primary`}
        value={title}
      >
        <span>{title}</span>
        <span>{value}</span>
      </Checkbox>
    </div>
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
  setSelection?: (ids: string[]) => void;
  onAssign?: (id: string) => void;
  onRemove?: (statIds: string[]) => void;
}) {
  const assign = useCallback(() => {
    onAssign?.(title);
  }, [title, onAssign]);

  const isSelected = selection?.includes(title);

  const toggleSelection = useCallback(() => {
    if (isSelected) {
      setSelection?.(selection?.filter((s) => s !== title) || []);
    } else {
      setSelection?.([...(selection || []), title]);
    }
  }, [selection]);

  return (
    <div className="flex gap-3 items-center">
      <Card
        className={clsx(
          "bg-content2 w-full border-2",
          isSelected ? "border-primary" : "border-transparent"
        )}
        onMouseUp={toggleSelection}
      >
        <CardHeader className="flex justify-between">
          <h3>{title}</h3>
          <Checkbox value={title} />
        </CardHeader>
        <CardBody>
          <div className="flex flex-col gap-1 border-2 border-content3 rounded-lg p-2 min-h-10">
            {stats.map((stat) => (
              <span key={stat.title}>{stat.title}</span>
            ))}
          </div>
        </CardBody>
      </Card>
      <CommonButton isDisabled={disabled} onPress={assign}>
        {"<-"}
      </CommonButton>
    </div>
  );
}

const ACTIONS = [
  "stat",
  "delete-stat",
  "edit-stat",
  "ego",
  "delete-ego",
  "edit-ego",
  "assign-stat",
];

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
        value: string;
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
    };
