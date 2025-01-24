import EgosClientPage from "@/app/edit/egos/client";

export default function EgosPage() {
  return (
    <EgosClientPage
      initialEgos={[
        {
          id: "1",
          title: "Basketball Savant",
          stat: [{ title: "Handles", value: 3000, id: "1" }],
        },
      ]}
    />
  );
}
