package tn.esprit.studentmanagement.controllers;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.esprit.studentmanagement.dto.EnrollmentDTO;
import tn.esprit.studentmanagement.entities.Course;
import tn.esprit.studentmanagement.entities.Enrollment;
import tn.esprit.studentmanagement.entities.Student;
import tn.esprit.studentmanagement.services.IEnrollment;

import java.util.List;

/**
 * REST controller for Enrollment CRUD operations.
 *
 * <p>All write endpoints accept an {@link EnrollmentDTO} instead of the JPA entity
 * directly, satisfying SonarCloud rule S4684 (persistent entity must not be
 * used as @RequestBody).</p>
 */
@RestController
@RequestMapping({"/Enrollment", "/enrollment", "/enrollments", "/Enrollments"})
@CrossOrigin(origins = "${app.cors.allowed-origins}")
@AllArgsConstructor
public class EnrollmentController {

    private final IEnrollment enrollmentService;

    @GetMapping("/getAllEnrollment")
    public List<Enrollment> getAllEnrollment() {
        return enrollmentService.getAllEnrollments();
    }

    @GetMapping("/getEnrollment/{id}")
    public Enrollment getEnrollment(@PathVariable Long id) {
        return enrollmentService.getEnrollmentById(id);
    }

    @PostMapping("/createEnrollment")
    public Enrollment createEnrollment(@RequestBody EnrollmentDTO dto) {
        Enrollment enrollment = toEntity(dto);
        return enrollmentService.saveEnrollment(enrollment);
    }

    @PutMapping("/updateEnrollment")
    public Enrollment updateEnrollment(@RequestBody EnrollmentDTO dto) {
        Enrollment enrollment = toEntity(dto);
        return enrollmentService.saveEnrollment(enrollment);
    }

    @DeleteMapping("/deleteEnrollment/{id}")
    public void deleteEnrollment(@PathVariable Long id) {
        enrollmentService.deleteEnrollment(id);
    }

    // ------------------------------------------------------------------ //
    // Mapping helper                                                       //
    // ------------------------------------------------------------------ //

    private static Enrollment toEntity(EnrollmentDTO dto) {
        Enrollment enrollment = new Enrollment();
        enrollment.setIdEnrollment(dto.getIdEnrollment());
        enrollment.setEnrollmentDate(dto.getEnrollmentDate());
        enrollment.setGrade(dto.getGrade());
        enrollment.setStatus(dto.getStatus());
        if (dto.getStudentId() != null) {
            Student student = new Student();
            student.setIdStudent(dto.getStudentId());
            enrollment.setStudent(student);
        }
        if (dto.getCourseId() != null) {
            Course course = new Course();
            course.setIdCourse(dto.getCourseId());
            enrollment.setCourse(course);
        }
        return enrollment;
    }
}
