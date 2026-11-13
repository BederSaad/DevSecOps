package tn.esprit.studentmanagement;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@SpringBootTest(properties = "app.cors.allowed-origins=http://localhost:5173,http://127.0.0.1:5173")
class StudentManagementApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void contextLoads() {
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "/students/getAllStudents",
            "/Depatment/getAllDepartment",
            "/Enrollment/getAllEnrollment"
    })
    void allowsConfiguredFrontendOrigins(String path) throws Exception {
        mockMvc.perform(options(path)
                        .header("Origin", "http://localhost:5173")
                        .header("Access-Control-Request-Method", "GET"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "/students/getAllStudents",
            "/Depatment/getAllDepartment",
            "/Enrollment/getAllEnrollment"
    })
    void rejectsUnconfiguredOrigins(String path) throws Exception {
        mockMvc.perform(options(path)
                        .header("Origin", "https://untrusted.example")
                        .header("Access-Control-Request-Method", "GET"))
                .andExpect(status().isForbidden())
                .andExpect(header().doesNotExist("Access-Control-Allow-Origin"));
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "/students/getAllStudents",
            "/"
    })
    void appliesSecurityHeadersToApiAndNotFoundResponses(String path) throws Exception {
        mockMvc.perform(get(path))
                .andExpect(status().is(path.equals("/") ? 404 : 200))
                .andExpect(header().string("X-Content-Type-Options", "nosniff"))
                .andExpect(header().string(
                        "Content-Security-Policy",
                        "default-src 'self'; frame-ancestors 'none'; object-src 'none'; base-uri 'self'"
                ))
                .andExpect(header().string("Permissions-Policy", "camera=(), microphone=(), geolocation=()"))
                .andExpect(header().string("Cross-Origin-Resource-Policy", "same-origin"))
                .andExpect(header().string("Cache-Control", "no-store"));
    }
}
