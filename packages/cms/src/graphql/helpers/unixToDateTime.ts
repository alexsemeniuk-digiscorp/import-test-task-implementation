const unixToDateTime = (unix: number): Date => {
  return new Date(unix * 1000);
};

export default unixToDateTime;
