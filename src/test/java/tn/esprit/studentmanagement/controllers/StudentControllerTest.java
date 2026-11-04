package tn.esprit.studentmanagement.controllers;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tn.esprit.studentmanagement.dto.StudentDTO;
import tn.esprit.studentmanagement.entities.Department;
import tn.esprit.studentmanagement.entities.Student;
import tn.esprit.studentmanagement.services.IStudentService;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudentControllerTest {

    @Mock
    private IStudentService studentService;

    @InjectMocks
    private StudentController studentController;

    private Student student;
    private StudentDTO studentDTO;

    @BeforeEach
    void setUp() {
        student = new Student();
        student.setIdStudent(1L);
        student.setFirstName("Alice");
        student.setLastName("Wonderland");
        student.setEmail("alice@example.com");

        studentDTO = new StudentDTO();
        studentDTO.setIdStudent(1L);
        studentDTO.setFirstName("Alice");
        studentDTO.setLastName("Wonderland");
        studentDTO.setEmail("alice@example.com");
        studentDTO.setPhone("123456");
        studentDTO.setDateOfBirth(LocalDate.of(2000, 1, 1));
        studentDTO.setAddress("123 Street");
        studentDTO.setDepartmentId(10L);
    }

    @Test
    void testGetAllStudents() {
        when(studentService.getAllStudents()).thenReturn(List.of(student));
        List<Student> result = studentController.getAllStudents();
        assertEquals(1, result.size());
        assertEquals("Alice", result.get(0).getFirstName());
    }

    @Test
    void testGetStudent() {
        when(studentService.getStudentById(1L)).thenReturn(student);
        Student result = studentController.getStudent(1L);
        assertNotNull(result);
        assertEquals(1L, result.getIdStudent());
    }

    @Test
    void testCreateStudentWithDepartment() {
        when(studentService.saveStudent(any(Student.class))).thenReturn(student);
        Student result = studentController.createStudent(studentDTO);
        assertNotNull(result);
        verify(studentService, times(1)).saveStudent(any(Student.class));
    }

    @Test
    void testCreateStudentWithoutDepartment() {
        studentDTO.setDepartmentId(null);
        when(studentService.saveStudent(any(Student.class))).thenReturn(student);
        Student result = studentController.createStudent(studentDTO);
        assertNotNull(result);
        verify(studentService, times(1)).saveStudent(any(Student.class));
    }

    @Test
    void testUpdateStudent() {
        when(studentService.saveStudent(any(Student.class))).thenReturn(student);
        Student result = studentController.updateStudent(studentDTO);
        assertNotNull(result);
        verify(studentService, times(1)).saveStudent(any(Student.class));
    }

    @Test
    void testDeleteStudent() {
        doNothing().when(studentService).deleteStudent(1L);
        studentController.deleteStudent(1L);
        verify(studentService, times(1)).deleteStudent(1L);
    }
}
