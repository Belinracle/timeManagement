package itmo.s285594.backend.entities;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.Entity;
import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@Embeddable
public class DisciplinesGroupId implements Serializable {
    private static final long serialVersionUID = -7803106688429707101L;
    @Column(name = "group_id", nullable = false)
    private Integer groupId;
    @Column(name = "discipline_id", nullable = false)
    private Integer disciplineId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        DisciplinesGroupId entity = (DisciplinesGroupId) o;
        return Objects.equals(this.groupId, entity.groupId) &&
                Objects.equals(this.disciplineId, entity.disciplineId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(groupId, disciplineId);
    }
}