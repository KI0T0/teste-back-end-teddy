import { Transform } from 'class-transformer';

export function ToLowerCase() {
  return Transform(({ value }) => {
    if (value === null || value === undefined) {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map((item) => (typeof item === 'string' ? item.toLowerCase() : item));
    }

    if (typeof value === 'string') {
      return value.toLowerCase();
    }

    return value;
  });
}
