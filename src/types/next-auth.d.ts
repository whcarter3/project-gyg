import 'next/headers';

declare module 'next/headers' {
  function cookies(): {
    get(name: string): { value: string } | undefined;
    set(name: string, value: string): void;
    delete(name: string): void;
  };
}
