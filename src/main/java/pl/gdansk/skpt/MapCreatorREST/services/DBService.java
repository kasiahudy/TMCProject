package pl.gdansk.skpt.MapCreatorREST.services;

import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.UUID;
import java.util.function.Function;
import java.util.function.Supplier;

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
        if (entityManager.find(entityClass, idSupplier.apply(entity)) == null) {
            //Jeśli identyfikator nie występuje w bazie danych, obiekt encyjny jest w stanie new
            entityManager.persist(entity);
        } else {
            //Jeśli identyfikator występuje w bazie danych, należy przeprowadzić obiekt do stanu managed, aby
            //wprowadzone w nim modyfikacje zostały zarejestrowane w ramach kontekstu trwałości (ang. persistence
            //context). Zmiany zostaną zapisane w bazie danych, gdy bieżąca transakcja zostanie zatwierdzona.
            entityManager.merge(entity);
        }
    }

    @Transactional
    public void remove(T entity) {
        entityManager.remove(entity);
    }

    public T find(String id) {
        return entityManager.find(entityClass, id);
    }
}
