export default (name: string): string => {
  return (
    name
      .trim()
      // remove chaining white space
      .replace(/\s+/g, ' ')
      // uppercase first letter
      .replace(/(^|\s)\w+/g, (match: string) => match.toUpperCase())
      // lowercase non first letter
      .replace(/(?<=\w)\w+?(?=(\s|$))/g, (match: string) => match.toLowerCase())
  );
};
