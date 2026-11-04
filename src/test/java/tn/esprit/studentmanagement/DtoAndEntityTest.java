package tn.esprit.studentmanagement;

import org.junit.jupiter.api.Test;
import tn.esprit.studentmanagement.dto.DepartmentDTO;
import tn.esprit.studentmanagement.dto.EnrollmentDTO;
import tn.esprit.studentmanagement.dto.StudentDTO;
import tn.esprit.studentmanagement.entities.*;

import java.time.LocalDate;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;

class DtoAndEntityTest {

    @Test
    void testStudentDtoProperties() {
        StudentDTO dto = new StudentDTO(1L, "John", "Doe", "john@example.com",
                "123", LocalDate.of(1999, 5, 5), "Address", 10L);

        assertEquals(1L, dto.getIdStudent());
        assertEquals("John", dto.getFirstName());
        assertEquals("Doe", dto.getLastName());
        assertEquals("john@example.com", dto.getEmail());
        assertEquals("123", dto.getPhone());
        assertEquals(LocalDate.of(1999, 5, 5), dto.getDateOfBirth());
        assertEquals("Address", dto.getAddress());
        assertEquals(10L, dto.getDepartmentId());

        dto.setIdStudent(2L);
        dto.setFirstName("Jane");
        dto.setLastName("Smith");
        dto.setEmail("jane@example.com");
        dto.setPhone("456");
        dto.setDateOfBirth(LocalDate.of(2001, 1, 1));
        dto.setAddress("New Address");
        dto.setDepartmentId(20L);

        assertEquals(2L, dto.getIdStudent());
        assertEquals("Jane", dto.getFirstName());
    }

    @Test
    void testDepartmentDtoProperties() {
        DepartmentDTO dto = new DepartmentDTO(1L, "Math", "Hall 1", "777", "Prof");

        assertEquals(1L, dto.getIdDepartment());
        assertEquals("Math", dto.getName());
        assertEquals("Hall 1", dto.getLocation());
        assertEquals("777", dto.getPhone());
        assertEquals("Prof", dto.getHead());

        dto.setIdDepartment(2L);
        dto.setName("Physics");
        dto.setLocation("Hall 2");
        dto.setPhone("888");
        dto.setHead("Dean");

        assertEquals(2L, dto.getIdDepartment());
        assertEquals("Physics", dto.getName());
    }

    @Test
    void testEnrollmentDtoProperties() {
        LocalDate date = LocalDate.now();
        EnrollmentDTO dto = new EnrollmentDTO(1L, date, 17.5, Status.ACTIVE, 3L, 4L);

        assertEquals(1L, dto.getIdEnrollment());
        assertEquals(date, dto.getEnrollmentDate());
        assertEquals(17.5, dto.getGrade());
        assertEquals(Status.ACTIVE, dto.getStatus());
        assertEquals(3L, dto.getStudentId());
        assertEquals(4L, dto.getCourseId());

        dto.setIdEnrollment(2L);
        dto.setGrade(19.0);
        dto.setStatus(Status.COMPLETED);
        dto.setStudentId(5L);
        dto.setCourseId(6L);
        dto.setEnrollmentDate(date.plusDays(1));

        assertEquals(2L, dto.getIdEnrollment());
        assertEquals(19.0, dto.getGrade());
    }

    @Test
    void testEntities() {
        Department dept = new Department(1L, "Bio", "Bld 3", "999", "Head", new ArrayList<>());
        assertEquals(1L, dept.getIdDepartment());
        assertNotNull(dept.toString());

        Course course = new Course(1L, "CS", "CS101", 3, "Intro", new ArrayList<>());
        assertEquals(1L, course.getIdCourse());
        assertEquals("CS101", course.getCode());
        assertEquals(3, course.getCredit());
        assertEquals("Intro", course.getDescription());
        assertNotNull(course.toString());

        Student student = new Student(1L, "A", "B", "a@b.com", "111", LocalDate.now(), "Addr", dept, new ArrayList<>());
        assertEquals(1L, student.getIdStudent());
        assertEquals("A", student.getFirstName());
        assertEquals(dept, student.getDepartment());
        assertNotNull(student.toString());

        Enrollment enrollment = new Enrollment(1L, LocalDate.now(), 14.0, Status.DROPPED, student, course);
        assertEquals(1L, enrollment.getIdEnrollment());
        assertEquals(Status.DROPPED, enrollment.getStatus());
        assertEquals(student, enrollment.getStudent());
        assertEquals(course, enrollment.getCourse());
        assertNotNull(enrollment.toString());
    }
}
