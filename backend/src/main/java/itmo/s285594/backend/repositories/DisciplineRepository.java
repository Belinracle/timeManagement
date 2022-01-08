package itmo.s285594.backend.repositories;

import itmo.s285594.backend.entities.Discipline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin
public interface DisciplineRepository extends JpaRepository<Discipline, Integer> {
}