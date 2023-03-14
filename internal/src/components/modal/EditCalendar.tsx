// import React, { useState, useEffect } from 'react';
import React, { useState } from 'react';
// import { Task } from '../../SPS';
import { Task, User } from '../../SPS';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker, { registerLocale } from 'react-datepicker';
import da from 'date-fns/locale/da'; // the locale you want
registerLocale('da', da); // register it with the name you want

interface EditCalendarProps {
    isActive: boolean;
    onSave: () => void;
    setIsEditCalendarActive: (isOn:boolean)=>void;
    start: Date;
    end: Date;
    date: Date;
    taskList: Task[];
    user: User;
    editEntry?: number;
    note: string;
    setNote: (newNote) => void;
    resetForm: ()=>void;
    taskId: number;
    setTaskId:(newTaskId)=>void;
    setAllDay: (isAllDay:boolean)=>void;
    allDay:boolean;
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
        const task = props.taskList.find((t: Task) => t.id === newTaskId);
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
                                        selected={props.date}
                                        locale="da"
                                        showWeekNumbers
                                        className="input"
                                        dateFormat="dd-MM-yyyy"
                                        name="date"
                                        value={props.date}
                                        readOnly
                                    />
                                </div>
                                <div className="column">
                                    <label className="label">Fra:</label>
                                    <span className="control">
                                        <DatePicker
                                            selected={props.start}
                                            timeFormat="HH:mm"
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={15}
                                            timeCaption="Time"
                                            dateFormat="HH:mm"
                                            className="input"
                                            name="start"
                                            value={props.start}
                                            readOnly
                                        />
                                    </span>
                                </div>
                                <div className="column">
                                    <label className="label">Til:</label>
                                    <span className="control">
                                        <DatePicker
                                            selected={props.end}
                                            timeFormat="HH:mm"
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={15}
                                            timeCaption="Time"
                                            dateFormat="HH:mm"
                                            className="input"
                                            name="start"
                                            value={props.end}
                                            readOnly
                                        />
                                    </span>
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
                            <div className="column is-narrow">
                                <div className="field is-grouped">
                                    <button className="button is-success" disabled={!!error}>
                                        Gem
                                    </button>
                                    <button className="button" type="button" onClick={handleClose}>
                                        Annuller
                                    </button>
                                    <button
                                        className="button"
                                        type="button"
                                        onClick={()=>console.log('EditCalendarProps: ',props)}
                                    >
                                        Test
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
