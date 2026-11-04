package tn.esprit.studentmanagement.services;

import org.springframework.stereotype.Service;
import tn.esprit.studentmanagement.entities.Department;
import tn.esprit.studentmanagement.repositories.DepartmentRepository;

import java.util.List;
import java.util.NoSuchElementException;

/**
 * Service implementation for Department operations.
 *
 * <p>Uses constructor injection (no {@code @Autowired} field injection) and
 * replaces bare {@code Optional.get()} with {@code orElseThrow} to avoid a
 * potential {@link NoSuchElementException} without a meaningful message
 * (fixes SonarCloud reliability bugs S3655 / S2259).</p>
 */
@Service
public class DepartmentService implements IDepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    @Override
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    /**
     * @throws NoSuchElementException if no department exists with the given id.
     */
    @Override
    public Department getDepartmentById(Long idDepartment) {
        return departmentRepository.findById(idDepartment)
                .orElseThrow(() -> new NoSuchElementException(
                        "Department not found: " + idDepartment));
    }

    @Override
    public Department saveDepartment(Department department) {
        return departmentRepository.save(department);
    }

    @Override
    public void deleteDepartment(Long idDepartment) {
        departmentRepository.deleteById(idDepartment);
    }
}
