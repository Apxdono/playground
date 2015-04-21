package org.apx.domain.model;


import org.apx.domain.model.listeners.BaseEntityWithoutIdListener;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by oleg on 3/2/15.
 */
@MappedSuperclass
@Access(AccessType.PROPERTY)
@EntityListeners({BaseEntityWithoutIdListener.class})
public abstract class BaseEntityWithoutId<T> implements IEntity<T> {

    private static final long serialVersionUID = -7749749383626353302L;

    String name;
    String internalName;
    String createdBy;
    String lastUpdatedBy;
    Date creationDate;
    Date lastUpdateDate;
    long version;
    boolean deleted;

    protected BaseEntityWithoutId() {
    }

    @Override
    @Column(name = "name")
    public String getName() {
        return name;
    }

    @Override
    @Column(name = "internal_name")
    public String getInternalName() {
        return internalName;
    }

    @Override
    @Column(name = "created_by")
    public String getCreatedBy() {
        return createdBy;
    }

    @Override
    @Column(name = "last_updated_by")
    public String getLastUpdatedBy() {
        return lastUpdatedBy;
    }

    @Override
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="creation_date")
    public Date getCreationDate() {
        return creationDate;
    }

    @Override
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name="last_update_date")
    public Date getLastUpdateDate() {
        return lastUpdateDate;
    }

    @Override
    @Column(name = "deleted")
    public boolean isDeleted() {
        return deleted;
    }

    @Override
    @Version
//    @IgnorePrefix
    @Column(name = "version")
    public long getVersion() {
        return version;
    }

    @Override
    public void setCreatedBy(String userId) {
        createdBy = userId;
    }

    @Override
    public void setLastUpdatedBy(String userId) {
        lastUpdatedBy = userId;
    }

    @Override
    public void setCreationDate(Date date) {
        creationDate = date;
    }

    @Override
    public void setLastUpdateDate(Date date) {
        lastUpdateDate = date;
    }

    @Override
    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    @Override
    public void setVersion(long version) {
        this.version = version;
    }

    @Override
    public void setName(String name) {
        this.name = name;
    }

    @Override
    public void setInternalName(String name) {
        this.internalName = name;
    }

}
