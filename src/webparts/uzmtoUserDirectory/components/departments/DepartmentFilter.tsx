import * as React from 'react';
import { OrgStructure } from './entity/OrgStructure';
import { Department } from './entity/Departmen';
import styles from './DepartmentFilter.module.scss';

interface IDepartmentFilterProps {
  orgStructure: OrgStructure;
  selectedDepartment: Department | null;
  changeDepartmentMethod: (selectedDepartment: Department) => void;
 // onDepartmentChange: () => void;
}

const DepartmentFilter: React.FunctionComponent<IDepartmentFilterProps> = (props: IDepartmentFilterProps) => {
  
  const handleDepartmentClick = (departmentAAD: any) => {
    const selectedDepartment = props.orgStructure.departments.find(
      (department) => department.departmentAAD === departmentAAD
    );

    if (!selectedDepartment) {
      console.error('No AAD dep found:', departmentAAD);
      return;
    }

   
    props.changeDepartmentMethod(selectedDepartment); //reset search input callback
    
  };

  return (
    <div>
      <div className={styles.departmentrow}>
        {props.orgStructure.departments.map((department, index) => (
          <div
            key={index}
            onClick={() => handleDepartmentClick(department.departmentAAD)}
            className={styles.departmentButton + ' ' + (props.selectedDepartment?.departmentAAD === department.departmentAAD ? styles.selectedDep : '') } 
            
          >
            <span className={styles.tooltip} data-tooltip={department.departmentName}>
              {department.departmentShortName}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DepartmentFilter;


  {/* 
        {selectedDepartment && (
          <div className={styles.departmentrow}>
            {selectedDepartment.subDepartments.map((subDep) => (
              <div key={subDep.name} className={styles.subdepbtns}>
                {subDep.name}
              </div>
            ))}
          </div>
        )} 
        */}