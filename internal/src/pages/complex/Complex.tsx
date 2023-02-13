import React, { useCallback, useMemo, useState, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import da from 'date-fns/locale/da'; // the locale you want
import addHours from 'date-fns/addHours';
import startOfHour from 'date-fns/startOfHour';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getHours, getMinutes } from 'date-fns';
registerLocale('da', da); // register it with the name you want

interface Event {
    id: number;
    title: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    resource?: any;
    note?: string;
}

const locales = {
    da: da,
};
// The types here are `object`. Strongly consider making them better as removing `locales` caused a fatal error
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});
const events: Event[] = [
    {
        id:1,
        title: 'Adminitrative opgaver',
        start: new Date(2023, 0, 23, 8),
        end: new Date(2023, 0, 23, 8, 30),
        resource: 'Her kan stå en note',
    },
    {
        id:2,
        title: 'React calander',
        allDay: false,
        start: new Date(2023, 0, 23, 8, 30),
        end: new Date(2023, 0, 23, 9, 30),
    },
    {
        id:3,
        title: 'QGIS manglende dataforsyningslag Tine',
        start: new Date(2023, 0, 23, 9, 30),
        end: new Date(2023, 0, 23, 9, 45),
    },
    {
        id:4,
        title: 'Teams manglende lyd ved opkald Tina',
        start: new Date(2023, 0, 23, 9, 45),
        end: new Date(2023, 0, 23, 10),
    },
    {
        id:5,
        title: 'React calander',
        allDay: false,
        start: new Date(2023, 0, 23, 10),
        end: new Date(2023, 0, 23, 11, 30),
    },
    {
        id:6,
        title: 'Frokost',
        allDay: false,
        start: new Date(2023, 0, 23, 11, 30),
        end: new Date(2023, 0, 23, 12),
    },
    {
        id:7,
        title: 'React calander',
        allDay: false,
        start: new Date(2023, 0, 23, 12),
        end: new Date(2023, 0, 23, 15, 30),
    },
    {
        id:8,
        title: 'Adminitrative opgaver',
        start: new Date(2023, 0, 24, 8),
        end: new Date(2023, 0, 24, 8, 30),
    },
    {
        id:9,
        title: 'React calander',
        allDay: false,
        start: new Date(2023, 0, 24, 8, 30),
        end: new Date(2023, 0, 24, 10),
    },
    {
        id:10,
        title: 'Webinaret',
        start: new Date(2023, 0, 24, 10),
        end: new Date(2023, 0, 24, 11),
    },
    {
        id:11,
        title: 'React calander',
        allDay: false,
        start: new Date(2023, 0, 24, 11),
        end: new Date(2023, 0, 24, 11, 30),
    },
    {
        id:12,
        title: 'Frokost',
        allDay: false,
        start: new Date(2023, 0, 24, 11, 30),
        end: new Date(2023, 0, 24, 12),
    },
    {
        id:13,
        title: 'React calander',
        allDay: false,
        start: new Date(2023, 0, 24, 12),
        end: new Date(2023, 0, 24, 15, 30),
    },
];

const Complex = () => {
    const nextId = Math.max(...events.map(o => o.id))+1
    const [newEvent, setNewEvent] = useState<Event>(null);
    const [allEvents, setAllEvents] = useState<Event[]>(events);
    useEffect(() => {
        if (newEvent) {
            setAllEvents([...allEvents, newEvent]);
        }
      }, [newEvent]);
    const handleSelectSlot = ({ start, end }) => {
        const id = nextId;
        const title = window.prompt('New Event name');
          if (title) {
            setNewEvent({      
                id,
                title,
                start,
                end
          })
        }
    };

    const { defaultDate, formats, scrollToTime } = useMemo(
        () => ({
            defaultDate: new Date(),
            formats: {
                weekdayFormat: (date, culture, localizer) =>
                    localizer.format(date, 'dddd', culture),
            },
            scrollToTime: new Date(1970, 1, 1, 8),
        }),
        []
    );
    const handleSelectEvent = useCallback(
        (event) => {window.alert(event.title)
        },
        []
      )
      
    return (
        <>
            <section className="section">
                <div className="container">
                    {/* <h1 className="title">Kalender</h1>
                    <p className="subtitle">Tilføj ny opgave</p>
                    <div>
                        <input
                            type="text"
                            placeholder="Tilføj titel"
                            value={newEvent.title}
                            onChange={(e) =>
                                setNewEvent({
                                    ...newEvent,
                                    title: e.target.value,
                                })
                            }
                        />
                        <DatePicker
                            placeholderText="Start"
                            selected={newEvent.start}
                            onChange={(start) =>
                                setNewEvent({ ...newEvent, start })
                            }
                            locale="da"
                        />
                        <DatePicker
                            placeholderText="Slut"
                            selected={newEvent.end}
                            onChange={(end) =>
                                setNewEvent({ ...newEvent, end })
                            }
                            locale="da"
                        />
                        <button className="button" onClick={handleAddEvent}>
                            Gem
                        </button>
                    </div> */}
                    <Calendar
                        defaultView="week"
                        events={allEvents}
                        localizer={localizer}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: '60vh' }}
                        onSelectSlot={handleSelectSlot}
                        // onSelectSlot={(slotInfo) => {console.log(slotInfo);}}
                        selectable
                        scrollToTime={scrollToTime}
                        // onSelectEvent={(eventInfo) => {console.log(eventInfo);}}
                        onSelectEvent={handleSelectEvent}
                        views={{ week: true }}
                        defaultDate={defaultDate}
                        formats={formats}
                        culture="da"
                        dayLayoutAlgorithm="no-overlap"
                        timeslots={4}
                        step={15}
                    />
                </div>
            </section>
        </>
    );
};
export default Complex;
