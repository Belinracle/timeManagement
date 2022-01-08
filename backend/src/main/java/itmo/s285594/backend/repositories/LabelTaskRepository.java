package itmo.s285594.backend.repositories;

import itmo.s285594.backend.entities.LabelTask;
import itmo.s285594.backend.entities.LabelTaskId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin
public interface LabelTaskRepository extends JpaRepository<LabelTask, LabelTaskId> {
}