export const classifyItems = (fetched, incoming) => {
  const fetchedValues = fetched?.map((item) => item.value);
  const newEmails = incoming.filter((email) => {
    return email && !fetchedValues.includes(email);
  });
  const duplicatedEmails = fetched.filter(
    (fetchedObj) => incoming.includes(fetchedObj?.value) && !!fetchedObj.value,
  );
  const oldEmails = fetched.filter((fetchedObj) => {
    return !incoming.includes(fetchedObj.value);
  });
  return {
    new: newEmails,
    duplicated: duplicatedEmails,
    old: oldEmails,
  };
};
