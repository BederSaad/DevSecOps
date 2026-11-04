package tn.esprit.studentmanagement.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tn.esprit.studentmanagement.entities.Department;
import tn.esprit.studentmanagement.repositories.DepartmentRepository;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DepartmentServiceTest {

    @Mock
    private DepartmentRepository departmentRepository;

    @InjectMocks
    private DepartmentService departmentService;

    private Department department;

    @BeforeEach
    void setUp() {
        department = new Department();
        department.setIdDepartment(1L);
        department.setName("Computer Science");
        department.setLocation("Building A");
        department.setHead("Dr. Smith");
    }

    @Test
    void testGetAllDepartments() {
        when(departmentRepository.findAll()).thenReturn(List.of(department));
        List<Department> result = departmentService.getAllDepartments();
        assertEquals(1, result.size());
        assertEquals("Computer Science", result.get(0).getName());
    }

    @Test
    void testGetDepartmentByIdFound() {
        when(departmentRepository.findById(1L)).thenReturn(Optional.of(department));
        Department result = departmentService.getDepartmentById(1L);
        assertNotNull(result);
        assertEquals(1L, result.getIdDepartment());
    }

    @Test
    void testGetDepartmentByIdNotFound() {
        when(departmentRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(NoSuchElementException.class, () -> departmentService.getDepartmentById(99L));
    }

    @Test
    void testSaveDepartment() {
        when(departmentRepository.save(any(Department.class))).thenReturn(department);
        Department result = departmentService.saveDepartment(department);
        assertNotNull(result);
        assertEquals("Computer Science", result.getName());
    }

    @Test
    void testDeleteDepartment() {
        doNothing().when(departmentRepository).deleteById(1L);
        departmentService.deleteDepartment(1L);
        verify(departmentRepository, times(1)).deleteById(1L);
    }
}
