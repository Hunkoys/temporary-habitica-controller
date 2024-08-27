import db from '@/prisma/db';

export default async function Home() {
  return (
    <main>
      <form
        action={async (formData: FormData) => {
          'use server';
          const email = formData.get('email');
          const name = formData.get('name');
          const password = formData.get('password');
          if (typeof email !== 'string' || typeof name !== 'string' || typeof password !== 'string') {
            return;
          }
          const response = await db.user.create({ data: { email, name, password } });
        }}
        className="flex flex-col gap-1"
      >
        <input type="email" name="email" placeholder="email" required />
        <input type="text" name="name" placeholder="name" />
        <input type="password" name="password" placeholder="password" />
        <button type="submit">Submit</button>
      </form>
    </main>
  );
}
