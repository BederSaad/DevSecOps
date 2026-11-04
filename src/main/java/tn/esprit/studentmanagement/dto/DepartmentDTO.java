package tn.esprit.studentmanagement.dto;

/**
 * Data Transfer Object for Department.
 * Accepts plain fields from the client; never exposes the JPA entity directly
 * (fixes SonarCloud rule S4684 – persistent entity used as @RequestBody).
 */
public class DepartmentDTO {

    private Long idDepartment;
    private String name;
    private String location;
    private String phone;
    private String head;

    public DepartmentDTO() {
    }

    public DepartmentDTO(Long idDepartment, String name, String location, String phone, String head) {
        this.idDepartment = idDepartment;
        this.name = name;
        this.location = location;
        this.phone = phone;
        this.head = head;
    }

    public Long getIdDepartment() {
        return idDepartment;
    }

    public void setIdDepartment(Long idDepartment) {
        this.idDepartment = idDepartment;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getHead() {
        return head;
    }

    public void setHead(String head) {
        this.head = head;
    }
}
