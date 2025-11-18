package com.localfestival.festival.global.jwt;

import com.localfestival.festival.domain.user.enums.Role;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.security.Principal;
import java.util.Collection;
import java.util.List;

@Getter
public class CustomUserPrincipal implements UserDetails, Principal {

    private final Long id;
    private final String userName;
    private final Role userRole;

    public CustomUserPrincipal(Long id, String userName, Role role){
        this.id = id;
        this.userName = userName;
        this.userRole = role;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(() -> getUserRole().name());
    }

    @Override
    public String getPassword() {
        return null;
    }

    @Override
    public String getUsername() {
        return this.userName;
    }

    @Override
    public String getName() {
        return this.userName;
    }
}
