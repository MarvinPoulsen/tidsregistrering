import React, { useState } from 'react';
import { Project } from '../../SPS';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker, { registerLocale } from 'react-datepicker';
import da from 'date-fns/locale/da'; // the locale you want
registerLocale('da', da); // register it with the name you want
import Select from 'react-select';

interface NewTaskProps {
    isNewTaskActive: boolean;
    projectId: number;
    setProjectId: (projectId) => void;
    taskName: string;
    setTaskName: (taskName) => void;
    milestone: Date;
    setMilestone: (milestone) => void;
    importance: number;
    setImportance: (importance) => void;
    timeframe: number;
    setTimeframe: (timeframe) => void;
    description: string;
    setDescription: (description) => void;
    obsolete: boolean;
    setObsolete: (isObsolete: boolean) => void;
    onSave: () => void;
    resetForm: () => void;
    setIsNewTaskActive: (isOn: boolean) => void;
    projectList: Project[];
}

const NewTask = (props: NewTaskProps) => {
    // console.log('NewTaskProps: ', props);
    const [error, setError] = useState<string | null>('Opgavenavn skal være på mindst 3 karakterer'); //Change name to validate for and make it a object instead?
    const handleClose = () => {
        props.resetForm();
        props.setIsNewTaskActive(false);
        setError('Opgavenavn skal være på mindst 3 karakterer');
    };
    const handleSubmit = (event) => {
        // window.alert(event.target.value);
        event.preventDefault();
        props.onSave();
        props.resetForm();
        props.setIsNewTaskActive(false);
        setError('opgavenavn skal være på mindst 3 karakterer');
    };
    const handleTaskNameChange = (event) => {
        const newTask = event.target.value;
        if (newTask.length > 2) {
            setError(null);
        } else {
            setError('Opgavenavn skal være på mindst 3 karakterer');
        }
        props.setTaskName(newTask);
    };
    const handleMilestoneChange = (newDate) => {
        props.setMilestone(new Date(newDate.setHours(0, 0, 0, 0)));
    };
    const handleImportanceChange = (event) => {
        props.setImportance(event.target.value);
    };
    const handleDescriptionChange = (event) => {
        props.setDescription(event.target.value);
    };
    const handleTimeframeChange = (event) => {
        props.setTimeframe(event.target.value);
    };
    // const handleObsoleteChange = (event) => {
    //     props.setObsolete(event.target.value);
    // };


    const options = props.projectList.filter((p) => p.id !== 1).map((element) => {
        const value= element.id
        const label= element.projectName
        return {           
         value,
          label,
        }
    })
    const handleProjectFilter = (event) => {
        const project = event ? event.value : undefined;
        props.setProjectId(project)
    }
    return (
        <>
            <div className={'modal' + (props.isNewTaskActive ? ' is-active' : '')}>
                <div className="modal-background" onClick={handleClose}></div>
                <div className="modal-content">
                    <div className="box">
                        <h1 className="title">Tilføj ny opgave</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="column">                                
                            <div className="control is-expanded">
                                    <label className="label">Vælg projekt</label>
                                <Select
                                    name="project"
                                    options={options}
                                    className="basic-single"
                                    classNamePrefix="select"
                                    isClearable={true}
                                    isSearchable={true}
                                    onChange={handleProjectFilter}
                                />
                                <p className="help is-danger">This field is required</p>
                            </div>
                            </div>

                            <div className="column">
                                <div className="control">
                                    <label className="label">Opgave navn</label>
                                    <input
                                        className="input"
                                        type="text"
                                        placeholder="Indsæt projektnavn"
                                        onChange={handleTaskNameChange}
                                        name="taskName"
                                        value={props.taskName}
                                    />
                                </div>
                                <p className="help is-danger">This field is required</p>
                            </div>

                            <div className="field is-grouped">
                                <div className="column is-narrow">
                                    <label className="label">Deadline</label>
                                    <DatePicker
                                        todayButton="Dags dato"
                                        selected={props.milestone}
                                        onChange={handleMilestoneChange} // setTaskDate bliver sat uden tid
                                        locale="da"
                                        showWeekNumbers
                                        className="input"
                                        dateFormat="dd-MM-yyyy"
                                        name="date"
                                        value={props.milestone}
                                        popperPlacement="top-end"
                                    />
                                </div>
                                <div className="column">
                                    <label className="label">Tidsestimat (timer)</label>
                                    <input
                                        className="input"
                                        type="number"
                                        placeholder="Indsæt projektnavn"
                                        onChange={handleTimeframeChange}
                                        name="taskName"
                                        value={props.timeframe}
                                    />
                                </div>
                            </div>
                            <div className="column">
                                <div className="control">
                                    <label className="label">Prioritet</label>
                                    <input
                                        className="input"
                                        type="number"
                                        placeholder="Jo lavere tal jo højere prioritet"
                                        onChange={handleImportanceChange}
                                        name="taskName"
                                        value={props.importance}
                                    />
                                </div>
                            </div>
                            <div className="column">
                                <div className="control">
                                    <label className="label">Beskrivelse af opgave</label>
                                    <input
                                        className="input"
                                        type="text"
                                        placeholder="Indsæt beskrivelse"
                                        onChange={handleDescriptionChange}
                                        name="taskName"
                                        value={props.description}
                                    />
                                </div>
                            </div>

                            {/* <div className="field is-grouped">
                            <div className="column is-narrow">
                                <label className="label">Projekt navn</label>
                                <input
                                    className="input"
                                    type="text"
                                    placeholder="Indsæt projektnavn"
                                    onChange={handleTaskNameChange}
                                    name="taskName"
                                    value={props.taskName}
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
                        </div> */}

                            {/* {error && (
                            <article className="message is-danger is-small">
                                <div className="message-body">{error}</div>
                            </article>
                        )}
                        {!error && (
                            <article className="message is-info is-small">
                                <div className="message-body">{description}</div>
                            </article>
                        )} */}

                            {/* <div className="field is-grouped">
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
                        </div> */}

                            {/* <div className="column">
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
                        </div> */}

                            {/* <div className="column">
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
                        </div> */}

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
export default NewTask;
