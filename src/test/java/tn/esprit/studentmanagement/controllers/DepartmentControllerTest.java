package tn.esprit.studentmanagement.controllers;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tn.esprit.studentmanagement.dto.DepartmentDTO;
import tn.esprit.studentmanagement.entities.Department;
import tn.esprit.studentmanagement.services.IDepartmentService;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DepartmentControllerTest {

    @Mock
    private IDepartmentService departmentService;

    @InjectMocks
    private DepartmentController departmentController;

    private Department department;
    private DepartmentDTO departmentDTO;

    @BeforeEach
    void setUp() {
        department = new Department();
        department.setIdDepartment(1L);
        department.setName("Finance");

        departmentDTO = new DepartmentDTO(1L, "Finance", "Block B", "987654", "Prof. Charles");
    }

    @Test
    void testGetAllDepartment() {
        when(departmentService.getAllDepartments()).thenReturn(List.of(department));
        List<Department> result = departmentController.getAllDepartment();
        assertEquals(1, result.size());
        assertEquals("Finance", result.get(0).getName());
    }

    @Test
    void testGetDepartment() {
        when(departmentService.getDepartmentById(1L)).thenReturn(department);
        Department result = departmentController.getDepartment(1L);
        assertNotNull(result);
        assertEquals(1L, result.getIdDepartment());
    }

    @Test
    void testCreateDepartment() {
        when(departmentService.saveDepartment(any(Department.class))).thenReturn(department);
        Department result = departmentController.createDepartment(departmentDTO);
        assertNotNull(result);
        verify(departmentService, times(1)).saveDepartment(any(Department.class));
    }

    @Test
    void testUpdateDepartment() {
        when(departmentService.saveDepartment(any(Department.class))).thenReturn(department);
        Department result = departmentController.updateDepartment(departmentDTO);
        assertNotNull(result);
        verify(departmentService, times(1)).saveDepartment(any(Department.class));
    }

    @Test
    void testDeleteDepartment() {
        doNothing().when(departmentService).deleteDepartment(1L);
        departmentController.deleteDepartment(1L);
        verify(departmentService, times(1)).deleteDepartment(1L);
    }
}
