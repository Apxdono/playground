package org.apx.domain.model.listeners;

import org.apx.domain.model.BaseEntityWithoutId;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import java.util.Date;

/**
 * Created by oleg on 3/3/15.
 */
public class BaseEntityWithoutIdListener {

    @PrePersist
    public void prePersist(BaseEntityWithoutId entity){
        entity.setCreationDate(new Date());
        entity.setCreatedBy(getUsername());
        entity.setLastUpdatedBy(entity.getCreatedBy());
        entity.setLastUpdateDate(entity.getCreationDate());
        entity.setVersion(0L);
    }

    @PreUpdate
    public void preUpdate(BaseEntityWithoutId entity){
        entity.setLastUpdatedBy(getUsername());
        entity.setLastUpdateDate(new Date());
    }

    public String getUsername(){
        String name = null;
        SecurityContext ctx = SecurityContextHolder.getContext();
        if(ctx.getAuthentication() != null && ctx.getAuthentication().isAuthenticated()){
            name = ctx.getAuthentication().getName();
        }
        return name;
    }
}
