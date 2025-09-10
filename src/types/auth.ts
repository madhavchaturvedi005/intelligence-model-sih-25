export interface User {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  loginType: LoginType;
  status: 'active' | 'inactive';
  lastLogin?: Date;
  createdAt: Date;
}

export type LoginType = 'admin' | 'staff';

export type UserRole = 'Station Controller' | 'Procurement Officer' | 'Rolling Stock Engineer' | 'Safety Officer' | 'Field Technician';

export interface LoginCredentials {
  employeeId: string;
  password: string;
}

export interface SignupData {
  employeeId: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  department: string;
  loginType: LoginType;
}

export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}
