// import React, { useState, useEffect } from 'react';
import React, { useState } from 'react';
// import { Task } from '../../SPS';
import { Task, TimeEntry, User } from '../../SPS';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker, { registerLocale } from 'react-datepicker';
import da from 'date-fns/locale/da'; // the locale you want
import differenceInMinutes from 'date-fns/differenceInMinutes';
registerLocale('da', da); // register it with the name you want

interface EditCalendarProps {
    isActive: boolean;
    onSave: (entry: TimeEntry) => void;
    onClose: () => void;
    start: Date;
    end: Date;
    date: Date;
    taskList: Task[];
    user: User;
}

const EditCalendar = (props: EditCalendarProps) => {
    // console.log('EditCalendarProps: ',props)
    // console.log('EditCalendarProps.date: ', typeof props.date, props.date);
    const [taskId, setTaskId] = useState<number>(1);
    const [note, setNote] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (event) => {
        // window.alert(event.target.value);
        const allDay = false;
        event.preventDefault();
        const minutes = differenceInMinutes(new Date(props.end), new Date(props.start));
        const formData: TimeEntry = {
            taskDate: props.date,
            note,
            taskId,
            taskTime: minutes,
            userId: props.user.shortid,
            taskStart: props.start,
            taskEnd: props.end,
            allDay,
        };
        // console.log(formData);

        // if (props.editEntry && props.editEntry.id) {
        //     formData.id = props.editEntry.id;
        // }
        props.onSave(formData);
        resetForm();
        props.onClose();
    };
    const handleTaskIdChange = (event) => {
        const taskId = parseInt(event.target.value);
        const task = props.taskList.find((t: Task) => t.id === taskId);
        if (task) {
            setError(null);
        } else {
            setError('Ukent opgaveID');
        }
        setTaskId(taskId);
    };
    const handleNoteChange = (event) => {
        setNote(event.target.value);
    };

    const handleClose = () => {
        resetForm();
        props.onClose();
    };

    const resetForm = () => {
        setTaskId(1);
        setNote('');
        setError(null);
    };
    const options = props.taskList.filter((t) => t.isFavorite || t.id === taskId);
    const selectedOption = options.find((item) => item.id === taskId);
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
                                        value={taskId}
                                    />
                                </div>
                                <div className="column">
                                    <label className="label">Vælg opgave</label>
                                    <div className="select is-fullwidth">
                                        <select onChange={handleTaskIdChange} name="taskId" value={taskId}>
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
                                        value={note}
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
