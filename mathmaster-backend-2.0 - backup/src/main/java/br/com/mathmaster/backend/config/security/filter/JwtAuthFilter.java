// src/main/java/br/com/mathmaster/backend/config/security/filter/JwtAuthFilter.java
package br.com.mathmaster.backend.config.security.filter;

import br.com.mathmaster.backend.config.security.JpaUserDetailsService;
import br.com.mathmaster.backend.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays; // NOVO IMPORT
import java.util.List;   // NOVO IMPORT

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private JpaUserDetailsService userDetailsService;

    // Lista de URLs que DEVEM ser ignoradas pelo filtro JWT
    // Estas são as rotas publicadas no SecurityConfig.permitAll()
    private static final List<String> PUBLIC_URLS = Arrays.asList(
            "/api/auth/register",
            "/api/auth/login",
            "/hello"
            // Adicione outras URLs públicas aqui conforme necessário
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String requestUri = request.getRequestURI();

        // 1. Verifica se a URL da requisição é uma URL pública (permitAll)
        // Se for, o filtro JWT não precisa processá-la, ela deve passar livremente.
        if (PUBLIC_URLS.contains(requestUri)) {
            filterChain.doFilter(request, response);
            return; // Sai do filtro para esta requisição, não tenta validar JWT.
        }

        // 2. Extrai o cabeçalho "Authorization" (o restante da lógica do filtro)
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
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

        filterChain.doFilter(request, response);
    }
}