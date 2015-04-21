package org.apx.domain.model;

import java.io.Serializable;
import java.util.Date;

/**
 * Created by oleg on 3/2/15.
 */
public interface IEntity<T> extends Serializable {

    T primaryKey();
    void primaryKey(T id);

    String getCreatedBy();
    void setCreatedBy(String userId);

    String getLastUpdatedBy();
    void setLastUpdatedBy(String userId);

    Date getCreationDate();
    void setCreationDate(Date date);

    Date getLastUpdateDate();
    void setLastUpdateDate(Date date);

    boolean isDeleted();
    void setDeleted(boolean deleted);

    long getVersion();
    void setVersion(long version);

    String getName();
    void setName(String name);

    String getInternalName();
    void setInternalName(String name);

}
