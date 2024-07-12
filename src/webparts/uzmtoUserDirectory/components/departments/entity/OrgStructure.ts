import { Department } from "./Departmen";
import { SubDepartment } from "./SubDepartment";

export class OrgStructure {


    departments: Department[] = [];


    private generateShortName(name: string): string {

      const words = name.replace("Департамент", "").trim().split(' ');
    
      if (words.length === 1) {

        // if only one word, take the first 3 letters
        return words[0].slice(0, 3).toUpperCase();
      }
    
      //if mutliple words, take first letter of first 3 words, capitalize them and combine them

      return words.slice(0, 3).map(word => word.charAt(0).toUpperCase()).join('');

    }
    
  
    public init() {

        this.departments = []
  
      const projectControlDep = new Department("Департамент проектного контроля", "ДПК")
      projectControlDep.subDepartments = [
        new SubDepartment("Отдел планирования и отчетности"),
        new SubDepartment("Отдел документооборота"),
        new SubDepartment("Контрактный отдел")
      ] ;
      this.departments.push(projectControlDep);
  
  
  
      const itDep = new Department("Департамент информационных технологий", "IT")
      itDep.subDepartments = [];
      this.departments.push(itDep);
  
  
      
      const PeronManagmentdep = new Department("Департамент управления персоналом", "HR")
  
      PeronManagmentdep.subDepartments = [
        new SubDepartment("Отдел работы с персоналом"),
        new SubDepartment("Отдел кадрового администрирования"),
        new SubDepartment("Отдел обучения")
      ] ;
      this.departments.push(PeronManagmentdep);
  
  
  
      const Constructiondep = new Department("Департамент строительства", "ДС")
  
      Constructiondep.subDepartments = [
        new SubDepartment("Отдел контроля качества работ и материалов"),
        new SubDepartment("Отдел монтажа оборудования"),
        new SubDepartment("Отдел общестроительных работ, отопления, вентиляции и кондиционирования"),
        new SubDepartment("Отдел электрики, контрольно-измерительных приборов и автоматики"),
        new SubDepartment("Отдел ценообразования"),
        new SubDepartment("Отдел монтажа трубопроводов"),
      ] ;
      this.departments.push(Constructiondep);
  
  
  
      const Auditordep = new Department("Департамент внутреннего аудита, организационного развития и стратегии", "ДВАиОРС", "Департамент внутреннего аудита, организационного развития и стра" )
  
      Auditordep.subDepartments = [
        new SubDepartment("Служба внутреннего аудита"),
        new SubDepartment("Отдел организационного развития и стратегии"),
      ] ;
      this.departments.push(Auditordep);
  
  
  
      const desmanagmentdep = new Department("Департамент управления проектированием", "ДУП")
  
      desmanagmentdep.subDepartments = [
        new SubDepartment("Отдел координации проектирования"),
        new SubDepartment("Отдел Апстрим"),
        new SubDepartment("Отдел Даунстрим"),
        new SubDepartment("Отдел общезаводского хозяйства"),
        new SubDepartment("Отдел инжиниринга"),
        new SubDepartment("Отдел производственной безопасности и экологии"),
      ] ;
      this.departments.push(desmanagmentdep);
  
  
  
      const financecondep = new Department("Департамент экономики и финансов", "ДЭФ")
  
      financecondep.subDepartments = [
        new SubDepartment("Бухгалтерия"),
        new SubDepartment("Планово-экономический отдел"),
        new SubDepartment("Отдел корпоративного финансирования"),
        new SubDepartment("Отдел казначейства"),
      ] ;
      this.departments.push(financecondep);
  
  
  
  
      const admindep = new Department("Административно-хозяйственный департамент", "АХД")
  
      admindep.subDepartments = [
        new SubDepartment("Материально-хозяйственный отдел")
      ] ;
      this.departments.push(admindep);
  
  
  
  
      const ESGdep = new Department("Департамент экологического, социального и корпоративного управления", "ESG", "Департамент экологического, социального и корпоративного управле")
  
      ESGdep.subDepartments = [];
      this.departments.push(ESGdep);
  
  
  
      const legaldep = new Department("Департамент корпоративно-правовой работы", "ДКПР")

      legaldep.subDepartments = [];
      this.departments.push(legaldep);
  
  
  
      const matprocurement = new Department("Департамент закупок оборудования и материалов", "ДЗ")
  
      matprocurement.subDepartments = [];
      this.departments.push(matprocurement);
  
  
  
      const pubrelationsdep = new Department("Департамент связей с общественностью", "PR")
  
      pubrelationsdep.subDepartments = [];
      this.departments.push(pubrelationsdep);
  
  
  
      const secuiritydep = new Department("Департамент безопасности и корпоративного регулирования", "", "Департамент безопасности и корпоративного регулирования")
  
      secuiritydep.subDepartments = [];
      this.departments.push(secuiritydep);
  
  
  
      const laborprotdep = new Department("Департамент охраны труда, промышленной безопасности и охраны окружающей среды", "ОТ, ПБ и ООС" , "Департамент охраны труда, промышленной безопасности и ООС") //, "HSES"
  
      laborprotdep.subDepartments = [];
      this.departments.push(laborprotdep);


      const businessanalytics = new Department("Департамент аналитики и развития бизнеса", "ДРБ") 
  
      laborprotdep.subDepartments = [];
      this.departments.push(businessanalytics);
  
  
  
      const marketdep = new Department( "Департамент маркетинга", "ДМ")
  
      marketdep.subDepartments = [];
      this.departments.push(marketdep);
  
  
  
      const managementdep = new Department("Менеджмент", "")
  
      managementdep.subDepartments = [];
      this.departments.push(managementdep);
  

      this.departments.forEach(department => {
        if (!department.departmentShortName) {
            department.departmentShortName = this.generateShortName(department.departmentName);
        }

        if (department.subDepartments) {
            department.subDepartments.forEach(subDep => {
                // if needed shortnames for subDepartments later
            });
        }
    });
  
    }

  
}



