package org.apx.config;

import org.springframework.context.annotation.*;
import org.springframework.core.convert.ConversionService;
import org.springframework.format.support.FormattingConversionService;

/**
 * Created by oleg on 20.04.2015.
 */
@Configuration
//@Profile({"test","prod"})
@Import({JpaConfig.class, RepositoryRestConfig.class})
@EnableAspectJAutoProxy
@ComponentScan("org.apx.beans;org.apx.config")
public class ApplicationConfig {

    //Required by spring mvc. It's missing in newer version for some odd reason
    @Bean(name = "mvcConversionService")
    public ConversionService mvcConversionService(){
        return new FormattingConversionService();
    }
}
