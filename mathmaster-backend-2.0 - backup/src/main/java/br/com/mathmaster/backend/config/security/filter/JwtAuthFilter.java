// src/main/java/br/com/mathmaster/backend/config/security/filter/JwtAuthFilter.java
package br.com.mathmaster.backend.config.security.filter;

import br.com.mathmaster.backend.config.security.JpaUserDetailsService;
import br.com.mathmaster.backend.util.JwtUtil;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
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
        String userEmail = null;

        // 2. Verifica se o cabeçalho existe e começa com "Bearer ":
        // Se não existir ou não for um token Bearer, passamos para o próximo filtro na cadeia.
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return; // Interrompe a execução aqui para esta requisição, não há JWT para processar.
        }

        final String jwt = authHeader.substring(7);

        try {
            userEmail = jwtUtil.extractUsername(jwt);

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

                if (jwtUtil.validateToken(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (JwtException e) {
            // Token inválido, expirado ou malformado: não define autenticação e segue a cadeia (requisição não autenticada)
        }

        filterChain.doFilter(request, response);
    }
}