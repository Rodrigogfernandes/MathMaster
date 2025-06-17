package br.com.mathmaster.backend.config;

import br.com.mathmaster.backend.config.security.JpaUserDetailsService;
import br.com.mathmaster.backend.config.security.filter.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod; // Importa HttpMethod
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JpaUserDetailsService jpaUserDetailsService;
    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JpaUserDetailsService jpaUserDetailsService, JwtAuthFilter jwtAuthFilter) {
        this.jpaUserDetailsService = jpaUserDetailsService;
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // Permite requisições de pré-voo (OPTIONS) para qualquer URL
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Endpoints de autenticação (registro, login): Acesso público
                        .requestMatchers("/api/auth/**").permitAll()

                        // Endpoints de visualização para usuários comuns (GETs)
                        // Qualquer usuário autenticado pode ver sua informação de perfil
                        .requestMatchers(HttpMethod.GET, "/api/users/me").authenticated() //
                        // Qualquer usuário autenticado pode ver a lista de módulos (Matérias)
                        .requestMatchers(HttpMethod.GET, "/api/modules").authenticated() //
                        // Qualquer usuário autenticado pode ver uma matéria específica
                        .requestMatchers(HttpMethod.GET, "/api/modules/{id}").authenticated() //
                        // Qualquer usuário autenticado pode ver os conteúdos de uma matéria
                        .requestMatchers(HttpMethod.GET, "/api/modules/{subjectId}/contents").authenticated() //
                        // Qualquer usuário autenticado pode ver um conteúdo específico
                        .requestMatchers(HttpMethod.GET, "/api/modules/{subjectId}/contents/{id}").authenticated() //
                        // Qualquer usuário autenticado pode ver as questões de um conteúdo
                        .requestMatchers(HttpMethod.GET, "/api/contents/{contentId}/questions").authenticated() //
                        // Qualquer usuário autenticado pode ver uma questão específica
                        .requestMatchers(HttpMethod.GET, "/api/contents/{contentId}/questions/{questionId}").authenticated() //
                        // Qualquer usuário autenticado pode ver a lista de conquistas
                        .requestMatchers(HttpMethod.GET, "/api/achievements").authenticated() //
                        // Qualquer usuário autenticado pode ver uma conquista específica
                        .requestMatchers(HttpMethod.GET, "/api/achievements/{id}").authenticated() //
                        // Qualquer usuário autenticado pode ver o leaderboard
                        .requestMatchers(HttpMethod.GET, "/api/users").authenticated() // Para /api/users e /api/users/leaderboard (que é GET)
                        .requestMatchers(HttpMethod.GET, "/api/users/leaderboard").authenticated() //


                        // === APIs de ADMIN (CRUD - Modificação) ===
                        // Página do painel administrativo e seus assets: Apenas ADMIN pode acessar
                        .requestMatchers("/admin.html", "/css/admin.css", "/js/admin.js").hasRole("ADMIN") //
                        // Operações de MODIFICAÇÃO (POST, PUT, DELETE) para TODAS as entidades: Apenas ADMIN pode acessar
                        .requestMatchers(HttpMethod.POST, "/api/modules/**", "/api/contents/**", "/api/questions/**", "/api/achievements/**").hasRole("ADMIN") //
                        .requestMatchers(HttpMethod.PUT, "/api/modules/**", "/api/contents/**", "/api/questions/**", "/api/achievements/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/modules/**", "/api/contents/**", "/api/questions/**", "/api/achievements/**").hasRole("ADMIN")
                        // Para update/delete de usuários específicos (se implementado)
                        .requestMatchers(HttpMethod.PUT, "/api/users/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/users/{id}").hasRole("ADMIN")


                        // Todas as outras requisições que não caíram em nenhuma regra acima
                        // (qualquer GET não listado acima, ou qualquer POST/PUT/DELETE para rotas não admin)
                        // DEVEM ser autenticadas por qualquer usuário. Isso é um catch-all.
                        .anyRequest().authenticated()
                )
                // Define a API como stateless
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                // Registra nosso provedor de autenticação
                .authenticationProvider(authenticationProvider())
                // Adiciona nosso filtro JWT antes do filtro padrão de autenticação
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(jpaUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(
                "http://localhost:5000",
                "http://127.0.0.1:5000",
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                "http://localhost:63342", // Porta do frontend do Rodrigo
                "http://127.0.0.1:63342"
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(List.of("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}