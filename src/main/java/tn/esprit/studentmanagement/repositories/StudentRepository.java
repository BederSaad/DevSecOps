package tn.esprit.studentmanagement.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.studentmanagement.entities.Student;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    /**
     * Spring Data derived query – safe alternative to native SQL for
     * searching by first name (eliminates SonarCloud S2077).
     */
    List<Student> findByFirstName(String firstName);
}
