export const isInOrBetween = (str: string) => {
  const arr = /^\s*(not )?(in|between)\s*$/i.exec(str);
  return arr ? Array.from(arr) : arr;
};
