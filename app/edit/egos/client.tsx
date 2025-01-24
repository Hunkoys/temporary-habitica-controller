"use client";

import CommonButton from "@/app/_components/elements/CommonButton";
import { Prisma } from "@prisma/client";
import { useState } from "react";

type Props = {
  initialEgos: Prisma.EgoGetPayload<{
    select: {
      id: true;
      title: true;
      stat: { select: { id: true; title: true; value: true } };
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
            {ego.stat.map((stat) => (
              <li key={stat.id}>
                {stat.title}: {stat.value}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <CommonButton>Create</CommonButton>
    </div>
  );
}
