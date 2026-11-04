package tn.esprit.studentmanagement.services;

import org.springframework.stereotype.Service;
import tn.esprit.studentmanagement.entities.Enrollment;
import tn.esprit.studentmanagement.repositories.EnrollmentRepository;

import java.util.List;
import java.util.NoSuchElementException;

/**
 * Service implementation for Enrollment operations.
 *
 * <p>Uses constructor injection and replaces bare {@code Optional.get()} with
 * {@code orElseThrow} (fixes SonarCloud reliability bugs S3655 / S2259).</p>
 */
@Service
public class EnrollmentService implements IEnrollment {

    private final EnrollmentRepository enrollmentRepository;

    public EnrollmentService(EnrollmentRepository enrollmentRepository) {
        this.enrollmentRepository = enrollmentRepository;
    }

    @Override
    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }

    /**
     * @throws NoSuchElementException if no enrollment exists with the given id.
     */
    @Override
    public Enrollment getEnrollmentById(Long idEnrollment) {
        return enrollmentRepository.findById(idEnrollment)
                .orElseThrow(() -> new NoSuchElementException(
                        "Enrollment not found: " + idEnrollment));
    }

    @Override
    public Enrollment saveEnrollment(Enrollment enrollment) {
        return enrollmentRepository.save(enrollment);
    }

    @Override
    public void deleteEnrollment(Long idEnrollment) {
        enrollmentRepository.deleteById(idEnrollment);
    }
}
