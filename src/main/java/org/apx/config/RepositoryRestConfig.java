package org.apx.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Profile;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestMvcConfiguration;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.metamodel.ManagedType;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 * Created by oleg on 12.02.2015.
 */
@Configuration
//@Profile({"test","prod"})
@Import(RepositoryRestMvcConfiguration.class)
public class RepositoryRestConfig extends RepositoryRestMvcConfiguration {


    @PersistenceContext
    EntityManager em;

    @Override
    protected void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
        super.configureRepositoryRestConfiguration(config);
            config.setBasePath("/rest/api");
            config.setReturnBodyOnCreate(false).setReturnBodyOnUpdate(false);
            Set<ManagedType<?>> l  = em.getMetamodel().getManagedTypes();
            List<Class<?>> classes = new ArrayList<Class<?>>();
            for (ManagedType<?> type : l) {
                classes.add(type.getJavaType());
            }
            config.exposeIdsFor(classes.toArray(new Class<?>[]{}));
    }


}
