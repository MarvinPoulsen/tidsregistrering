// Import statements
import React from 'react';
import { Project } from '../../SPS';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker, { registerLocale } from 'react-datepicker';
import da from 'date-fns/locale/da'; // the locale you want
registerLocale('da', da); // register it with the name you want
import Select from 'react-select';

interface EditUserProps {
    isEditUserActive: boolean;
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
    setIsEditUserActive: (isOn: boolean) => void;
    projectList: Project[];
    error: string;
    setError: (errorDescription) => void;
}

const EditUser = (props: EditUserProps) => {
    // console.log('EditUserProps: ', props);
    // const [error, setError] = useState<string | null>('Opgavenavn skal være på mindst 3 karakterer'); //Change name to validate for and make it a object instead?
    const handleClose = () => {
        props.resetForm();
        props.setIsEditUserActive(false);
        props.setError('Opgavenavn skal være på mindst 3 karakterer');
    };
    const handleSubmit = (event) => {
        // window.alert(event.target.value);
        event.preventDefault();
        props.onSave();
        props.resetForm();
        props.setIsEditUserActive(false);
        props.setError('opgavenavn skal være på mindst 3 karakterer');
    };
    const handleTaskNameChange = (event) => {
        const newTask = event.target.value;
        if (newTask.length > 2) {
            props.setError(null);
        } else {
            props.setError('Opgavenavn skal være på mindst 3 karakterer');
        }
        props.setTaskName(newTask);
    };
    const handleMilestoneChange = (newDate) => {
        props.setMilestone(new Date(newDate.setHours(0, 0, 0, 0)));
    };
    const handleImportanceChange = (event) => {
        props.setImportance(parseInt(event.target.value));
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

    const options = props.projectList
        .filter((p) => p.id !== 1)
        .map((element) => {
            const value = element.id;
            const label = element.projectName;
            return {
                value,
                label,
            };
        });
    const handleProjectFilter = (event) => {
        const project = event ? event.value : undefined;
        props.setProjectId(project);
    };

    const mandatoryProject = props.error ? <p className="help is-danger">This field is required</p> : '';
    const mandatoryTaskName = props.error ? <p className="help is-danger">This field is required</p> : '';

    return (
        <>
            <div className={'modal' + (props.isEditUserActive ? ' is-active' : '')}>
                <div className="modal-background" onClick={handleClose}></div>
                <div className="modal-content">
                    <div className="box">
                        <h1 className="title">Tilføj ny opgave</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="column">
                                <div className="control is-expanded">
                                    <label className="label">Vælg det projekt opgaven tilhører</label>
                                    <Select
                                        name="project"
                                        options={options}
                                        className="basic-single"
                                        classNamePrefix="select"
                                        isClearable={true}
                                        isSearchable={true}
                                        onChange={handleProjectFilter}
                                        placeholder="Vælg projekt..."
                                        value={options[options.findIndex((o) => o.value === props.projectId)]}
                                    />
                                    {mandatoryProject}
                                </div>
                            </div>

                            <div className="column">
                                <div className="control">
                                    <label className="label">Navngiv opgaven</label>
                                    <input
                                        className="input"
                                        type="text"
                                        placeholder="Indsæt opgavenavn (3-254 tegn)"
                                        onChange={handleTaskNameChange}
                                        name="taskName"
                                        value={props.taskName}
                                    />
                                </div>
                                {mandatoryTaskName}
                            </div>

                            <div className="column">
                                <div className="control">
                                    <label className="label">Beskrivelse af opgave</label>
                                    <textarea
                                        className="textarea"
                                        placeholder="Indsæt beskrivelse"
                                        rows={2}
                                        onChange={handleDescriptionChange}
                                        name="description"
                                        value={props.description}
                                    />
                                </div>
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
                                        // value={props.milestone}
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
                                        name="timeframe"
                                        value={props.timeframe}
                                    />
                                </div>
                            </div>

                            <div className="field">
                                <label className="label">Prioritet</label>
                                <div className="control radio-list">
                                    <label className="radio">
                                        <input
                                            type="radio"
                                            name="0"
                                            id="1"
                                            value={0}
                                            checked={props.importance === 0}
                                            onChange={handleImportanceChange}
                                        />
                                        Ingen
                                    </label>
                                    <label className="radio">
                                        <input
                                            type="radio"
                                            name="1"
                                            id="2"
                                            value={1}
                                            checked={props.importance === 1}
                                            onChange={handleImportanceChange}
                                        />
                                        Høj
                                    </label>
                                    <label className="radio">
                                        <input
                                            type="radio"
                                            name="2"
                                            id="3"
                                            value={2}
                                            checked={props.importance === 2}
                                            onChange={handleImportanceChange}
                                        />
                                        Mellem
                                    </label>
                                    <label className="radio">
                                        <input
                                            type="radio"
                                            name="3"
                                            id="4"
                                            value={3}
                                            checked={props.importance === 3}
                                            onChange={handleImportanceChange}
                                        />
                                        Lav
                                    </label>
                                </div>
                            </div>

                            <div className="column is-narrow">
                                <div className="field is-grouped">
                                    <button className="button is-success" disabled={!!props.error}>
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
export default EditUser;
