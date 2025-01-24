"use server";

export async function getSome() {
  await new Promise((res) => {
    setTimeout(res, 1000);
  });

  return "hi";
}
