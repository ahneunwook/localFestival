package com.localfestival.festival.global.config;

import com.localfestival.festival.domain.user.repository.UserRepository;
import com.localfestival.festival.global.jwt.JwtAccessDeniedHandler;
import com.localfestival.festival.global.jwt.JwtAuthenticationEntryPoint;
import com.localfestival.festival.global.jwt.JwtFilter;
import com.localfestival.festival.global.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtUtil jwtUtil, UserRepository userRepository) throws Exception {
        http
        		.cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .httpBasic(AbstractHttpConfigurer::disable)
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .logout(AbstractHttpConfigurer::disable)
                .rememberMe(AbstractHttpConfigurer::disable)
                .addFilterBefore(new JwtFilter(jwtUtil, userRepository), UsernamePasswordAuthenticationFilter.class)
                .sessionManagement(manager -> manager.sessionCreationPolicy(STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST,"/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET,"/festivals/**").permitAll()
                        .requestMatchers("/admin/festivals/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/news/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/news/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/news/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/news/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/questions/**").permitAll()
                        .requestMatchers(
                                "/swagger-ui.html",
                                "/swagger-ui/**",
                                "/local-festival/**",
                                "/swagger-resources/**"
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .exceptionHandling(configure -> configure
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint) // 401 처리
                        .accessDeniedHandler(jwtAccessDeniedHandler)); // 403 처리

        return http.build();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("http://localhost:5173");
        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
