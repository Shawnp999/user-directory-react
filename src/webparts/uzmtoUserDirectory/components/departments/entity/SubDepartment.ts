export interface ISubDepartment {
    
    name: string;
  }
  
  export class SubDepartment implements ISubDepartment {
    name: string;
  
    constructor(name: string) {
      this.name = name;
    }
  }