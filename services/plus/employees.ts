import * as EmployeesData from '@/data/plus/employees';

export type { Employee, EmployeeInput, EmployeeRole, EmployeeStatus } from '@/data/plus/employees';
export { EMPLOYEE_ROLE_META, EMPLOYEE_ROLE_ORDER, EMPLOYEE_STATUS_META } from '@/data/plus/employees';

export async function listEmployees(): Promise<EmployeesData.Employee[]> {
  return [...EmployeesData.EMPLOYEES];
}

export async function getEmployee(id: string): Promise<EmployeesData.Employee | undefined> {
  return EmployeesData.getEmployeeById(id);
}

export async function createEmployee(input: EmployeesData.EmployeeInput): Promise<EmployeesData.Employee> {
  return EmployeesData.createEmployee(input);
}

export async function updateEmployee(
  id: string,
  patch: Partial<EmployeesData.EmployeeInput>
): Promise<EmployeesData.Employee | undefined> {
  return EmployeesData.updateEmployee(id, patch);
}

export async function deleteEmployee(id: string): Promise<void> {
  EmployeesData.deleteEmployee(id);
}

export async function getActiveEmployeesCount(): Promise<number> {
  return EmployeesData.activeEmployeesCount();
}
