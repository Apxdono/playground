package org.apx.beans.domain.repo;

import org.apx.domain.model.IEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;

import java.io.Serializable;

/**
 * Created by oleg on 21.04.2015.
 */
@NoRepositoryBean
public interface BaseCrudRepository<T extends IEntity, ID extends Serializable> extends PagingAndSortingRepository<T,ID> {

    @RestResource(path = "activeRecords" , rel = "active")
    Page<T> findByDeletedFalse(Pageable page);


}
