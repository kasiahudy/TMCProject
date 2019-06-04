import { Marker } from './marker';
import { SystemUser } from './system-user';
import { Track } from './track';

export class Event {
    id: string;
    name: string;
    date: string;
    markers: Marker[];
    builders: SystemUser[];
    tracks: Track[];
}
