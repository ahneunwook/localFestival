package com.localfestival.festival.global.jwt;

import com.localfestival.festival.domain.user.entity.User;
import com.localfestival.festival.domain.user.enums.Role;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.security.Principal;
import java.util.Collection;
import java.util.List;

@Getter
public class CustomUserPrincipal implements UserDetails, Principal {

    private final User user;
    private final Long id;
    private final String userName;
    private final Role userRole;

    public CustomUserPrincipal(User user){
        this.user = user;
        this.id = user.getId();
        this.userName = user.getUserName();
        this.userRole = user.getRole();
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
