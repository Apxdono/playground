package org.apx.beans.domain.repo;

import org.apx.domain.model.Shit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
/**
 * Created by oleg on 21.04.2015.
 */
@RepositoryRestResource(path = "shits")
public interface ShitRepository extends BaseCrudRepository<Shit,String> {


    @RestResource(path = "tableData", rel = "tableData")
    @Query(value = "SELECT s FROM Shit s WHERE (1 = 1) " +
            "AND (:name IS NULL OR LOWER(s.name) LIKE :name )" +
            "AND (:internalName IS NULL OR LOWER(s.internalName) LIKE :internalName ) ")
    Page<Shit> tableData(@Param("name") String name, @Param("internalName") String internalName, Pageable page);

}
