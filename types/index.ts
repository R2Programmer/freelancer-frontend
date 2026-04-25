export interface User {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  userId: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status: 'ACTIVE' | 'LEAD' | 'INACTIVE';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  projects?: Project[];
}

export interface Project {
  id: string;
  userId: string;
  clientId: string;
  title: string;
  description?: string;
  status: 'PLANNING' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
  budget?: string;
  startDate?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  client?: { id: string; name: string };
}

export interface DashboardSummary {
  totalClients: number;
  totalProjects: number;
  activeProjects: number;
  recentProjects: Project[];
}

export interface AuthResponse {
  token: string;
  user: Pick<User, 'id' | 'email' | 'fullName'>;
}
