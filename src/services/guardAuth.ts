import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { db, doc, setDoc, getDoc, query, where, getDocs, collection } from '@/lib/guardFirestore';
import { Guard, GuardRegistrationData } from '@/types/guard';

// Generate unique guard ID
export const generateGuardId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `GUARD-${timestamp}-${random}`.toUpperCase();
};

// Check if guard ID is unique
export const isGuardIdUnique = async (guardId: string): Promise<boolean> => {
  try {
    const q = query(collection(db, 'guards'), where('guardId', '==', guardId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  } catch (error) {
    console.error('Error checking guard ID uniqueness:', error);
    return false;
  }
};

// Generate unique guard ID (retry if not unique)
export const generateUniqueGuardId = async (): Promise<string> => {
  let guardId: string;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 5;

  do {
    guardId = generateGuardId();
    isUnique = await isGuardIdUnique(guardId);
    attempts++;
  } while (!isUnique && attempts < maxAttempts);

  if (!isUnique) {
    throw new Error('Unable to generate unique guard ID after maximum attempts');
  }

  return guardId;
};

// Register guard with email/password
export const registerGuardWithEmail = async (
  data: GuardRegistrationData,
  password: string
): Promise<{ success: boolean; error?: string; user?: any }> => {
  try {
    if (!data.email) {
      return { success: false, error: 'Email is required for email registration' };
    }

    // Create user with email and password
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      password
    );

    const user = userCredential.user;

    // Generate unique guard ID
    const guardId = await generateUniqueGuardId();

    // Save guard data to Firestore
    const guardData: Omit<Guard, 'createdAt'> = {
      uid: user.uid,
      guardId,
      name: data.name,
      email: data.email,
      role: 'guard',
      status: 'active'
    };

    await setDoc(doc(db, 'guards', user.uid), {
      ...guardData,
      createdAt: new Date()
    });

    return { success: true, user };
  } catch (error: any) {
    console.error('Error registering guard with email:', error);
    return {
      success: false,
      error: error.message || 'Failed to register guard'
    };
  }
};

// Register guard with phone number
export const registerGuardWithPhone = async (
  data: GuardRegistrationData
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!data.phone) {
      return { success: false, error: 'Phone number is required for phone registration' };
    }

    // For phone registration, we'll return a confirmation result
    // The actual guard creation will happen after OTP verification
    
    // Note: In a real implementation, you would use signInWithPhoneNumber here
    // and handle the OTP verification flow
    
    return {
      success: true
    };
  } catch (error: any) {
    console.error('Error initiating phone registration:', error);
    return {
      success: false,
      error: error.message || 'Failed to initiate phone registration'
    };
  }
};

// Complete phone registration after OTP verification
export const completePhoneRegistration = async (
  user: any, // Firebase user object after OTP verification
  data: GuardRegistrationData
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Generate unique guard ID
    const guardId = await generateUniqueGuardId();

    // Save guard data to Firestore
    const guardData: Omit<Guard, 'createdAt'> = {
      uid: user.uid,
      guardId,
      name: data.name,
      phone: data.phone,
      role: 'guard',
      status: 'active'
    };

    await setDoc(doc(db, 'guards', user.uid), {
      ...guardData,
      createdAt: new Date()
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error completing phone registration:', error);
    return {
      success: false,
      error: error.message || 'Failed to complete phone registration'
    };
  }
};

// Login guard
export const loginGuard = async (
  identifier: string, // email or phone number
  password?: string
): Promise<{
  success: boolean;
  error?: string;
  isGuard?: boolean;
  guardData?: Guard;
}> => {
  try {
    let userCredential: UserCredential;

    // Determine if identifier is email or phone
    if (identifier.includes('@')) {
      // Email login
      if (!password) {
        return { success: false, error: 'Password is required for email login' };
      }
      userCredential = await signInWithEmailAndPassword(auth, identifier, password);
    } else {
      // Phone login would require OTP flow
      // For simplicity in this implementation, we're assuming email/password
      return { success: false, error: 'Phone login requires OTP verification' };
    }

    const user = userCredential.user;

    // Check if user is guard by fetching from Firestore
    const guardDoc = await getDoc(doc(db, 'guards', user.uid));

    if (!guardDoc.exists()) {
      return {
        success: false,
        error: 'User is not registered as a guard',
        isGuard: false
      };
    }

    const guardData = {
      uid: user.uid,
      ...guardDoc.data()
    } as Guard;

    if (guardData.role !== 'guard') {
      return {
        success: false,
        error: 'User is not a guard',
        isGuard: false
      };
    }

    return {
      success: true,
      isGuard: true,
      guardData
    };
  } catch (error: any) {
    console.error('Error logging in guard:', error);
    return {
      success: false,
      error: error.message || 'Failed to login'
    };
  }
};

// Check guard status
export const checkGuardStatus = async (uid: string): Promise<{
  isGuard: boolean;
  guardData?: Guard;
}> => {
  try {
    const guardDoc = await getDoc(doc(db, 'guards', uid));

    if (!guardDoc.exists()) {
      return { isGuard: false };
    }

    const guardData = {
      uid,
      ...guardDoc.data()
    } as Guard;

    return {
      isGuard: guardData.role === 'guard',
      guardData: guardData.role === 'guard' ? guardData : undefined
    };
  } catch (error) {
    console.error('Error checking guard status:', error);
    return { isGuard: false };
  }
};