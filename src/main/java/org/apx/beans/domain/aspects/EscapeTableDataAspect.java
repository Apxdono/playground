package org.apx.beans.domain.aspects;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Created by oleg on 5/1/15.
 */
@Aspect
@Component
public class EscapeTableDataAspect {
    Logger logger = LoggerFactory.getLogger(this.getClass());

    @Pointcut("execution(public * org.apx.beans.domain.repo..*.tableData*(..))")
    public void preprocess() {}

    @Around("preprocess()")
    public Object escape(ProceedingJoinPoint pjp) {
        Object[] args = pjp.getArgs();

        if(args != null){
            for(int i = 0; i < args.length; i++){
                Object arg = args[i];
                if(arg != null && arg instanceof String){
                    args[i] = "%" + ((String) arg).replaceAll("\\%","\\\\%").toLowerCase() + "%";
                }
            }
        }

        Object output = null;
        try {
            output = pjp.proceed(args);
        } catch (Throwable e) {
            logger.error(e.getMessage(), e);
        }

        return output;
    }
}
