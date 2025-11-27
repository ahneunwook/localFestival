package com.localfestival.festival.global.security;

import com.localfestival.festival.domain.user.entity.User;
import com.localfestival.festival.global.exception.CustomException;
import com.localfestival.festival.global.exception.ErrorCode;
import com.localfestival.festival.global.jwt.CustomUserPrincipal;
import org.springframework.core.MethodParameter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

@Component
public class CurrentUserArgumentResolver implements HandlerMethodArgumentResolver {

    /**
     * 현재 메서드 인수가 이 Resolver가 처리할 수 있는 타입인지 확인합니다.
     * 인수에 @CurrentUser가 붙어 있고, 타입이 User.class라면 true 반환
     */
    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        // 인수에 @CurrentUser 어노테이션이 붙어 있는지 확인
        boolean hasCurrentUserAnnotation = parameter.hasParameterAnnotation(CurrentUser.class);

        // 인수의 타입이 User 엔티티 타입인지 확인
        boolean isUserType = User.class.isAssignableFrom(parameter.getParameterType());

        return hasCurrentUserAnnotation && isUserType;
    }

    /**
     * 실제 인수에 주입할 객체를 반환합니다.
     */
    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {

        // SecurityContextHolder에서 Authentication 객체 가져오기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // 인증 객체가 null이거나 인증되지 않았다면 예외 처리
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal() instanceof String){

            // "anonymousUser" 등이 principal인 경우
            throw new CustomException(ErrorCode.USER_NOT_FOUND);
        }

        // Principal 객체(여기서는 CustomUserDetails)를 가져옵니다.
        Object principal = authentication.getPrincipal();

        if (principal instanceof CustomUserPrincipal) {
            //DB 조회 없이, CustomUserPrincipal 객체에 저장된 ID를 바로 반환
            return ((CustomUserPrincipal) principal).getUser();
        }

        throw new CustomException(ErrorCode.USER_NOT_FOUND);
    }
}
