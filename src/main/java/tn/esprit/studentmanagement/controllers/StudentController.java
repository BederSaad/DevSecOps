package tn.esprit.studentmanagement.controllers;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.esprit.studentmanagement.dto.StudentDTO;
import tn.esprit.studentmanagement.entities.Department;
import tn.esprit.studentmanagement.entities.Student;
import tn.esprit.studentmanagement.services.IStudentService;

import java.util.List;

/**
 * REST controller for Student CRUD operations.
 *
 * <p>All write endpoints accept a {@link StudentDTO} instead of the JPA entity
 * directly, satisfying SonarCloud rule S4684 (persistent entity must not be
 * used as @RequestBody).</p>
 */
@RestController
@RequestMapping("/students")
@CrossOrigin(origins = "http://localhost:4200")
@AllArgsConstructor
public class StudentController {

    private final IStudentService studentService;
    
    
    @GetMapping("/getAllStudents")
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    @GetMapping("/getStudent/{id}")
    public Student getStudent(@PathVariable Long id) {
        return studentService.getStudentById(id);
    }

    @PostMapping("/createStudent")
    public Student createStudent(@RequestBody StudentDTO dto) {
        Student student = toEntity(dto);
        return studentService.saveStudent(student);
    }

    @PutMapping("/updateStudent")
    public Student updateStudent(@RequestBody StudentDTO dto) {
        Student student = toEntity(dto);
        return studentService.saveStudent(student);
    }

    @DeleteMapping("/deleteStudent/{id}")
    public void deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
    }

    // ------------------------------------------------------------------ //
    // Mapping helper (kept in controller to avoid a separate mapper class) //
    // ------------------------------------------------------------------ //

    private static Student toEntity(StudentDTO dto) {
        Student student = new Student();
        student.setIdStudent(dto.getIdStudent());
        student.setFirstName(dto.getFirstName());
        student.setLastName(dto.getLastName());
        student.setEmail(dto.getEmail());
        student.setPhone(dto.getPhone());
        student.setDateOfBirth(dto.getDateOfBirth());
        student.setAddress(dto.getAddress());
        if (dto.getDepartmentId() != null) {
            Department dept = new Department();
            dept.setIdDepartment(dto.getDepartmentId());
            student.setDepartment(dept);
        }
        return student;
    }
}
