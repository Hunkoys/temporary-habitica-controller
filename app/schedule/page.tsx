import { Spinner } from '@nextui-org/react';
import Image from 'next/image';

export default function Tasks() {
  return (
    <div className="h-full w-full flex justify-center border-1 border-primary-600">
      <Spinner color="primary" />
    </div>
  );
}
