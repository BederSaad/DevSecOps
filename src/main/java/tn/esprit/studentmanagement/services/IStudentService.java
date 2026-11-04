package tn.esprit.studentmanagement.services;

import tn.esprit.studentmanagement.entities.Student;

import java.util.List;

/**
 * Student service contract.
 * Interface methods are implicitly public – explicit {@code public} modifier removed
 * (SonarCloud maintainability rule S2333).
 */
public interface IStudentService {
    List<Student> getAllStudents();
    Student getStudentById(Long id);
    Student saveStudent(Student student);
    void deleteStudent(Long id);
}
