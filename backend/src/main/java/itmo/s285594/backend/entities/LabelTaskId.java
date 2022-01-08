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
public class LabelTaskId implements Serializable {
    private static final long serialVersionUID = 285183309562411663L;
    @Column(name = "label_id", nullable = false)
    private Integer labelId;
    @Column(name = "task_id", nullable = false)
    private Integer taskId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        LabelTaskId entity = (LabelTaskId) o;
        return Objects.equals(this.labelId, entity.labelId) &&
                Objects.equals(this.taskId, entity.taskId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(labelId, taskId);
    }
}