// src/main/java/br/com/mathmaster/backend/config/security/filter/JwtAuthFilter.java
package br.com.mathmaster.backend.config.security.filter;

import br.com.mathmaster.backend.config.security.JpaUserDetailsService; // Importa nosso serviço de detalhes do usuário
import br.com.mathmaster.backend.util.JwtUtil; // Importa nosso utilitário JWT
import jakarta.servlet.FilterChain; // Parte da API de Servlets para encadear filtros
import jakarta.servlet.ServletException; // Exceção de Servlet
import jakarta.servlet.http.HttpServletRequest; // Objeto de requisição HTTP
import jakarta.servlet.http.HttpServletResponse; // Objeto de resposta HTTP
import org.springframework.beans.factory.annotation.Autowired; // Anotação para injeção de dependência
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken; // Para criar o token de autenticação no contexto
import org.springframework.security.core.context.SecurityContextHolder; // Para manipular o contexto de segurança
import org.springframework.security.core.userdetails.UserDetails; // Interface para detalhes do usuário
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource; // Para definir detalhes da autenticação web
import org.springframework.stereotype.Component; // Marca a classe como um componente Spring
import org.springframework.web.filter.OncePerRequestFilter; // Garante que o filtro seja executado uma vez por requisição

import java.io.IOException; // Exceção de I/O

@Component // Marca esta classe como um componente Spring, para que ele possa ser injetado em SecurityConfig
public class JwtAuthFilter extends OncePerRequestFilter { // Garante que o filtro roda apenas uma vez por requisição

    @Autowired // Injeta nosso utilitário JWT
    private JwtUtil jwtUtil;

    @Autowired // Injeta nosso serviço para carregar detalhes do usuário
    private JpaUserDetailsService userDetailsService;

    /**
     * Este método é o coração do filtro. Ele é executado para cada requisição HTTP.
     * @param request Requisição HTTP de entrada.
     * @param response Resposta HTTP de saída.
     * @param filterChain Cadeia de filtros. Usado para passar a requisição para o próximo filtro ou para o controlador.
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Extrai o cabeçalho "Authorization":
        // Os tokens JWT são geralmente enviados no cabeçalho Authorization, prefixados por "Bearer ".
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // 2. Verifica se o cabeçalho existe e começa com "Bearer ":
        // Se não existir ou não for um token Bearer, passamos para o próximo filtro na cadeia.
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return; // Interrompe a execução aqui para esta requisição, não há JWT para processar.
        }

        // 3. Extrai o token JWT (removendo o prefixo "Bearer "):
        jwt = authHeader.substring(7); // "Bearer ".length() é 7.

        // 4. Extrai o nome de usuário (email) do token:
        userEmail = jwtUtil.extractUsername(jwt); // Usa nosso JwtUtil

        // 5. Verifica se o nome de usuário foi extraído e se o usuário AINDA NÃO ESTÁ AUTENTICADO:
        // SecurityContextHolder.getContext().getAuthentication() == null significa que o usuário não está autenticado nesta requisição.
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // 6. Carrega os detalhes do usuário do banco de dados:
            // Usamos o JpaUserDetailsService para obter o UserDetails completo.
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            // 7. Valida o token JWT:
            // Verifica se o token é válido para o userDetails carregado (não expirou e corresponde ao usuário).
            if (jwtUtil.validateToken(jwt, userDetails)) { // Usa nosso JwtUtil
                // 8. Cria um objeto de autenticação para o Spring Security:
                // Se o token é válido, criamos um UsernamePasswordAuthenticationToken.
                // Passamos userDetails, null (senha já foi verificada pelo JWT) e as autoridades (roles).
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                // Adiciona detalhes da requisição (como IP do cliente) à autenticação.
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 9. Define o objeto de autenticação no SecurityContextHolder:
                // Isso informa ao Spring Security que o usuário está autenticado para o restante da requisição.
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // 10. Passa a requisição para o próximo filtro na cadeia do Spring Security ou para o controlador:
        filterChain.doFilter(request, response);
    }
}