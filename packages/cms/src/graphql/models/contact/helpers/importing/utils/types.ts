export interface ContactData {
  birthdayDate?: string;
  email?: string;
  fullName?: string;
  jobTitle?: string;
  phoneNumber?: string;
  dateAnniversary?: string;
  uuid?: string;
  leadSource?: string; // enum
  leadOwner?: string; //connection
  customCreationDate?: string; //date
  points?: string; //number
  avatar?: string;
  localId?: string;
  customFields?: { id: string; value: string; name: string }[];
  id?: string;
  [key: string]: any;
}

export interface ContactDataWithErrors extends ContactData {
  errors?: string[];
}
