package org.apx.beans.domain.repo;

import org.apx.domain.model.Shit;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/**
 * Created by oleg on 21.04.2015.
 */
@RepositoryRestResource(path = "shits")
public interface ShitRepository extends BaseCrudRepository<Shit,String> {
}
