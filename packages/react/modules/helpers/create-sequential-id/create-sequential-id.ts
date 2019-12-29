const createSequentialId = (prefix: string) => {
  let id = 0;
  return () => {
    id += 1;
    return `${prefix}${id}`;
  };
};

export default createSequentialId;
