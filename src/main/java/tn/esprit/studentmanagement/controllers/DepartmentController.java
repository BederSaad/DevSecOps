package tn.esprit.studentmanagement.controllers;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.esprit.studentmanagement.dto.DepartmentDTO;
import tn.esprit.studentmanagement.entities.Department;
import tn.esprit.studentmanagement.services.IDepartmentService;

import java.util.List;

/**
 * REST controller for Department CRUD operations.
 *
 * <p>All write endpoints accept a {@link DepartmentDTO} instead of the JPA entity
 * directly, satisfying SonarCloud rule S4684 (persistent entity must not be
 * used as @RequestBody).</p>
 */
@RestController
@RequestMapping({"/Depatment", "/department", "/departments", "/Department"})
@CrossOrigin(origins = "${app.cors.allowed-origins}")
@AllArgsConstructor
public class DepartmentController {

    private final IDepartmentService departmentService;

    @GetMapping("/getAllDepartment")
    public List<Department> getAllDepartment() {
        return departmentService.getAllDepartments();
    }

    @GetMapping("/getDepartment/{id}")
    public Department getDepartment(@PathVariable Long id) {
        return departmentService.getDepartmentById(id);
    }

    @PostMapping("/createDepartment")
    public Department createDepartment(@RequestBody DepartmentDTO dto) {
        Department department = toEntity(dto);
        return departmentService.saveDepartment(department);
    }

    @PutMapping("/updateDepartment")
    public Department updateDepartment(@RequestBody DepartmentDTO dto) {
        Department department = toEntity(dto);
        return departmentService.saveDepartment(department);
    }

    @DeleteMapping("/deleteDepartment/{id}")
    public void deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
    }

    // ------------------------------------------------------------------ //
    // Mapping helper                                                       //
    // ------------------------------------------------------------------ //

    private static Department toEntity(DepartmentDTO dto) {
        Department department = new Department();
        department.setIdDepartment(dto.getIdDepartment());
        department.setName(dto.getName());
        department.setLocation(dto.getLocation());
        department.setPhone(dto.getPhone());
        department.setHead(dto.getHead());
        return department;
    }
}
