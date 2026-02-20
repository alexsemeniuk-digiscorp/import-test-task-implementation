export type PurchaseRequestType = {
  requestId?: string;
  tenant?: {
    companyName: string;
  };
  orderId?: {
    company?: {
      name: string;
    };
  };
  fileItem?: {
    attachedFile?: {
      url: string;
      name: string;
    };
  };
};

type Ctx = {
  state: {
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
};

export const getEmailContent = (
  purchaseRequest: PurchaseRequestType,
  ctx: Ctx,
) => {
  const subject = `Purchase Request ${
    purchaseRequest.requestId ? purchaseRequest.requestId : ''
  } from ${purchaseRequest.tenant?.companyName ?? ''}`;

  purchaseRequest.fileItem.attachedFile.url;

  const body = `
    <p>Dear ${purchaseRequest.orderId?.company?.name ?? ''} Team,</p>

    <p>We hope this email finds you well.</p>

    <p>We are writing to formally submit a purchase request from ${
      purchaseRequest.tenant?.companyName ?? ''
    }. Please find the attached detailed PDF document containing the list of items we are requesting:</p>

    <p><a href="${purchaseRequest.fileItem.attachedFile.url}">${
      purchaseRequest.fileItem.attachedFile.name
    }</a></p>

    <p>If you have any questions or require further information, please do not hesitate to contact us. We appreciate your prompt attention to this request and look forward to your confirmation.</p>

    <p>Thank you.</p>

    <br />

    <p>Best regards,</p>
    <p>${ctx.state.user.firstName} ${ctx.state.user.lastName},<br>
    ${ctx.state.user.email},<br>
    ${purchaseRequest.tenant?.companyName ?? ''}</p>
`;

  return { subject, body };
};
