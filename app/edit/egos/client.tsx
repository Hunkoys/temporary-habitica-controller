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
  ScrollShadow,
} from "@heroui/react";
import { useCallback, useReducer, useState } from "react";

export default function EgosClientPage({ user }: { user: UserEgoPayload }) {
  const sendCreateStat = useCallback(async (title: string, value: string) => {
    createStat(title, parseFloat(value));
  }, []);
  const [selected, setSelected] = useState<string[]>([]);

  const sendDeleteStats = useCallback(async () => {
    await deleteStats(selected);
    setSelected([]);
  }, [selected]);

  const sendCreateEgo = useCallback(async (title: string) => {
    createEgo(title);
  }, []);

  const sendAssign = useCallback(
    (egoId: string) => {
      setSelected([]);
    },
    [selected]
  );

  return (
    <>
      <div className="flex gap-2 p-2 h-full w-[140%] sm:w-full transition-all">
        <Card className="w-full max-h-[100%]">
          <CardHeader>
            <h2>Egos</h2>
          </CardHeader>
          <CardBody>
            {user.egos.map((ego) => (
              <EgoCard key={ego.id} {...ego} onAssign={sendAssign} />
            ))}
          </CardBody>
          <CardFooter>
            <CreateEgoModal onCreate={sendCreateEgo} />
          </CardFooter>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <h2>Stats</h2>
          </CardHeader>
          <CardBody>
            <CheckboxGroup value={selected} onValueChange={setSelected}>
              {user.stats.map((stat) => (
                <StatCard key={stat.id} {...stat} />
              ))}
            </CheckboxGroup>
          </CardBody>
          <CardFooter className="flex gap-2 justify-between">
            <CreateStatModal onCreate={sendCreateStat} />
            <CommonButton
              onPress={sendDeleteStats}
              isDisabled={!selected.length}
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
  onAssign,
  onRemove,
}: UserEgoPayload["egos"][number] & {
  disabled?: boolean;
  onAssign?: (id: string) => void;
  onRemove?: (statIds: string[]) => void;
}) {
  const assign = useCallback(() => {
    onAssign?.(id);
  }, [id]);

  return (
    <div className="flex gap-3 items-center">
      <Card className={`bg-content2 w-full`}>
        <CardHeader>
          <h3>{title}</h3>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col gap-1 border-2 border-content3 rounded-lg p-2 min-h-10">
            hi
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
