export const randNth = (arr: any[], n: number = 1): any[] => {
  if (n > arr.length) {
    throw new Error("Sample size cannot be larger than array length");
  }

  const result = new Set<any>();
  while (result.size < n) {
    result.add(arr[Math.floor(Math.random() * arr.length)]);
  }

  return Array.from(result);
};

export const randPercent = (): number => {
  return Math.floor(Math.random() * 101);
};

export const randBool = (): boolean => {
  return Math.random() < 0.5;
};

export const resolveImageUrl = (imageUrl: string): string => {
  const filename = imageUrl.split("/").pop();
  const host = Bun.env.HOST || "localhost";

  if (Bun.env.NODE_ENV === "production" && host !== "localhost") {
    return `https://${host}/${filename}`;
  }

  return `http://${host}:${Bun.env.PORT}/${filename}`;
};
