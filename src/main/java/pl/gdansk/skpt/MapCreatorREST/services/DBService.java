package pl.gdansk.skpt.MapCreatorREST.services;

import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.function.Function;

abstract public class DBService<T> {
    final EntityManager entityManager;
    private final Class<T> entityClass;
    private final Function<T,Object> idSupplier;

    public DBService(EntityManager entityManager,Class<T> entityClass, Function<T,Object> idSupplier){
        this.entityManager = entityManager;
        this.entityClass = entityClass;
        this.idSupplier = idSupplier;
    }

    @Transactional
    public void save(T entity) {
        if (notYetInDB(entity)) {
            entityManager.persist(entity);
        } else {
            entityManager.merge(entity);
        }
    }

    private boolean notYetInDB(T entity) {
        return idSupplier.apply(entity) == null || entityManager.find(entityClass, idSupplier.apply(entity)) == null;
    }

    @Transactional
    public void remove(T entity) {
        entityManager.remove(entity);
    }

    public T find(String id) {
        return entityManager.find(entityClass, id);
    }
}
