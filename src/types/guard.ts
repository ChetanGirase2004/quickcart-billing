export interface Guard {
  uid: string;
  guardId: string;
  name: string;
  email?: string;
  phone?: string;
  role: 'guard';
  createdAt: Date;
  status: 'active';
}

export interface GuardRegistrationData {
  name: string;
  email?: string;
  phone?: string;
  password?: string;
}