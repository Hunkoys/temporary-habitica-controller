import spidey from '@/app/tasks/1348489.png';
import Image from 'next/image';

export default function Tasks() {
  return (
    <div>
      <h1>Tasks</h1>
      <ul>
        <li>Task 1</li>
        <li>Task 2</li>
        <li>Task 3</li>
      </ul>
      <Image src={spidey} alt="spidey" width={800} height={800} />
    </div>
  );
}
