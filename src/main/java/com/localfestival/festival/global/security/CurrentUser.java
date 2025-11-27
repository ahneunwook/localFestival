package com.localfestival.festival.global.security;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.PARAMETER) // 메서드의 파라미터에만 붙을 수 있음
@Retention(RetentionPolicy.RUNTIME) // 런타임 시점까지 정보를 유지함
public @interface CurrentUser {
}
