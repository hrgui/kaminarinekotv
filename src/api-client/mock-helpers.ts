export function getPageSlice(pageNumber: number, pageSize: number): [number, number] {
  return [(pageNumber - 1) * pageSize, pageNumber * pageSize];
}

export function wait(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
