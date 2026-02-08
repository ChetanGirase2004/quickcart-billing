import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  UserCredential 
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { db, doc, setDoc, getDoc } from '@/lib/firestore';
import { Admin, AdminFormData } from '@/types/admin';

export const registerAdmin = async (data: AdminFormData): Promise<{ success: boolean; error?: string }> => {
  try {
    // Create user with email and password
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth, 
      data.email, 
      data.password
    );
    
    const user = userCredential.user;
    
    // Save admin data to Firestore
    const adminData: Omit<Admin, 'createdAt'> = {
      uid: user.uid,
      mallName: data.mallName,
      adminName: data.adminName,
      email: data.email,
      phone: data.phone,
      role: 'admin'
    };
    
    await setDoc(doc(db, 'admins', user.uid), {
      ...adminData,
      createdAt: new Date()
    });
    
    return { success: true };
  } catch (error: any) {
    console.error('Error registering admin:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to register admin' 
    };
  }
};

export const loginAdmin = async (email: string, password: string): Promise<{ 
  success: boolean; 
  error?: string; 
  isAdmin?: boolean;
  adminData?: Admin 
}> => {
  try {
    // Sign in with email and password
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth, 
      email, 
      password
    );
    
    const user = userCredential.user;
    
    // Check if user is admin by fetching from Firestore
    const adminDoc = await getDoc(doc(db, 'admins', user.uid));
    
    if (!adminDoc.exists()) {
      return { 
        success: false, 
        error: 'User is not an admin', 
        isAdmin: false 
      };
    }
    
    const adminData = {
      uid: user.uid,
      ...adminDoc.data()
    } as Admin;
    
    if (adminData.role !== 'admin') {
      return { 
        success: false, 
        error: 'User is not an admin', 
        isAdmin: false 
      };
    }
    
    return { 
      success: true, 
      isAdmin: true, 
      adminData 
    };
  } catch (error: any) {
    console.error('Error logging in admin:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to login' 
    };
  }
};

export const checkAdminStatus = async (uid: string): Promise<{
  isAdmin: boolean;
  adminData?: Admin;
}> => {
  try {
    const adminDoc = await getDoc(doc(db, 'admins', uid));
    
    if (!adminDoc.exists()) {
      return { isAdmin: false };
    }
    
    const adminData = {
      uid,
      ...adminDoc.data()
    } as Admin;
    
    return { 
      isAdmin: adminData.role === 'admin', 
      adminData: adminData.role === 'admin' ? adminData : undefined 
    };
  } catch (error) {
    console.error('Error checking admin status:', error);
    return { isAdmin: false };
  }
};