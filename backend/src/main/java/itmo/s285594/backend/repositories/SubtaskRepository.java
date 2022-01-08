package itmo.s285594.backend.repositories;

import itmo.s285594.backend.entities.Subtask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin
public interface SubtaskRepository extends JpaRepository<Subtask, Integer> {
}