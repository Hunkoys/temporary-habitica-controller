"use client";

import CommonButton from "@/app/_components/elements/CommonButton";
import { UserEgoPayload } from "@/app/edit/egos/actions";
import { CreateEgoModal, CreateStatModal } from "@/app/edit/egos/modals";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  CheckboxGroup,
  useCheckboxGroup,
  useCheckboxGroupContext,
} from "@heroui/react";
import clsx from "clsx";
import { useCallback, useState } from "react";

export default function EgosClientPage({
  userInitial,
}: {
  userInitial: UserEgoPayload;
}) {
  const [user, setUser] = useState(userInitial);

  const [selectedStats, setSelectedStats] = useState<string[]>([]);
  const [selectedEgos, setSelectedEgos] = useState<string[]>([]);

  const createEgo = useCallback((title: string) => {
    let error = "";

    setUser((u) => {
      if (exists(u.egos, title)) {
        error = "Ego with that name already exists";
        return u;
      }

      return {
        ...u,
        egos: [
          ...u.egos,
          {
            title,
            stats: [],
          },
        ],
      };
    });

    return error;
  }, []);

  const deleteSelected = useCallback(() => {
    setUser((u) => ({
      ...u,
      egos: u.egos.filter((e) => !selectedEgos.includes(e.title)),
      stats: u.stats.filter((s) => !selectedStats.includes(s.title)),
    }));

    setSelectedEgos((e) => e.filter((s) => !selectedEgos.includes(s)));
    setSelectedStats((s) => s.filter((s) => !selectedStats.includes(s)));
  }, [selectedEgos, selectedStats]);

  console.log(selectedEgos);

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
                  <CreateEgoModal onCreate={createEgo} />
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
                  <CreateStatModal />
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

function StatCard({ title }: { title: string }) {
  return (
    <div className="flex gap-2 items-stretch w-full">
      <Checkbox
        className={`max-w-full w-full bg-content2 items-center justify-start cursor-pointer
        rounded-lg gap-2 m-0 border-2 border-transparent hover:border-primary-200 data-[selected=true]:border-primary`}
        value={title}
      >
        <span>{title}</span>
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
  }, [title]);

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
            <Checkbox />
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
        id: string;
      };
    }
  | {
      action: "edit-stat";
      payload: {
        id: string;
        title?: string;
        value?: string;
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
        id: string;
      };
    }
  | {
      action: "edit-ego";
      payload: {
        id: string;
        title?: string;
      };
    }
  | {
      action: "assign-stat";
      payload: {
        egoId: string;
        statId: string;
      };
    };
