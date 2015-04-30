package org.apx.beans;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

/**
 * Created by oleg on 02.04.2015.
 */
@Component
@Scope
public class ApplicationContextHolder {

    @Autowired
    ApplicationContext ctx;

    public static ApplicationContext context(){
        return instance().ctx;
    }

    public static ApplicationContextHolder instance(){
        return SingletonHolder.instance;
    }


    protected ApplicationContextHolder(){
        SingletonHolder.instance = this;
        System.out.println("Context found");
    }

    protected static class SingletonHolder{
        static ApplicationContextHolder instance;
    }



}
