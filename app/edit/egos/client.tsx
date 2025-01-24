"use client";

import CommonButton from "@/app/_components/elements/CommonButton";
import { CreateStatModal } from "@/app/edit/egos/modals";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { Prisma } from "@prisma/client";
import { useState } from "react";

type Props = {
  initialEgos: Prisma.EgoGetPayload<{
    select: {
      id: true;
      title: true;
      stats: { select: { id: true; title: true; value: true } };
    };
  }>[];
};

export default function EgosClientPage({ initialEgos }: Props) {
  const [egos, setEgos] = useState(initialEgos);

  return (
    <div>
      <h1>Egos</h1>
      {egos.map((ego) => (
        <div key={ego.id}>
          <h2>{ego.title}</h2>
          <ul>
            {ego.stats.map((stat) => (
              <li key={stat.id}>
                {stat.title}: {stat.value}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <CreateStatModal />
    </div>
  );
}
