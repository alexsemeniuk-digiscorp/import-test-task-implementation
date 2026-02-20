type InvoiceRequestType = {
  invoiceId?: string;
  tenant?: {
    companyName: string;
  };
  orderId?: {
    company?: {
      name: string;
    };
    contact?: {
      fullName?: string;
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

// Function to generate the email content for wholesale invoices
export const getEmailContent = (
  invoiceRequest: InvoiceRequestType,
  ctx: Ctx,
) => {
  const subject = `Wholesale Invoice ${
    invoiceRequest.invoiceId ? invoiceRequest.invoiceId : ''
  } from ${invoiceRequest.tenant?.companyName ?? ''}`;

  const recipientName =
    invoiceRequest.orderId?.company?.name ||
    invoiceRequest.orderId?.contact?.fullName ||
    'Valued Retailer';

  const body = `
    <p>Dear ${recipientName},</p>

    <p>We hope this email finds you well.</p>

    <p>We are pleased to provide the attached invoice for your recent order. Please review the attached PDF document for detailed billing information:</p>

    <p><a href="${invoiceRequest.fileItem?.attachedFile?.url}">${invoiceRequest
      .fileItem?.attachedFile?.name}</a></p>

    <p>If you have any questions or require further assistance, please do not hesitate to contact us. We appreciate your prompt attention to the invoice and look forward to your continued business.</p>

    <p>Thank you.</p>

    <br />

    <p>Best regards,</p>
    <p>${ctx.state.user.firstName} ${ctx.state.user.lastName},<br>
    ${ctx.state.user.email},<br>
    ${invoiceRequest.tenant?.companyName ?? ''}</p>
  `;

  return { subject, body };
};
