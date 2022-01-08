package itmo.s285594.backend.repositories;

import itmo.s285594.backend.entities.DisciplinesGroup;
import itmo.s285594.backend.entities.DisciplinesGroupId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin
public interface DisciplinesGroupRepository extends JpaRepository<DisciplinesGroup, DisciplinesGroupId> {
}