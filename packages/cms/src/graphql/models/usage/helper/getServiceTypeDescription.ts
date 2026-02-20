export const getServiceTypeDescription = (serviceType: string): string => {
  const serviceTypeDescriptions = {
    // User accounts
    userCount: 'New Team Member Added',

    // Inventory
    inventoryItemCount: 'New Item Added',

    // Voice services
    callTime: 'Voice Call Minutes Used',
    callRecordingTime: 'Call Recording Minutes Used',
    transcriptionTime: 'Transcription Minutes Used',

    // Messaging services
    smsSendCount: 'SMS Message Sent',
    smsReceiveCount: 'SMS Message Received',
    mmsSendCount: 'MMS Message Sent',
    mmsReceiveCount: 'MMS Message Received',
    monthlyEmailCount: 'Email Sent',

    // API services
    giaApiCount: 'GIA Gemstone Report Retrieved',
    igiApiCount: 'IGI Gemstone Report Retrieved',

    // Storage
    storage: 'Cloud Storage Space Used',

    // Generic entries
    walletCredit: 'Account Credits Added',
    subscriptionPayment: 'Subscription Renewed',
  };

  // Return the friendly description or default to "Account Credits Added"
  return serviceTypeDescriptions[serviceType] || 'Account Credits Added';
};
