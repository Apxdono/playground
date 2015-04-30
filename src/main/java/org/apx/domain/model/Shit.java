package org.apx.domain.model;

import javax.persistence.*;
import java.util.List;

/**
 * Created by oleg on 21.04.2015.
 */
@Entity
@Table(name = "shits")
public class Shit extends BaseEntity {

    public Shit parent;

    public List<Shit> children;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    public Shit getParent() {
        return parent;
    }

    public void setParent(Shit parent) {
        this.parent = parent;
    }

    @OneToMany(mappedBy = "parent" , targetEntity = Shit.class)
    public List<Shit> getChildren() {
        return children;
    }

    public void setChildren(List<Shit> children) {
        this.children = children;
    }
}
