package com.localfestival.festival.global.config;

import com.localfestival.festival.global.security.CurrentUserArgumentResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final CurrentUserArgumentResolver currentUserArgumentResolver;

    // Argument Resolver 목록에 CurrentUserArgumentResolver를 추가
    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(currentUserArgumentResolver);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path path = Paths.get(System.getProperty("user.dir"), "uploads", "reviews").toAbsolutePath();

        //  URI로 변환한 뒤, 마지막 슬래시를 제거합니다.
        String resourceLocation = path.toUri().toString().replaceAll("/$", "");

        // addResourceLocations에 전달할 때는 끝에 슬래시를 한 번만 붙여줍니다. (권장 형식)
        String finalLocation = resourceLocation + "/";

        System.out.println("FINAL RESOURCE LOCATION (MODIFIED): " + finalLocation);

        registry.addResourceHandler("/uploads/reviews/**")
                .addResourceLocations(finalLocation);
    }
}
