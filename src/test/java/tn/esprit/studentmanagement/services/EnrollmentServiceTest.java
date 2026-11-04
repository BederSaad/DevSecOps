package tn.esprit.studentmanagement.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tn.esprit.studentmanagement.entities.Enrollment;
import tn.esprit.studentmanagement.entities.Status;
import tn.esprit.studentmanagement.repositories.EnrollmentRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EnrollmentServiceTest {

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @InjectMocks
    private EnrollmentService enrollmentService;

    private Enrollment enrollment;

    @BeforeEach
    void setUp() {
        enrollment = new Enrollment();
        enrollment.setIdEnrollment(1L);
        enrollment.setEnrollmentDate(LocalDate.now());
        enrollment.setGrade(15.5);
        enrollment.setStatus(Status.ACTIVE);
    }

    @Test
    void testGetAllEnrollments() {
        when(enrollmentRepository.findAll()).thenReturn(List.of(enrollment));
        List<Enrollment> result = enrollmentService.getAllEnrollments();
        assertEquals(1, result.size());
        assertEquals(15.5, result.get(0).getGrade());
    }

    @Test
    void testGetEnrollmentByIdFound() {
        when(enrollmentRepository.findById(1L)).thenReturn(Optional.of(enrollment));
        Enrollment result = enrollmentService.getEnrollmentById(1L);
        assertNotNull(result);
        assertEquals(1L, result.getIdEnrollment());
    }

    @Test
    void testGetEnrollmentByIdNotFound() {
        when(enrollmentRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(NoSuchElementException.class, () -> enrollmentService.getEnrollmentById(99L));
    }

    @Test
    void testSaveEnrollment() {
        when(enrollmentRepository.save(any(Enrollment.class))).thenReturn(enrollment);
        Enrollment result = enrollmentService.saveEnrollment(enrollment);
        assertNotNull(result);
        assertEquals(Status.ACTIVE, result.getStatus());
    }

    @Test
    void testDeleteEnrollment() {
        doNothing().when(enrollmentRepository).deleteById(1L);
        enrollmentService.deleteEnrollment(1L);
        verify(enrollmentRepository, times(1)).deleteById(1L);
    }
}
