package itmo.s285594.backend;

import itmo.s285594.backend.entities.*;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@SpringBootApplication
public class BackendApplication implements RepositoryRestConfigurer {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        config.exposeIdsFor(Discipline.class);
        config.exposeIdsFor(Subtask.class);
        config.exposeIdsFor(Task.class);
        config.exposeIdsFor(GroupsUser.class);
        config.exposeIdsFor(Group.class);
    }

}
