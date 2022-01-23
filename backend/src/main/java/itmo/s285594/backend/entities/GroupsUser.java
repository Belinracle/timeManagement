package itmo.s285594.backend.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;

@Getter
@Setter
@Entity
@Table(name = "groups_users")
public class GroupsUser implements Serializable {
    @Id
    private Long id;

    @ManyToOne
    @JoinColumn(name = "username")
    private User user;

    @ManyToOne
    @JoinColumn(name = "group_id")
    private Group group;

    private boolean canmodify;

}