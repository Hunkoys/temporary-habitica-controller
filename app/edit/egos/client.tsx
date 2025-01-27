"use client";

import CommonButton from "@/app/_components/elements/CommonButton";
import {
  createEgo,
  createStat,
  deleteStats,
  UserEgoPayload,
} from "@/app/edit/egos/actions";
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

export default function EgosClientPage({ user }: { user: UserEgoPayload }) {
  const [selectedStats, setSelectedStats] = useState<string[]>([]);
  const [selectedEgos, setSelectedEgos] = useState<string[]>([]);

  const sendCreateStat = useCallback(async (title: string, value: string) => {
    createStat(title, parseFloat(value));
  }, []);

  const sendDeleteStats = useCallback(async () => {
    await deleteStats(selectedStats);
    setSelectedStats([]);
  }, [selectedStats]);

  const sendCreateEgo = useCallback(async (title: string) => {
    createEgo(title);
  }, []);

  const sendAssign = useCallback(
    (egoId: string) => {
      setSelectedStats([]);
    },
    [selectedStats]
  );

  console.log(selectedEgos);

  return (
    <>
      <div className="flex gap-2 p-2 h-full w-[140%] sm:w-full transition-all">
        <Card className="w-full max-h-[100%]">
          <CardHeader>
            <h2>Egos</h2>
          </CardHeader>
          <CardBody>
            <CheckboxGroup value={selectedEgos} onValueChange={setSelectedEgos}>
              {user.egos.map((ego) => (
                <EgoCard
                  key={ego.id}
                  {...ego}
                  onAssign={sendAssign}
                  selection={selectedEgos}
                  setSelection={setSelectedEgos}
                />
              ))}
            </CheckboxGroup>
          </CardBody>
          <CardFooter className="flex gap-2 justify-between">
            <CreateEgoModal onCreate={sendCreateEgo} />
            <CommonButton onPress={sendDeleteStats} color="danger">
              Delete
            </CommonButton>
          </CardFooter>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <h2>Stats</h2>
          </CardHeader>
          <CardBody>
            <CheckboxGroup
              value={selectedStats}
              onValueChange={setSelectedStats}
            >
              {user.stats.map((stat) => (
                <StatCard key={stat.id} {...stat} />
              ))}
            </CheckboxGroup>
          </CardBody>
          <CardFooter className="flex gap-2 justify-between">
            <CreateStatModal onCreate={sendCreateStat} />
            <CommonButton
              onPress={sendDeleteStats}
              isDisabled={!selectedStats.length}
              color="danger"
            >
              Delete
            </CommonButton>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

function StatCard({ title, id }: { title: string; id: string }) {
  return (
    <div className="flex gap-2 items-stretch w-full">
      <Checkbox
        className={`max-w-full w-full bg-content2 items-center justify-start cursor-pointer
        rounded-lg gap-2 m-0 border-2 border-transparent hover:border-primary-200 data-[selected=true]:border-primary`}
        value={id}
      >
        <span>{title}</span>
      </Checkbox>
    </div>
  );
}

function EgoCard({
  title,
  id,
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
    onAssign?.(id);
  }, [id]);

  const isSelected = selection?.includes(id);

  return (
    <div className="flex gap-3 items-center">
      <Card
        className={clsx(
          "bg-content2 w-full border-2",
          isSelected ? "border-primary" : "border-transparent"
        )}
        onMouseUp={() => {
          if (selection?.includes(id)) {
            setSelection?.(selection.filter((s) => s !== id));
          } else {
            setSelection?.([...(selection || []), id]);
          }
          console.log("hi");
        }}
      >
        <CardHeader className="flex justify-between">
          <h3>{title}</h3>
          <Checkbox value={id} />
        </CardHeader>
        <CardBody>
          <div className="flex flex-col gap-1 border-2 border-content3 rounded-lg p-2 min-h-10"></div>
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
