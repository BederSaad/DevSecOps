package tn.esprit.studentmanagement.services;

import tn.esprit.studentmanagement.entities.Enrollment;

import java.util.List;

/**
 * Enrollment service contract.
 * Interface methods are implicitly public – explicit {@code public} modifier removed
 * (SonarCloud maintainability rule S2333).
 */
public interface IEnrollment {
    List<Enrollment> getAllEnrollments();
    Enrollment getEnrollmentById(Long idEnrollment);
    Enrollment saveEnrollment(Enrollment enrollment);
    void deleteEnrollment(Long idEnrollment);
}
