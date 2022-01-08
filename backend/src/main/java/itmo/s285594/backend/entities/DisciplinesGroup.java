package itmo.s285594.backend.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;

@Getter
@Setter
@Entity
@Table(name = "disciplines_groups")
public class DisciplinesGroup {
    @EmbeddedId
    private DisciplinesGroupId id;
}