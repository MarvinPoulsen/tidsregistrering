import React, { useState } from 'react';

import 'react-datepicker/dist/react-datepicker.css';
import DatePicker, { registerLocale } from 'react-datepicker';
import da from 'date-fns/locale/da'; // the locale you want
import { Task } from '../../SPS';
import './timeRegistration.scss';
import { differenceInMinutes } from 'date-fns';
registerLocale('da', da); // register it with the name you want

interface TimeRegistrationProps {
    setTaskDate: (date: Date) => void;
    date: Date;
    data: Task[];
    userId: string;
    onSave: () => void;
    editEntry?: number;
    note: string;
    setNote: (newNote) => void;
    resetForm: ()=>void;
    taskId: number;
    setTaskId:(newTaskId)=>void;
    taskTime:number;
    setTaskTime:(minutes)=>void;
}

const TimeRegistration = (props: TimeRegistrationProps) => {
    const [error, setError] = useState<string | null>(null);

    const handleTaskIdChange = (event)=> {
        const newTaskId = parseInt(event.target.value);
        const task = props.data.find((t: Task) => t.id === newTaskId);
        if (task) {
            setError(null);
        } else {
            setError('Ukent opgaveID');
        }
        props.setTaskId(newTaskId);
    }

    const handleTimeChange = (newTime)=> {
        const minutes = differenceInMinutes(new Date(newTime.getTime()), new Date(newTime.setHours(0, 0, 0, 0)));
        props.setTaskTime(minutes)
    }

    const handleNoteChange = (event)=> {
        props.setNote(event.target.value);
    }

    const handleSubmit = (event)=> {
        event.preventDefault();
        props.onSave();
        props.resetForm();
    }

    const options = props.data.filter((t) => t.isFavorite || t.id === props.taskId);
    const selectedOption = options.find((item) => item.id === props.taskId);
    const description =
        selectedOption && selectedOption.description !== ''
            ? selectedOption.description
            : 'Ingen beskrivelse af den valgte opgave endnu';

    return (
        <>
            <div className="box">
                <div className="block">
                    <form onSubmit={handleSubmit}>
                        <div className="columns is-align-items-flex-end">
                            <div className="column is-1">
                                <div className="field">
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
                            </div>
                            <div className="column is-3">
                                <div className="field">
                                    <label className="label">Vælg opgave</label>
                                    <div className="select is-fullwidth">
                                        <select
                                            onChange={handleTaskIdChange}
                                            name="taskId"
                                            value={props.taskId}
                                        >
                                            {options.map((option) => (
                                                <option
                                                    key={option.id}
                                                    value={option.id}
                                                >
                                                    {option.taskName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="column is-2">
                                <DatePicker
                                    todayButton="Dags dato"
                                    selected={props.date}
                                    onChange={props.setTaskDate}
                                    locale="da"
                                    showWeekNumbers
                                    className="input"
                                    dateFormat="dd-MM-yyyy"
                                    name="date"
                                    value={props.date}
                                />
                            </div>
                            <div className="column is-2">
                                <div className="field is-horizontal is-align-items-flex-end columns">
                                    <div className="field-label is-normal column is-2">
                                        <label className="label">Tid:</label>
                                    </div>
                                    <div className="field-body column">
                                        <div className="field">
                                            <span className="control">
                                                <DatePicker
                                                    selected={new Date().setHours(0, props.taskTime, 0, 0)}
                                                    onChange={handleTimeChange}
                                                    timeFormat="HH:mm"
                                                    showTimeSelect
                                                    showTimeSelectOnly
                                                    timeIntervals={15}
                                                    timeCaption="Time"
                                                    dateFormat="HH:mm"
                                                    className="input"
                                                    name="time"
                                                    value={new Date().setHours(0, props.taskTime, 0, 0)}
                                                />
                                            </span>
                                        </div>
                                    </div>
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
                                    <span className="control">
                                        <button
                                            className="button is-success"
                                            disabled={!!error}
                                        >
                                            Save
                                        </button>
                                    </span>
                                    <span className="control">
                                        <button
                                            className="button"
                                            type="button"
                                            onClick={props.resetForm}
                                        >
                                            Cancel
                                        </button>
                                    </span>
                                    <span className="control">
                                        <button
                                            className="button"
                                            type="button"
                                            onClick={()=>console.log('TimeRegistrationProps: ',props)}
                                        >
                                            Test
                                        </button>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </form>
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
            </div>
        </>
    );
};

export default TimeRegistration;
