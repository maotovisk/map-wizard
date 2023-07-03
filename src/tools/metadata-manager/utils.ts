const getUniqueValues = (arr: string[]): string[] => {
  let temp = [];
  return [
    ...new Set(
      arr.filter((x) => {
        let _x = typeof x === "string" ? x.toLowerCase() : x;
        if (temp.indexOf(_x) === -1) {
          temp.push(_x);
          return x;
        }
      })
    ),
  ];
};
export { getUniqueValues };
