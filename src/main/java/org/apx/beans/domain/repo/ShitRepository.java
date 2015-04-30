package org.apx.beans.domain.repo;

import net.kaczmarzyk.spring.data.jpa.domain.Like;
import net.kaczmarzyk.spring.data.jpa.web.annotation.Or;
import net.kaczmarzyk.spring.data.jpa.web.annotation.Spec;
import org.apx.domain.model.Shit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
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
            "AND (:name IS NULL OR LOWER(s.name) LIKE CONCAT( '%',LOWER(:name),'%' ) )" +
            "AND (:internalName IS NULL OR LOWER(s.internalName) LIKE CONCAT( '%',LOWER(:internalName),'%' )  ) ")
    Page<Shit> tabledata(@Param("name") String name, @Param("internalName") String internalName, Pageable page);

}
