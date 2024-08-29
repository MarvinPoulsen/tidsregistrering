// Import statements
import React, { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker, { registerLocale } from 'react-datepicker';
import da from 'date-fns/locale/da'; // the locale you want
registerLocale('da', da); // register it with the name you want

interface NewProjectProps {
    isNewProjectActive: boolean;
    projectName: string;
    setProjectName: (projectName) => void;
    teamId: number;
    setTeamId: (teamId) => void;
    horizon: Date;
    setHorizon: (horizon) => void;
    importance: number;
    setImportance: (importance) => void;
    sbsysId: number;
    setSbsysId: (sbsysId) => void;
    timeframe: number;
    setTimeframe: (timeframe) => void;
    obsolete: boolean;
    setObsolete: (isObsolete: boolean) => void;
    onSave: () => void;
    resetForm: () => void;
    setIsNewProjectActive: (isOn: boolean) => void;
    error: string;
    setError: (errorDescription) => void;
}

const NewProject = (props: NewProjectProps) => {
    const [error, setError] = useState<string | null>('Projektnavn skal være på mindst 3 karakterer'); //Change name to validate for and make it a object instead?
    const handleClose = () => {
        props.resetForm();
        props.setIsNewProjectActive(false);
        setError('Projektnavn skal være på mindst 3 karakterer');
    };
    const handleSubmit = (event) => {
        // window.alert(event.target.value);
        event.preventDefault();
        props.onSave();
        props.resetForm();
        props.setIsNewProjectActive(false);
        setError('Projektnavn skal være på mindst 3 karakterer');
    };
    const handleProjectNameChange = (event) => {
        const newProject = event.target.value;
        if (newProject.length > 2) {
            setError(null);
        }else {
            setError('Projektnavn skal være på mindst 3 karakterer');

        }
        props.setProjectName(newProject);
        
    };
    const handleTeamIdChange = (event) => {
        props.setTeamId(event.target.value);
    };
    const handleHorizonChange = (newDate) => {
        props.setHorizon(new Date(newDate.setHours(0, 0, 0, 0)));
    };
    const handleImportanceChange = (event) => {
        props.setImportance(event.target.value);
    };
    const handleSbsysIdChange = (event) => {
        props.setSbsysId(event.target.value);
    };
    const handleTimeframeChange = (event) => {
        props.setTimeframe(event.target.value);
    };
    // const handleObsoleteChange = (event) => {
    //     props.setObsolete(event.target.value);
    // };

    const mandatoryProjectName = props.error ? <p className="help is-danger">This field is required</p> : '';

    return (
        <>
            <div className={'modal' + (props.isNewProjectActive ? ' is-active' : '')}>
                <div className="modal-background" onClick={handleClose}></div>
                <div className="modal-content">
                    <div className="box">
                        <h1 className="title">Tilføj nyt projekt</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="column">
                                <div className="control">
                                    <label className="label">Projekt navn</label>
                                    <input
                                        className="input"
                                        type="text"
                                        placeholder="Indsæt projektnavn"
                                        onChange={handleProjectNameChange}
                                        name="projectName"
                                        value={props.projectName}
                                    />
                                </div>
                                {mandatoryProjectName}
                            </div>

                            <div className="column">
                                <div className="control">
                                    <label className="label">Gruppe/team</label>
                                    <input
                                        className="input"
                                        type="text"
                                        placeholder="Gruppe projektet tilhører"
                                        onChange={handleTeamIdChange}
                                        name="projectName"
                                        value={props.teamId}
                                    />
                                </div>
                            </div>

                            <div className="field is-grouped">
                                <div className="column is-narrow">
                                    <label className="label">Deadline</label>
                                    <DatePicker
                                        todayButton="Dags dato"
                                        selected={props.horizon}
                                        onChange={handleHorizonChange} // setTaskDate bliver sat uden tid
                                        locale="da"
                                        showWeekNumbers
                                        className="input"
                                        dateFormat="dd-MM-yyyy"
                                        name="date"
                                        // value={props.horizon}
                                        popperPlacement="top-end"
                                    />
                                </div>
                                <div className="column">
                                    <label className="label">Tidsforbrug (timer)</label>
                                    <input
                                        className="input"
                                        type="number"
                                        placeholder="Indsæt projektnavn"
                                        onChange={handleTimeframeChange}
                                        name="projectName"
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
                                        name="projectName"
                                        value={props.importance}
                                    />
                                </div>
                            </div>
                            <div className="column">
                                <div className="control">
                                    <label className="label">SBSYS ID</label>
                                    <input
                                        className="input"
                                        type="number"
                                        placeholder="Indsæt SBSYS id"
                                        onChange={handleSbsysIdChange}
                                        name="projectName"
                                        value={props.sbsysId}
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
                                    onChange={handleProjectNameChange}
                                    name="projectName"
                                    value={props.projectName}
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
                            <article className="message is-small">
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
export default NewProject;
