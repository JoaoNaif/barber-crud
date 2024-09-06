export function fakeRandomGenerateCPF() {
  const min = 10000000000;
  const max = 99999999999;

  const randomCPF = Math.floor(Math.random() * (max - min + 1)) + min;

  return randomCPF;
}
