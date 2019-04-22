package pl.gdansk.skpt.MapCreatorREST.model;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "event_table")
@EqualsAndHashCode(of = "id")
public class Event {
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
    @ManyToMany
    private List<SystemUser> participants;

    @Column
    @Setter
    @Getter
    @ManyToMany
    private List<SystemUser> builders;
}
