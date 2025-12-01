package com.localfestival.festival.domain.question.dto.response;

import com.localfestival.festival.domain.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileResponse {
    private Long id;
    private String userName;
    private String email;

    public static UserProfileResponse from(User user){
        return UserProfileResponse.builder()
                .id(user.getId())
                .userName(user.getUserName())
                .email(user.getEmail())
                .build();
    }
}
