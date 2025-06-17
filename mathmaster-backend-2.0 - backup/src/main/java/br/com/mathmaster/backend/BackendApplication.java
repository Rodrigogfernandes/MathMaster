package br.com.mathmaster.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.boot.CommandLineRunner;

@SpringBootApplication
@RestController
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@GetMapping("/hello")
	public String sayHello() {
		return "Olá, a autenticação com o banco de dados funcionou!";
	}

	/*@Bean
	public CommandLineRunner commandLineRunner(PasswordEncoder encoder) {
		return args -> {
			System.out.println("==================================================================");
			System.out.println("SENHAS CRIPTOGRAFADAS PARA O data.sql:");
			System.out.println("Senha 'adminpass': " + encoder.encode("adminpass"));
			System.out.println("Senha 'userpass':  " + encoder.encode("userpass"));
			System.out.println("==================================================================");
		};*/


}