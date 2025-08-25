export interface Vendor {
  id: string;
  name: string;
  location: string;
  contact_email: string;
  created_at: string;
  updated_at: string;
}

export type CreateVendorInput = Omit<Vendor, 'id' | 'created_at' | 'updated_at'>;
export type UpdateVendorInput = Partial<CreateVendorInput>;
