package com.localfestival.festival.domain.user.dto.request;

import com.localfestival.festival.domain.user.enums.Gender;
import com.localfestival.festival.domain.user.enums.Role;
import lombok.Getter;

@Getter
public class SignupRequestDto {

    private String email;
    private String password;
    private String userName;
    private String gender;
}
