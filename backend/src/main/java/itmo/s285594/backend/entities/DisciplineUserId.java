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
public class DisciplineUserId implements Serializable {
    private static final long serialVersionUID = 2395637510124811427L;
    @Column(name = "discipline_id", nullable = false)
    private Integer disciplineId;
    @Column(name = "username", nullable = false, length = 20)
    private String username;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        DisciplineUserId entity = (DisciplineUserId) o;
        return Objects.equals(this.disciplineId, entity.disciplineId) &&
                Objects.equals(this.username, entity.username);
    }

    @Override
    public int hashCode() {
        return Objects.hash(disciplineId, username);
    }
}