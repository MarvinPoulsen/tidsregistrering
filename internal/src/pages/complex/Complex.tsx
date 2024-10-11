// Import statements
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { registerLocale } from 'react-datepicker';
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import da from 'date-fns/locale/da'; // the locale you want
import { TimeEntry, Project, FavoritTask, Holiday, Norm, FlexBalance } from '../../SPS';
import { differenceInMinutes } from 'date-fns';
import CustomToolbar from '../../components/calendar/CustomToolbar';
registerLocale('da', da); // register it with the name you want

// export interface Event {
//     title: string;
//     start: Date;
//     end: Date;
//     allDay?: boolean;
//     resource?: Any;
// }

interface Resource {
    id: number;
    note?: string;
    taskDate: Date;
    taskId: number;
    taskTime: number;
    userId: string;
    color?: string;
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
// const backgroundEvents = [];
const makeHolydayList = (holidayList) => {
    const eventList = [];
    for (const holiday of holidayList) {
        const event = {
            title: holiday.title,
            allDay: 'false',
            start: holiday.start,
            end: holiday.end,
        };
        eventList.push(event);
    }
    return eventList;
};
const makeEventList = (registrationList, taskList) => {
    const eventList = [];
    for (const registration of registrationList) {
        const task = taskList.find((t) => t.id === registration.taskId);
        const minutes = differenceInMinutes(new Date(registration.taskEnd), new Date(registration.taskStart));
        const color =
            task.id === 26
                ? 'rgb(220, 20, 60, 0.6)'
                : task.id === 24
                ? 'rgb(238, 130, 238, 0.6)'
                : task.projectId === 10
                ? 'rgb(255, 215, 0, 0.6)'
                : 'rgba(30, 144, 255, 0.6)';
        const resource: Resource = {
            id: registration.id,
            note: registration.note,
            taskDate: registration.taskDate,
            taskId: task.id,
            taskTime: minutes,
            userId: registration.userId,
            color,
        };
        const event = {
            title: task.taskName,
            allDay: registration.allDay === 'true',
            start: registration.taskStart,
            end: registration.taskEnd,
            resource,
        };
        eventList.push(event);
    }
    return eventList;
};
interface ComplexProps {
    holidays: Holiday[];
    registrations: TimeEntry[];
    taskDate: Date;
    projects: Project[];
    tasks: FavoritTask[];
    setEditEntry: (id) => void;
    setTaskStart: (start) => void;
    setTaskEnd: (end) => void;
    setTaskDate: (newTaskDate) => void;
    setIsEditCalendarActive: (isOn: boolean) => void;
    taskTime: number;
    setTaskTime: (minutes) => void;
    note: string;
    setNote: (newNote) => void;
    resetForm: () => void;
    taskId: number;
    setTaskId: (newTaskId) => void;
    setAllDay: (isAllDay: boolean) => void;
    formInfo?: () => void;
    norms: number[];
    balances: FlexBalance[];
}
const Complex = ({norms,  ...props}: ComplexProps) => {
    const [allEvents, setAllEvents] = useState<Event[]>([]);
    const [backgroundEvents, setBackgroundEvents] = useState<Event[]>([]);

    useEffect(() => {
        const holiday: Event[] = makeHolydayList(props.holidays);
        setBackgroundEvents(holiday);
        const data: Event[] = makeEventList(props.registrations, props.tasks);
        setAllEvents(data);
    }, [props.registrations, props.tasks]);

    const handleSelectSlot = ({ start, end }) => {
        // props.formInfo();
        const taskDate = start.toDateString();
        props.setTaskDate(new Date(taskDate));
        props.setTaskStart(start);
        props.setTaskEnd(end);
        props.setAllDay(false);
        props.setIsEditCalendarActive(true);
        const minutes = differenceInMinutes(new Date(end), new Date(start));
        props.setTaskTime(minutes);
    };

    const { defaultDate, formats, scrollToTime } = useMemo(
        () => ({
            defaultDate: props.taskDate,
            formats: {
                weekdayFormat: (date, culture, localizer) => localizer.format(date, 'dddd', culture),
            },
            scrollToTime: new Date(1970, 1, 1, 8),
            
        }),
        []
    );
    const handleSelectEvent = useCallback((element) => {
        if (element.isBackgroundEvent) {
        } else {
            // props.formInfo();
            props.setNote(element.resource.note);
            props.setTaskId(element.resource.taskId);
            props.setTaskTime(element.resource.taskTime);
            props.setEditEntry(element.resource.id);
            props.setAllDay(element.allDay);
            props.setTaskDate(new Date(element.resource.taskDate.setHours(0, 0, 0, 0)));
            props.setTaskStart(element.start);
            props.setTaskEnd(element.end);
            props.setIsEditCalendarActive(true);
        }
    }, []);

    const eventPropGetter = useCallback((event, start, end, isSelected) => {
        const backgroundColor = event && event.resource && event.resource.color ? event.resource.color : '#666';
        const style = {
            backgroundColor,
        };
        return {
            style,
        };
    }, []);

const components = {
    toolbar: (props) => <CustomToolbar {...props} events={allEvents} holidays={backgroundEvents} norms={norms}/>,
}

    return (
        <>
            <section className="section">
                <div className="container">
                    {/* 
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
                         */}
                    <Calendar
                    components={components}
                        backgroundEvents={backgroundEvents}
                        defaultView="week"
                        events={allEvents}
                        localizer={localizer}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: '80vh' }}
                        onSelectSlot={handleSelectSlot}
                        // onSelectSlot={(slotInfo) => {console.log(slotInfo)}}
                        selectable
                        scrollToTime={scrollToTime}
                        // onSelectEvent={(eventInfo) => {console.log(eventInfo)}}
                        onSelectEvent={handleSelectEvent}
                        views={{ week: true }}
                        defaultDate={defaultDate}
                        formats={formats}
                        culture="da"
                        dayLayoutAlgorithm="no-overlap"
                        timeslots={4}
                        step={15}
                        eventPropGetter={eventPropGetter}
                    />
                </div>
            </section>
        </>
    );
};
export default Complex;
