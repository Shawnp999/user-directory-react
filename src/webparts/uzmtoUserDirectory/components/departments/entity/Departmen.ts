import { ISubDepartment } from './SubDepartment';

export interface IDepartment {
  departmentName: string;
  departmentShortName: string;
  departmentAAD: string; 
  subDepartments: ISubDepartment[];
}

export class Department implements IDepartment {
  departmentName: string;
  departmentShortName: string;
  departmentAAD: string; 
  subDepartments: ISubDepartment[];

  constructor(departmentName: string, departmentShortName: string, departmentAAD?: string) {
    this.departmentName = departmentName;
    this.departmentShortName = departmentShortName;
    this.departmentAAD = departmentAAD || departmentName; 
    this.subDepartments = [];
  }

  
}

