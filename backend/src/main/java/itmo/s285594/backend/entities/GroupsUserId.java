package itmo.s285594.backend.entities;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.Entity;
import javax.persistence.Lob;
import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@Embeddable
public class GroupsUserId implements Serializable {
    private static final long serialVersionUID = -702999480188458747L;
    @Column(name = "group_id", nullable = false)
    private Integer groupId;

    @Column(name = "username", nullable = false)
    private String username;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        GroupsUserId entity = (GroupsUserId) o;
        return Objects.equals(this.groupId, entity.groupId) &&
                Objects.equals(this.username, entity.username);
    }

    @Override
    public int hashCode() {
        return Objects.hash(groupId, username);
    }
}