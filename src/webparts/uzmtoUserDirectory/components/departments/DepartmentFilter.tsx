import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { OrgStructure } from './entity/OrgStructure';
import { Department } from './entity/Departmen';
import styles from './DepartmentFilter.module.scss';
import * as strings from 'UzmtoUserDirectoryWebPartStrings';
import { Tooltip, OverlayTrigger } from 'react-bootstrap'; 

interface IDepartmentFilterProps {
    orgStructure: OrgStructure;
    selectedDepartment: Department | null;
    changeDepartmentMethod: (selectedDepartment: Department) => void;
}

const DepartmentFilter: React.FunctionComponent<IDepartmentFilterProps> = (props: IDepartmentFilterProps) => {
    const [isMobileView, setIsMobileView] = useState<boolean>(window.innerWidth < 900);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const departmentRefs = useRef<Array<HTMLDivElement | null>>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const touchStartXRef = useRef<number>(0);

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 900);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (props.selectedDepartment) {
            const index = props.orgStructure.departments.findIndex(
                department => department.departmentAAD === props.selectedDepartment!.departmentAAD
            );
            if (index !== -1 && departmentRefs.current[index]) {
                departmentRefs.current[index]?.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: isMobileView ? 'nearest' : 'center', 
                    inline: 'center' 
                });
            }
        }
    }, [props.selectedDepartment, isMobileView, props.orgStructure.departments]);

    const handleDepartmentClick = (departmentAAD: string) => {
        if (isDragging) return;
        
        const selectedDepartment = props.orgStructure.departments.find(
            (department) => department.departmentAAD === departmentAAD
        );

        if (!selectedDepartment) {
            console.error('No AAD dep found:', departmentAAD);
            return;
        }

        props.changeDepartmentMethod(selectedDepartment);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - containerRef.current.offsetLeft);
        setScrollLeft(containerRef.current.scrollLeft);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !containerRef.current) return;
        e.preventDefault();
        const x = e.pageX - containerRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        containerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (!containerRef.current) return;
        touchStartXRef.current = e.touches[0].clientX;
        setIsDragging(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging || !containerRef.current) return;
        const touchCurrentX = e.touches[0].clientX;
        const walk = touchStartXRef.current - touchCurrentX;
        containerRef.current.scrollLeft += walk;
        touchStartXRef.current = touchCurrentX;
        e.preventDefault(); 
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        setTimeout(() => setIsDragging(false), 100);
    };

    const renderTooltip = (departmentName: string) => (
        <Tooltip id="tooltip-department" className="tooltipCustom">
            {departmentName}
        </Tooltip>
    );

    const departmentItems = props.orgStructure.departments
    .filter((department, index) => index === 0) 
    .map((department, index) => (
        <OverlayTrigger
            key={index}
            placement="top"
            overlay={renderTooltip(department.departmentName)} 
            show
        >
            <div
                ref={el => departmentRefs.current[index] = el}
                onClick={() => handleDepartmentClick(department.departmentAAD)}
                className={`${isMobileView ? styles.departmentButtonMobile : styles.departmentButton} 
                    ${props.selectedDepartment?.departmentAAD === department.departmentAAD ? styles.selectedDep : ''}`}
            >
                {department.departmentShortName}
            </div>
        </OverlayTrigger>
    ));

    return (
        <div className={styles.filterContainer}>
            <div 
                ref={containerRef}
                className={isMobileView ? styles.departmentRowMobile : styles.departmentrow}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchMove={handleTouchMove}
            >
                {departmentItems}
            </div>

            {isMobileView && (
                <div className={styles.selectedDepartmentName}>
                    {props.selectedDepartment 
                        ? props.selectedDepartment.departmentName 
                        : strings.noDepFound}
                </div>
            )}
        </div>
    );
};

export default DepartmentFilter;
