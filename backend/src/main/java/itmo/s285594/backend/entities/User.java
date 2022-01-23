package itmo.s285594.backend.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User implements Serializable {
    @Id
    @Column(name = "username", nullable = false, length = 20)
    private String id;

    @Column(name = "password", nullable = false, length = 30)
    private String password;

    @ManyToMany
    @JoinTable(
            name = "discipline_user",
            joinColumns = @JoinColumn(name = "username"),
            inverseJoinColumns = @JoinColumn(name = "discipline_id"))
    Set<Discipline> disciplineSet;

    @OneToMany(mappedBy = "user")
    private List<GroupsUser> groups;
}