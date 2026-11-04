package tn.esprit.studentmanagement.services;

import tn.esprit.studentmanagement.entities.Department;

import java.util.List;

/**
 * Department service contract.
 * Interface methods are implicitly public – explicit {@code public} modifier removed
 * (SonarCloud maintainability rule S2333).
 */
public interface IDepartmentService {
    List<Department> getAllDepartments();
    Department getDepartmentById(Long idDepartment);
    Department saveDepartment(Department department);
    void deleteDepartment(Long idDepartment);
}
