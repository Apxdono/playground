package org.apx.config;

import org.springframework.context.annotation.*;
import org.springframework.web.servlet.config.annotation.DefaultServletHandlerConfigurer;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

@EnableWebMvc
@Configuration
@ComponentScan(value = {"org.apx.beans.web"})
public class MvcConfig extends WebMvcConfigurerAdapter {

    static final int CACHE_PERIOD = 3600;
//Year period
//    static final int CACHE_PERIOD = 31556926;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
//        registry.addResourceHandler("app/**").addResourceLocations("/WEB-INF/static/").setCachePeriod(CACHE_PERIOD);
//        registry.addResourceHandler("app/views/**").addResourceLocations("/WEB-INF/static/templates/").setCachePeriod(CACHE_PERIOD);
//        registry.addResourceHandler("app/assets/**").addResourceLocations("classpath:/META-INF/resources/webjars/").setCachePeriod(CACHE_PERIOD);
    }

    @Override
    public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
        configurer.enable();
    }


    @Bean
    public InternalResourceViewResolver jspViewResolver() {
        InternalResourceViewResolver bean = new InternalResourceViewResolver();
        bean.setPrefix("/WEB-INF/static/html/");
        bean.setSuffix(".html");
        return bean;
    }


}