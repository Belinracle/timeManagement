package itmo.s285594.backend.repositories;

import itmo.s285594.backend.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin
public interface TaskRepository extends JpaRepository<Task, Integer> {
}