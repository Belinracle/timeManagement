package itmo.s285594.backend.repositories;

import itmo.s285594.backend.entities.Label;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin
public interface LabelRepository extends JpaRepository<Label, Integer> {
}