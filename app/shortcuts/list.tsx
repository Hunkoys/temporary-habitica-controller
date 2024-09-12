'use client';

export default function ShortcutsList({
  user,
}: {
  user: { id: string; habiticaUserId: string | null; habiticaApiKey: string | null; linked: boolean; shortcuts: {}[] };
}) {
  return (
    <div>
      <h1>Shortcuts</h1>
    </div>
  );
}
