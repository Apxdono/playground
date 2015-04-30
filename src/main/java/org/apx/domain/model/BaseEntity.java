package org.apx.domain.model;

import javax.persistence.*;

/**
 * Created by oleg on 3/2/15.
 */

@MappedSuperclass
@Access(AccessType.PROPERTY)
public abstract class BaseEntity extends BaseEntityWithoutId<String> {

    private static final long serialVersionUID = -8868044386164677999L;
    String id;

    protected BaseEntity() {
    }

    @Id
    @GeneratedValue(generator="system-uuid")
    @Column(name="id", length = 36)
    public String getId(){
        return id;
    }


    @Transient
    public String primaryKey() {
        return id;
    }

    public void primaryKey(String id) {
        this.id = id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        BaseEntity that = (BaseEntity) o;

        if (id != null ? !id.equals(that.id) : that.id != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }
}
