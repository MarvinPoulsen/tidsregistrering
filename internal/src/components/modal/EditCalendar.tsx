import React, { useState } from 'react';
import { FavoritTask, SpsUser } from '../../SPS';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker, { registerLocale } from 'react-datepicker';
import da from 'date-fns/locale/da'; // the locale you want
registerLocale('da', da); // register it with the name you want
import { differenceInMinutes } from 'date-fns';

interface EditCalendarProps {
    isActive: boolean;
    onSave: () => void;
    setIsEditCalendarActive: (isOn: boolean) => void;
    start: Date;
    end: Date;
    date: Date;
    taskList: FavoritTask[];
    user: SpsUser;
    editEntry?: number;
    note: string;
    setNote: (newNote) => void;
    resetForm: () => void;
    taskId: number;
    setTaskId: (newTaskId) => void;
    setAllDay: (isAllDay: boolean) => void;
    allDay: boolean;
    handleDateChange: (newDate) => void;
    setTaskStart: (start) => void;
    setTaskEnd: (end) => void;
    setTaskTime: (minutes) => void;
}

const EditCalendar = (props: EditCalendarProps) => {
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (event) => {
        // window.alert(event.target.value);
        event.preventDefault();
        props.onSave();
        props.resetForm();
        props.setIsEditCalendarActive(false);
    };
    const handleTaskIdChange = (event) => {
        const newTaskId = parseInt(event.target.value);
        const task = props.taskList.find((t: FavoritTask) => t.id === newTaskId);
        if (task) {
            setError(null);
        } else {
            setError('Ukent opgaveID');
        }
        props.setTaskId(newTaskId);
    };
    const handleNoteChange = (event) => {
        props.setNote(event.target.value);
    };

    const handleClose = () => {
        props.resetForm();
        props.setIsEditCalendarActive(false);
    };

    const onChangeAllDay = (event) => {
        const on: boolean = event.target.checked;
        props.setAllDay(on)
    }

    const shouldTimesBeIgnored = ' Ignorer tider ';

    const handleSetTaskStart = (taskStart) => {
        if ((taskStart<props.end)){
            const minutes = differenceInMinutes(props.end, taskStart);
            props.setTaskTime(minutes)
            props.setTaskStart(taskStart)
        } else {
            window.alert('Hvad laver du!! Starttiden skal være før end sluttiden');
            console.log('Hvad laver du!! Starttiden skal være mindre end sluttiden')
        }
    }
    
    const handleSetTaskEnd = (taskEnd) => {
        if ((taskEnd>props.start)){
            const minutes = differenceInMinutes(taskEnd, props.start);
            props.setTaskTime(minutes)
            props.setTaskEnd(taskEnd)
        } else {
            window.alert('Hvad laver du!! Starttiden skal være før end sluttiden');
            console.log('Hvad laver du!! Starttiden skal være mindre end sluttiden')
        }
    }

    const options = props.taskList.filter((t) => t.isFavorite || t.id === props.taskId);
    const selectedOption = options.find((item) => item.id === props.taskId);
    const description =
        selectedOption && selectedOption.description !== ''
            ? selectedOption.description
            : 'Ingen beskrivelse af den valgte opgave endnu';
    return (
        <>
            <div className={'modal' + (props.isActive ? ' is-active' : '')}>
                <div className="modal-background" onClick={handleClose}></div>
                <div className="modal-content">
                    <div className="box">
                        <h1 className="title">Tilføj ny opgave</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="field is-grouped">
                                <div className="column  is-narrow">
                                    <label className="label">OpgaveID</label>
                                    <input
                                        className="input"
                                        type="text"
                                        placeholder=""
                                        onChange={handleTaskIdChange}
                                        name="taskId"
                                        value={props.taskId}
                                    />
                                </div>
                                <div className="column">
                                    <label className="label">Vælg opgave</label>
                                    <div className="select is-fullwidth">
                                        <select onChange={handleTaskIdChange} name="taskId" value={props.taskId}>
                                            {options.map((option) => (
                                                <option key={option.id} value={option.id}>
                                                    {option.taskName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            {error && (
                                <article className="message is-danger is-small">
                                    <div className="message-body">{error}</div>
                                </article>
                            )}
                            {!error && (
                                <article className="message is-info is-small">
                                    <div className="message-body">{description}</div>
                                </article>
                            )}
                            <div className="field is-grouped">
                                <div className="column is-narrow">
                                    <label className="label">Dato</label>
                                    <DatePicker
                                        todayButton="Dags dato"
                                        selected={props.date}
                                        onChange={props.handleDateChange} // setTaskDate bliver sat uden tid
                                        locale="da"
                                        showWeekNumbers
                                        className="input"
                                        dateFormat="dd-MM-yyyy"
                                        name="date"
                                        value={props.date}
                                        popperPlacement="top-end"
                                    />
                                </div>
                                <div className="column">
                                    <label className="label">Fra:</label>
                                        <DatePicker
                                            selected={new Date(props.start)}
                                            onChange={handleSetTaskStart}
                                            timeFormat="HH:mm"
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={1}
                                            timeCaption="Time"
                                            dateFormat="HH:mm"
                                            className="input"
                                            name="start"
                                            value={new Date(props.start)}
                                            minTime={new Date(props.date)}
                                            maxTime={new Date(props.end)}
                                        />
                                </div>
                                <div className="column">
                                    <label className="label">Til:</label>
                                        <DatePicker
                                            selected={props.end}
                                            onChange={handleSetTaskEnd}
                                            timeFormat="HH:mm"
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={1}
                                            timeCaption="Time"
                                            dateFormat="HH:mm"
                                            className="input"
                                            name="end"
                                            value={props.end}
                                            minTime={props.start}
                                            maxTime={new Date(props.date.toDateString()).setHours(23,59,0,0)}
                                        />
                                </div>
                            </div>
                            <div className="column">
                                <div className="control">
                                    <textarea
                                        className="textarea"
                                        placeholder="Note"
                                        rows={2}
                                        onChange={handleNoteChange}
                                        name="note"
                                        value={props.note}
                                    />
                                </div>
                            </div>

                            <div className="column">
                                <div className="control">
                                    <label className="checkbox">
                                        <input
                                            type="checkbox"
                                            checked={props.allDay}
                                            onChange={onChangeAllDay}
                                            value={props.taskId}
                                        />
                                        {shouldTimesBeIgnored}
                                    </label>
                                </div>
                            </div>

                            <div className="column is-narrow">
                                <div className="field is-grouped">
                                    <button className="button is-success" disabled={!!error}>
                                        Gem
                                    </button>
                                    <button className="button" type="button" onClick={handleClose}>
                                        Annuller
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <button className="modal-close is-large" aria-label="close" onClick={handleClose}></button>
            </div>
        </>
    );
};
export default EditCalendar;
