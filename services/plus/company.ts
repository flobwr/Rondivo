import * as CompanyData from '@/data/plus/company';

export type { Account, Company } from '@/data/plus/company';

export async function getCompany(): Promise<CompanyData.Company> {
  return { ...CompanyData.COMPANY };
}

export async function updateCompany(patch: Partial<CompanyData.Company>): Promise<CompanyData.Company> {
  CompanyData.updateCompany(patch);
  return { ...CompanyData.COMPANY };
}

export async function getAccount(): Promise<CompanyData.Account> {
  return { ...CompanyData.ACCOUNT };
}

export async function updateAccount(patch: Partial<CompanyData.Account>): Promise<CompanyData.Account> {
  CompanyData.updateAccount(patch);
  return { ...CompanyData.ACCOUNT };
}
