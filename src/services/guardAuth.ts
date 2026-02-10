import { Guard, GuardRegistrationData } from '@/types/guard';

const GUARD_STORAGE_KEY = 'quickcart_guard_records';
const USER_SESSION_KEY = 'quickcart_user_session';

interface StoredGuard extends Omit<Guard, 'createdAt'> {
  createdAt: string;
  otp: string;
}

interface AppSessionUser {
  uid: string;
  role: 'customer' | 'guard';
  displayName?: string;
  phoneNumber?: string;
}

const defaultGuards: StoredGuard[] = [
  {
    uid: 'guard-001',
    guardId: 'GUARD-DEMO-001',
    name: 'Gate Officer',
    phone: '+911234567890',
    role: 'guard',
    status: 'active',
    createdAt: new Date('2024-01-01').toISOString(),
    otp: '123456'
  }
];

const readGuards = (): StoredGuard[] => {
  const raw = localStorage.getItem(GUARD_STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(GUARD_STORAGE_KEY, JSON.stringify(defaultGuards));
    return defaultGuards;
  }

  try {
    const parsed = JSON.parse(raw) as StoredGuard[];
    return parsed.length > 0 ? parsed : defaultGuards;
  } catch (error) {
    console.error('Failed to parse guard records:', error);
    localStorage.setItem(GUARD_STORAGE_KEY, JSON.stringify(defaultGuards));
    return defaultGuards;
  }
};

const notifyAuthChange = () => {
  window.dispatchEvent(new Event('quickcart-auth-changed'));
};

const writeSession = (session: AppSessionUser) => {
  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(session));
  notifyAuthChange();
};

export const clearUserSession = async (): Promise<void> => {
  localStorage.removeItem(USER_SESSION_KEY);
  notifyAuthChange();
};

export const getCurrentUserSession = (): AppSessionUser | null => {
  const raw = localStorage.getItem(USER_SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AppSessionUser;
  } catch (error) {
    console.error('Failed to parse user session:', error);
    return null;
  }
};

export const generateGuardId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 5);
  return `GUARD-${timestamp}-${random}`.toUpperCase();
};

export const isGuardIdUnique = async (guardId: string): Promise<boolean> => {
  const guards = readGuards();
  return !guards.some((guard) => guard.guardId === guardId.trim().toUpperCase());
};

export const generateUniqueGuardId = async (): Promise<string> => {
  let attempts = 0;
  while (attempts < 5) {
    const guardId = generateGuardId();
    const unique = await isGuardIdUnique(guardId);
    if (unique) {
      return guardId;
    }
    attempts += 1;
  }

  throw new Error('Unable to generate unique guard ID after maximum attempts');
};

const mapGuard = (guard: StoredGuard): Guard => ({
  ...guard,
  createdAt: new Date(guard.createdAt)
});

export const getGuardById = async (guardId: string): Promise<Guard | null> => {
  const guards = readGuards();
  const normalizedId = guardId.trim().toUpperCase();
  const guard = guards.find((item) => item.guardId === normalizedId);
  return guard ? mapGuard(guard) : null;
};

export const registerGuardWithEmail = async (
  data: GuardRegistrationData,
  _password: string
): Promise<{ success: boolean; error?: string; user?: { uid: string } }> => {
  const guards = readGuards();
  const guardId = await generateUniqueGuardId();

  const newGuard: StoredGuard = {
    uid: `guard-${Date.now()}`,
    guardId,
    name: data.name,
    email: data.email,
    phone: data.phone,
    role: 'guard',
    status: 'active',
    createdAt: new Date().toISOString(),
    otp: '123456'
  };

  localStorage.setItem(GUARD_STORAGE_KEY, JSON.stringify([...guards, newGuard]));
  return { success: true, user: { uid: newGuard.uid } };
};

export const registerGuardWithPhone = async (_data: GuardRegistrationData): Promise<{ success: boolean; error?: string }> => ({ success: true });

export const completePhoneRegistration = async (_user: { uid: string }, _data: GuardRegistrationData): Promise<{ success: boolean; error?: string }> => ({ success: true });

export const loginGuard = async (
  identifier: string,
  password?: string
): Promise<{
  success: boolean;
  error?: string;
  isGuard?: boolean;
  guardData?: Guard;
}> => {
  const guard = await getGuardById(identifier);
  if (!guard) {
    return { success: false, error: 'Guard ID not found', isGuard: false };
  }

  if (!password || password !== '123456') {
    return { success: false, error: 'Invalid OTP', isGuard: false };
  }

  writeSession({
    uid: guard.uid,
    role: 'guard',
    displayName: guard.name,
    phoneNumber: guard.phone
  });

  return { success: true, isGuard: true, guardData: guard };
};

export const checkGuardStatus = async (uid: string): Promise<{ isGuard: boolean; guardData?: Guard }> => {
  const guards = readGuards();
  const guard = guards.find((item) => item.uid === uid && item.role === 'guard');

  if (!guard) {
    return { isGuard: false };
  }

  return { isGuard: true, guardData: mapGuard(guard) };
};

export const loginCustomerSession = async (phoneNumber: string): Promise<void> => {
  writeSession({
    uid: `customer-${Date.now()}`,
    role: 'customer',
    phoneNumber,
    displayName: 'Customer'
  });
};
