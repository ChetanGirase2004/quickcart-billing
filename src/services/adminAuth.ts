import { Admin, AdminFormData } from '@/types/admin';

const ADMIN_STORAGE_KEY = 'quickcart_admin_account';
const ADMIN_SESSION_KEY = 'quickcart_admin_session';

interface StoredAdminAccount {
  uid: string;
  mallName: string;
  adminName: string;
  email: string;
  phone: string;
  password: string;
  role: 'admin';
  createdAt: string;
}

interface StoredAdminSession {
  uid: string;
}

const toAdmin = (storedAdmin: StoredAdminAccount): Admin => ({
  uid: storedAdmin.uid,
  mallName: storedAdmin.mallName,
  adminName: storedAdmin.adminName,
  email: storedAdmin.email,
  phone: storedAdmin.phone,
  role: storedAdmin.role,
  createdAt: new Date(storedAdmin.createdAt)
});

const getStoredAdmin = (): StoredAdminAccount | null => {
  const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as StoredAdminAccount;
  } catch (error) {
    console.error('Failed to parse stored admin account:', error);
    return null;
  }
};

const notifyAuthChange = () => {
  window.dispatchEvent(new Event('quickcart-auth-changed'));
};

const setAdminSession = (uid: string) => {
  const session: StoredAdminSession = { uid };
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
  notifyAuthChange();
};

export const hasRegisteredAdmin = (): boolean => Boolean(getStoredAdmin());

export const registerAdmin = async (data: AdminFormData): Promise<{ success: boolean; error?: string }> => {
  const existingAdmin = getStoredAdmin();
  if (existingAdmin) {
    return { success: false, error: 'An admin account already exists. Please sign in.' };
  }

  const newAdmin: StoredAdminAccount = {
    uid: `admin-${Date.now()}`,
    mallName: data.mallName.trim(),
    adminName: data.adminName.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim(),
    password: data.password,
    role: 'admin',
    createdAt: new Date().toISOString()
  };

  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(newAdmin));
  setAdminSession(newAdmin.uid);

  return { success: true };
};

export const loginAdmin = async (
  email: string,
  password: string
): Promise<{
  success: boolean;
  error?: string;
  isAdmin?: boolean;
  adminData?: Admin;
}> => {
  const storedAdmin = getStoredAdmin();

  if (!storedAdmin) {
    return {
      success: false,
      error: 'No admin account found. Please register first.'
    };
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (storedAdmin.email !== normalizedEmail || storedAdmin.password !== password) {
    return {
      success: false,
      error: 'Invalid credentials. Please check your email and password.'
    };
  }

  setAdminSession(storedAdmin.uid);

  return {
    success: true,
    isAdmin: true,
    adminData: toAdmin(storedAdmin)
  };
};

export const logoutAdmin = async (): Promise<void> => {
  localStorage.removeItem(ADMIN_SESSION_KEY);
  notifyAuthChange();
};

export const checkAdminStatus = async (uid: string): Promise<{
  isAdmin: boolean;
  adminData?: Admin;
}> => {
  const storedAdmin = getStoredAdmin();
  if (!storedAdmin || storedAdmin.uid !== uid || storedAdmin.role !== 'admin') {
    return { isAdmin: false };
  }

  return {
    isAdmin: true,
    adminData: toAdmin(storedAdmin)
  };
};

export const getCurrentAdminSession = (): Admin | null => {
  const storedSession = localStorage.getItem(ADMIN_SESSION_KEY);
  if (!storedSession) {
    return null;
  }

  let parsedSession: StoredAdminSession;

  try {
    parsedSession = JSON.parse(storedSession) as StoredAdminSession;
  } catch (error) {
    console.error('Failed to parse admin session:', error);
    return null;
  }

  const storedAdmin = getStoredAdmin();
  if (!storedAdmin || storedAdmin.uid !== parsedSession.uid) {
    return null;
  }

  return toAdmin(storedAdmin);
};
