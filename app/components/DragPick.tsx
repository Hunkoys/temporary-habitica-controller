'use client';

export default function DragPick<T extends string>({
  label = '',
  list = [],
  ...props
}: Readonly<{
  label: string;
  list: T[];
}> &
  React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div>
      <div
        draggable
        className="select-none"
        onTouchStart={(e) => {
          console.log('mobile');
        }}
        onDragStart={(e) => {
          e.preventDefault();
          console.log('desktop');
        }}
      >
        {label}
      </div>
    </div>
  );
}
