import * as React from 'react';
import {useState, useEffect} from 'react';
import {OrgStructure} from './entity/OrgStructure';
import {Department} from './entity/Departmen';
import styles from './DepartmentFilter.module.scss';
import * as strings from 'UzmtoUserDirectoryWebPartStrings';

interface IDepartmentFilterProps {
    orgStructure: OrgStructure;
    selectedDepartment: Department | null;
    changeDepartmentMethod: (selectedDepartment: Department) => void;
}

const DepartmentFilter: React.FunctionComponent<IDepartmentFilterProps> = (props: IDepartmentFilterProps) => {
    const [isMobileView, setIsMobileView] = useState<boolean>(window.innerWidth < 900);

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 900);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleDepartmentClick = (departmentAAD: any) => {
        const selectedDepartment = props.orgStructure.departments.find(
            (department) => department.departmentAAD === departmentAAD
        );

        if (!selectedDepartment) {
            console.error('No AAD dep found:', departmentAAD);
            return;
        }

        props.changeDepartmentMethod(selectedDepartment);
    };

    if (isMobileView) {
        return (
            <div>
                <div className={styles.departmentRowMobile}>
                    {props.orgStructure.departments.map((department, index) => (
                        <div
                            key={index}
                            onClick={() => handleDepartmentClick(department.departmentAAD)}
                            className={styles.departmentButtonMobile + ' ' + (props.selectedDepartment?.departmentAAD === department.departmentAAD ? styles.selectedDep : '')}
                        >
                            <span className={styles.tooltip} data-tooltip={department.departmentName}>
                              {department.departmentShortName}
                            </span>
                        </div>
                    ))}
                </div>
                <div className={styles.selectedDepartmentName}>
                    {props.selectedDepartment ? props.selectedDepartment.departmentName : strings.noDepFound}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.departmentrow}>
            {props.orgStructure.departments.map((department, index) => (
                <div
                    key={index}
                    onClick={() => handleDepartmentClick(department.departmentAAD)}
                    className={styles.departmentButton + ' ' + (props.selectedDepartment?.departmentAAD === department.departmentAAD ? styles.selectedDep : '')}
                >
          <span className={styles.tooltip} data-tooltip={department.departmentName}>
            {department.departmentShortName}
          </span>
                </div>
            ))}
        </div>
    );
}

export default DepartmentFilter;
