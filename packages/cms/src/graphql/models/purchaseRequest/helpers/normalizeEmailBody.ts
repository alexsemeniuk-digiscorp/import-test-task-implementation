export const normalizeEmailBody = (body: string, fileUrl?: string) =>
  fileUrl
    ? `<p>${body}</p><p><a href="${fileUrl}">Link to the file</a></p>`
    : body;
