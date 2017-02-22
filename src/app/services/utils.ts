export function toggleArrayValues<T>(arr: T[], values: T[]): T[] {
  if (!Array.isArray(arr)) {
    throw new Error('You must give an array to `toggleArrayValues`.');
  }

  let copy: T[] = [ ...arr ];
  values.forEach((value: T) => {
    if (copy.includes(value)) {
      copy.splice( copy.indexOf(value), 1 );
    } else {
      copy.push(value);
    }
  });
  return copy;
}
