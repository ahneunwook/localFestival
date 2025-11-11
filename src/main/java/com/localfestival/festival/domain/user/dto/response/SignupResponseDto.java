package com.localfestival.festival.domain.user.dto.response;

import com.localfestival.festival.domain.user.entity.User;
import com.localfestival.festival.domain.user.enums.Gender;
import com.localfestival.festival.domain.user.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignupResponseDto {

    private Long id;
    private String email;
    private String userName;
    private Role role;
    private Gender gender;
    private LocalDateTime createdAt;

    public static SignupResponseDto toDto(User user){
        return SignupResponseDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .userName(user.getUserName())
                .role(user.getRole())
                .gender(user.getGender())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
