package tn.esprit.studentmanagement.controllers;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.studentmanagement.entities.Student;
import tn.esprit.studentmanagement.services.IStudentService;

import javax.crypto.Cipher;
import java.io.FileInputStream;
import java.util.List;

@RestController
@RequestMapping("/students")
@CrossOrigin(origins = "http://localhost:4200")
@AllArgsConstructor
public class StudentController {
IStudentService studentService;

    @GetMapping("/getAllStudents")
    public List<Student> getAllStudents() { return studentService.getAllStudents(); }

    @GetMapping("/getStudent/{id}")
    public Student getStudent(@PathVariable Long id) { return studentService.getStudentById(id); }

    // BAD PRACTICE 1 (vulnerability): weak cipher algorithm and ECB mode
    @GetMapping("/demo/crypto")
    public String weakCrypto() throws Exception {
        Cipher des = Cipher.getInstance("DES");
        Cipher ecb = Cipher.getInstance("AES/ECB/PKCS5Padding");
        return des.getAlgorithm() + " " + ecb.getAlgorithm();
    }

    // BAD PRACTICE 2 (bug): null pointer dereference
    @GetMapping("/demo/null")
    public int nullBug() {
        String value = null;
        return value.length();
    }

    // BAD PRACTICE 3 (bug): division by zero
    @GetMapping("/demo/divide")
    public int divideBug() {
        int zero = 0;
        return 10 / zero;
    }

    // BAD PRACTICE 4 (bug): resource leak, stream never closed
    @GetMapping("/demo/leak")
    public int leakBug() throws Exception {
        FileInputStream in = new FileInputStream("/tmp/demo.txt");
        return in.read();
    }

    @PostMapping("/createStudent")
    public Student createStudent(@RequestBody Student student) { return studentService.saveStudent(student); }

    @PutMapping("/updateStudent")
    public Student updateStudent(@RequestBody Student student) {
        return studentService.saveStudent(student);
    }

    @DeleteMapping("/deleteStudent/{id}")
    public void deleteStudent(@PathVariable Long id) { studentService.deleteStudent(id); }
}