package tn.esprit.studentmanagement.controllers;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tn.esprit.studentmanagement.dto.EnrollmentDTO;
import tn.esprit.studentmanagement.entities.Enrollment;
import tn.esprit.studentmanagement.entities.Status;
import tn.esprit.studentmanagement.services.IEnrollment;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EnrollmentControllerTest {

    @Mock
    private IEnrollment enrollmentService;

    @InjectMocks
    private EnrollmentController enrollmentController;

    private Enrollment enrollment;
    private EnrollmentDTO enrollmentDTO;

    @BeforeEach
    void setUp() {
        enrollment = new Enrollment();
        enrollment.setIdEnrollment(1L);
        enrollment.setStatus(Status.ACTIVE);

        enrollmentDTO = new EnrollmentDTO(1L, LocalDate.now(), 18.0, Status.ACTIVE, 5L, 10L);
    }

    @Test
    void testGetAllEnrollment() {
        when(enrollmentService.getAllEnrollments()).thenReturn(List.of(enrollment));
        List<Enrollment> result = enrollmentController.getAllEnrollment();
        assertEquals(1, result.size());
    }

    @Test
    void testGetEnrollment() {
        when(enrollmentService.getEnrollmentById(1L)).thenReturn(enrollment);
        Enrollment result = enrollmentController.getEnrollment(1L);
        assertNotNull(result);
        assertEquals(1L, result.getIdEnrollment());
    }

    @Test
    void testCreateEnrollmentWithStudentAndCourse() {
        when(enrollmentService.saveEnrollment(any(Enrollment.class))).thenReturn(enrollment);
        Enrollment result = enrollmentController.createEnrollment(enrollmentDTO);
        assertNotNull(result);
        verify(enrollmentService, times(1)).saveEnrollment(any(Enrollment.class));
    }

    @Test
    void testCreateEnrollmentWithoutStudentAndCourse() {
        enrollmentDTO.setStudentId(null);
        enrollmentDTO.setCourseId(null);
        when(enrollmentService.saveEnrollment(any(Enrollment.class))).thenReturn(enrollment);
        Enrollment result = enrollmentController.createEnrollment(enrollmentDTO);
        assertNotNull(result);
        verify(enrollmentService, times(1)).saveEnrollment(any(Enrollment.class));
    }

    @Test
    void testUpdateEnrollment() {
        when(enrollmentService.saveEnrollment(any(Enrollment.class))).thenReturn(enrollment);
        Enrollment result = enrollmentController.updateEnrollment(enrollmentDTO);
        assertNotNull(result);
        verify(enrollmentService, times(1)).saveEnrollment(any(Enrollment.class));
    }

    @Test
    void testDeleteEnrollment() {
        doNothing().when(enrollmentService).deleteEnrollment(1L);
        enrollmentController.deleteEnrollment(1L);
        verify(enrollmentService, times(1)).deleteEnrollment(1L);
    }
}
