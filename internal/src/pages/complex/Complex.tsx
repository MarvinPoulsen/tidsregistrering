import React, { useCallback, useMemo, useState, useEffect } from 'react';
// import DatePicker, { registerLocale } from 'react-datepicker';
import  { registerLocale } from 'react-datepicker';
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import da from 'date-fns/locale/da'; // the locale you want
// import addHours from 'date-fns/addHours';
// import startOfHour from 'date-fns/startOfHour';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
// import { getHours, getMinutes } from 'date-fns';
// import { TimeEntry, Project, User, Task } from '../../SPS';
import { TimeEntry, Project, Task } from '../../SPS';
registerLocale('da', da); // register it with the name you want

export interface Event {
    id: number;
    title: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    resource?: string;
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
// console.log('eventList: ',eventList)
// console.log('project: ',project)
// console.log('events: ',events)
const makeEventList = (registrationList, taskList) => {
    const eventList = [];
    for (const registration of registrationList) {
        const task = taskList.find((t) => t.id === registration.taskId);
        const allDay = registration.allDay === 'true';
        const event = {
            id: registration.id,
            title: task.taskName,
            allDay,
            start: registration.taskStart,
            end: registration.taskEnd,
            resource: registration.note,
        };
        eventList.push(event);
    }
    return eventList;
};
interface ComplexProps {
    timeRegistrationData: TimeEntry[];
    taskDate: Date;
    projectsData: Project[];
    taskData: Task[];
    // taskStart:Date;
    // taskEnd:Date;
    // user:User;
    // onSave:(entry)=>void;
    // editEntry:TimeEntry;
    // onDelete:(id)=>void;
    // onEdit:(e: any)=>void
    onStartChanged:(start)=>void;
    onEndChanged:(end)=>void;
    onDateChanged:(newTaskDate)=>void;
    openEditCalendar: () => void;
    closeEditCalendar: () => void;
}
const Complex = (props: ComplexProps) => {
    // console.log('ComplexProps: ', props);
    const [allEvents, setAllEvents] = useState<Event[]>([]);

    // const events: Event[] = props.timeRegistrationData && makeEventList(props.timeRegistrationData, props.taskData);
    // const nextId = Math.max(...events.map((o) => o.id)) + 1;
    // const [newEvent, setNewEvent] = useState<Event>(null);

    useEffect(() => {
        const data: Event[] = makeEventList(props.timeRegistrationData, props.taskData);
        setAllEvents(data);
    }, [props.timeRegistrationData, props.taskData]);
    // useEffect(() => {
    //     if (newEvent) {
    //         setAllEvents([...allEvents, newEvent]);
    //     }
    // }, [newEvent]);
    const handleSelectSlot = ({ start, end }) => {
        // const newTaskDate = format(start, 'dd-MM-yyyy')
        props.onDateChanged(start)
        props.onStartChanged(start)
        props.onEndChanged(end)
        props.openEditCalendar()
        // const id = nextId;
        // const 
        // const title = window.prompt('New Event name');
        // if (title) {
        //     const newEvent: TimeEntry = {
                
    // taskDate: Date;
    // id?: number;
    // note: string;
    // taskId: number;
    // taskTime: number;
    // userId: string;
    // taskStart: Date;
    // taskEnd: Date;
    // allDay:boolean;
        //         id,
        //         title,
        //         start,
        //         end,
        //     };
        //     setAllEvents([...allEvents, newEvent])
        // }
    };

    // console.log('allEvents: ', allEvents);
    const { defaultDate, formats, scrollToTime } = useMemo(
        () => ({
            defaultDate: new Date(),
            formats: {
                weekdayFormat: (date, culture, localizer) => localizer.format(date, 'dddd', culture),
            },
            scrollToTime: new Date(1970, 1, 1, 8),
        }),
        []
    );
    const handleSelectEvent = useCallback((event) => {
        window.alert(event.title);
    }, []);

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
                        style={{ height: '80vh' }}
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
