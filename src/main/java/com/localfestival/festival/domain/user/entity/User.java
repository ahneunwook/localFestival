package com.localfestival.festival.domain.user.entity;

import com.localfestival.festival.domain.user.dto.request.SignupRequestDto;
import com.localfestival.festival.domain.user.enums.Gender;
import com.localfestival.festival.domain.user.enums.Role;
import com.localfestival.festival.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;

import static com.localfestival.festival.domain.user.enums.Role.USER;

@Table(name = "users")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Getter
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "email", nullable = false, unique = true, length = 30)
    private String email;

    @Column(name = "password", nullable = false, length = 100)
    private String password;

    @Column(name = "user_name", nullable = false, length = 10)
    private String userName;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role = USER;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false)
    private Gender gender;

    @Builder
    private User(String email, String password, String userName, Role role, Gender gender){
        this.email = email;
        this.password = password;
        this.userName = userName;
        this.role = role;
        this.gender = gender;
    }

    public static User createUser(SignupRequestDto signupRequestDto, PasswordEncoder encoder){
        return User.builder()
                .email(signupRequestDto.getEmail())
                .password(encoder.encode(signupRequestDto.getPassword()))
                .userName(signupRequestDto.getUserName())
                .role(Role.USER)
                .gender(Gender.from(signupRequestDto.getGender()))
                .build();
    }

}
