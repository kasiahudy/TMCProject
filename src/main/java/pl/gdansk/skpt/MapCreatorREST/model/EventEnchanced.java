package pl.gdansk.skpt.MapCreatorREST.model;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "event_enchanced_table")
@EqualsAndHashCode(of = "id")
public class EventEnchanced {
    @Id
    @Getter
    @GeneratedValue( strategy= GenerationType.AUTO )
    @Column(name="id")
    private UUID id;

    @Getter
    @Column(name = "event_name")
    private String name;

    @Getter
    @Column(name = "event_date")
    private LocalDate date;

    @Column
    @Setter
    @Getter
    @OneToMany(
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JoinColumn(name = "event_enchanced_table_id")
    private List<Tape> tapes;

    @Column
    @Setter
    @Getter
    @ManyToMany
    private List<SystemUser> builders;

    public EventEnchanced(String name, LocalDate date, List<Tape> tapes, List<SystemUser> users){
        this.name = name;
        this.date = date;
        this.tapes = tapes;
        this.builders = users;
    }

    public EventEnchanced(){

    }


}
