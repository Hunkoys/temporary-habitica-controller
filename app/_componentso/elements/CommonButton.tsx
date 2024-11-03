import { Button } from '@nextui-org/button';

export default function CommonButton({
  children,
  ...props
}: { children?: React.ReactNode } & React.ComponentProps<typeof Button>) {
  return (
    <Button variant="ghost" {...props}>
      {children}
    </Button>
  );
}
