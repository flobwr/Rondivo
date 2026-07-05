import { type Tint } from '@/components/clients/types';
import { computeInitials, tintForName } from '@/data/clients';

export type EmployeeRole = 'administrateur' | 'manager' | 'technicien';
export type EmployeeStatus = 'actif' | 'inactif';

export type Employee = {
  id: string;
  name: string;
  initials: string;
  tint: Tint;
  poste: string;
  role: EmployeeRole;
  phone: string;
  email: string;
  hireDate: string; // ISO
  status: EmployeeStatus;
};

export const EMPLOYEE_ROLE_META: Record<EmployeeRole, { label: string; description: string }> = {
  administrateur: { label: 'Administrateur', description: 'Accès complet : facturation, paramètres et équipe.' },
  manager: { label: 'Manager', description: 'Gère les devis, factures et le planning.' },
  technicien: { label: 'Technicien', description: 'Accède à son planning et à ses interventions.' },
};

export const EMPLOYEE_ROLE_ORDER: EmployeeRole[] = ['administrateur', 'manager', 'technicien'];

export const EMPLOYEE_STATUS_META: Record<EmployeeStatus, { label: string; color: string; soft: string }> = {
  actif: { label: 'Actif', color: '#10B981', soft: '#E4F6EE' },
  inactif: { label: 'Inactif', color: '#9AA3AF', soft: '#EEF0F3' },
};

export const EMPLOYEES: Employee[] = [
  {
    id: '1',
    name: 'Lucas Bernard',
    initials: 'LB',
    tint: 'orange',
    poste: 'Plombier',
    role: 'manager',
    phone: '06 22 33 44 55',
    email: 'lucas.bernard@martin-chauffage.fr',
    hireDate: '2021-03-01',
    status: 'actif',
  },
  {
    id: '2',
    name: 'Sarah Petit',
    initials: 'SP',
    tint: 'purple',
    poste: 'Électricienne',
    role: 'technicien',
    phone: '06 33 44 55 66',
    email: 'sarah.petit@martin-chauffage.fr',
    hireDate: '2022-09-15',
    status: 'actif',
  },
  {
    id: '3',
    name: 'Karim Haddad',
    initials: 'KH',
    tint: 'green',
    poste: 'Chauffagiste',
    role: 'technicien',
    phone: '06 44 55 66 77',
    email: 'karim.haddad@martin-chauffage.fr',
    hireDate: '2023-06-01',
    status: 'actif',
  },
  {
    id: '4',
    name: 'Julie Fabre',
    initials: 'JF',
    tint: 'blue',
    poste: 'Assistante administrative',
    role: 'administrateur',
    phone: '06 55 66 77 88',
    email: 'julie.fabre@martin-chauffage.fr',
    hireDate: '2020-01-10',
    status: 'inactif',
  },
];

export function getEmployeeById(id: string): Employee | undefined {
  return EMPLOYEES.find((e) => e.id === id);
}

export function activeEmployeesCount(): number {
  return EMPLOYEES.filter((e) => e.status === 'actif').length;
}

function nextEmployeeId(): string {
  const maxId = EMPLOYEES.reduce((max, e) => Math.max(max, Number(e.id) || 0), 0);
  return String(maxId + 1);
}

export type EmployeeInput = {
  name: string;
  poste: string;
  role: EmployeeRole;
  phone: string;
  email: string;
  hireDate: string;
  status: EmployeeStatus;
};

export function createEmployee(input: EmployeeInput): Employee {
  const name = input.name.trim();
  const employee: Employee = {
    id: nextEmployeeId(),
    name,
    initials: computeInitials(name),
    tint: tintForName(name),
    poste: input.poste.trim(),
    role: input.role,
    phone: input.phone.trim(),
    email: input.email.trim(),
    hireDate: input.hireDate,
    status: input.status,
  };
  EMPLOYEES.unshift(employee);
  return employee;
}

export function updateEmployee(id: string, patch: Partial<EmployeeInput>): Employee | undefined {
  const employee = getEmployeeById(id);
  if (!employee) return undefined;
  Object.assign(employee, patch);
  if (patch.name) {
    employee.initials = computeInitials(patch.name);
    employee.tint = tintForName(patch.name);
  }
  return employee;
}

export function deleteEmployee(id: string) {
  const index = EMPLOYEES.findIndex((e) => e.id === id);
  if (index !== -1) EMPLOYEES.splice(index, 1);
}
