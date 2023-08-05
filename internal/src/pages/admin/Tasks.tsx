import React, { useEffect, useState, useRef } from 'react';
import TaskTable from '../../components/table/TaskTable';
import SPS, { Task, Project } from '../../SPS';
import Icon from '@mdi/react';
// import { mdiEyeOff, mdiEye, mdiMagnify, mdiTablePlus, mdiPlus } from '@mdi/js';
import { mdiEyeOff, mdiEye, mdiMagnify, mdiTablePlus } from '@mdi/js';
import NewTask from '../../components/modal/NewTask';
import { endOfYear } from 'date-fns';
import Select from 'react-select';

interface TaskProps {
    // sps: SPS;
    projects: Project[];
}
const Tasks = (props: TaskProps) => {
    // console.log('TaskProps: ',props)
    const [tasks, setTasks] = useState<Task[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [hideObsolete, setHideObsolete] = useState<boolean>(true);
    const [obsolete, setObsolete] = useState<boolean>(false);
    const [searchVal, setSearchVal] = useState('');
    const [isNewTaskActive, setIsNewTaskActive] = useState<boolean>(false);
    const [editEntry, setEditEntry] = useState<number>(null); // indeholder id
    const [projectId, setProjectId] = useState<number>(1);
    const [taskName, setTaskName] = useState<string>('');
    const [milestone, setMilestone] = useState<Date>(endOfYear(new Date())); // valgte dato,
    const [importance, setImportance] = useState<number>(0);
    const [timeframe, setTimeframe] = useState<number>(0);
    const [description, setDescription] = useState<string>('');
    const [projectFilter, setProjectFilter] = useState<number>(undefined); // indeholder id
    const [reload, setReload] = useState<boolean>(false);

    const refresh = ()=>{
        const toggleReload = !reload
        setReload(toggleReload)
    }
    const resetForm = () => {
        setEditEntry(null);
        setProjectId(1);
        setTaskName('');
        setMilestone(endOfYear(new Date()));
        setImportance(0);
        setTimeframe(0);
        setDescription('');
        setObsolete(false);
        setError(null);
    };

    const sps = useRef<SPS>(new SPS()); // kan evt. erstattes med props.sps

    useEffect(() => {
        const getDataFromSps = async () => {
            await sps.current.initialize(); // kan evt. erstattes med props.sps
            const tasksGross: Task[] = await sps.current.getAdminTasksData(); // kan evt. erstattes med props.sps
            // const tasksGross: Task[] = await props.sps.getAdminProjectsData();
            const tasksObsolete = hideObsolete ? tasksGross.filter((o) => o.obsolete === false) : tasksGross;

            const filterByProject = projectFilter ? tasksObsolete.filter((p) => p.projectId === projectFilter) : tasksObsolete;

            const filterBySearch = searchVal
                ? filterByProject.filter((item) => item.taskName.toLowerCase().includes(searchVal.toLowerCase()))
                : filterByProject;
            setTasks(filterBySearch);
        };
        getDataFromSps();
    }, [hideObsolete, searchVal, projectFilter, reload]);

    const onSave = async () => {
        const entry: Task = {
            projectId,
            taskName,
            milestone,
            importance,
            timeframe,
            description,
            obsolete,
        };
        // eksistensen af editEntry afgør om det er en update eller insert
        if (editEntry) {
            entry.id = editEntry;
            await sps.current.updateTask(entry);
            setEditEntry(null);
        } else {
            await sps.current.insertTask(entry);
        }
        refresh();
    };
    const onInput = (e) => setSearchVal(e.target.value);

    const onClear = () => {
        setSearchVal('');
    };

    const toggleObsolete = () => {
        setHideObsolete(!hideObsolete);
    };

    const obsoleteIcon = hideObsolete ? <Icon path={mdiEye} size={1} /> : <Icon path={mdiEyeOff} size={1} />;
    const obsoleteStyle = hideObsolete ? 'is-outlined' : '';

    const handleProjectFilter = (event) => {
        const project = event ? event.value : undefined;
        setProjectFilter(project)
    }

    const options = props.projects.map((element) => {
        const value= element.id
        const label= element.projectName
        return {           
         value,
          label,
        }
    })

    const handleNewTask = ()=>{
        setIsNewTaskActive(true)
        setError('Opgavenavn skal være på mindst 3 karakterer')
    }
    return (
        <>
            <section className="section">
                <div className="columns">
                    <div className="column is-full">
                        <div className="field is-grouped">
                            <p className="control">
                                <button className="button is-info" onClick={handleNewTask}>
                                    <Icon path={mdiTablePlus} size={1} />
                                </button>
                            </p>
                            <div className="control is-expanded">
                                <Select
                                    name="project"
                                    options={options}
                                    className="basic-single"
                                    classNamePrefix="select"
                                    isClearable={true}
                                    isSearchable={true}
                                    onChange={handleProjectFilter}
                                    placeholder='Filtrer på projekt'
                                />
                            </div>
                            <div className="field has-addons has-addons-right control is-expanded">
                                <div className="control has-icons-left is-expanded">
                                    <input
                                        className="input"
                                        type="text"
                                        placeholder={'Søg på opgave navn'}
                                        onInput={onInput}
                                        name="search"
                                        value={searchVal}
                                    />
                                    <span className="icon is-medium is-left">
                                        <Icon path={mdiMagnify} size={1} />
                                    </span>
                                </div>
                                <div className="control">
                                    <a className="button">
                                        <button className="delete" onClick={onClear}></button>
                                    </a>
                                </div>
                            </div>
                            <p className="control">
                                <button className={'button is-info ' + obsoleteStyle} type="button" onClick={toggleObsolete}>
                                    {obsoleteIcon}
                                </button>
                            </p>
                        </div>
                        {props.projects.length>0 && (
                        <TaskTable 
                            tasks={tasks} 
                            projects={props.projects} 
                            projectId={projectId}
                            taskName={taskName}
                            milestone={milestone}
                            importance={importance}
                            timeframe={timeframe}
                            description={description}
                            obsolete={obsolete}
                            setProjectId={setProjectId}
                            setTaskName={setTaskName}
                            setMilestone={setMilestone}
                            setImportance={setImportance}
                            setTimeframe={setTimeframe}
                            setDescription={setDescription}
                            setObsolete={setObsolete}
                            onSave={onSave}
                            setEditEntry={setEditEntry}
                            resetForm={resetForm}
                            setIsNewTaskActive={setIsNewTaskActive}
                            error={error}
                            setError={setError}
                        />)}
                    </div>
                </div>
            </section>
                <NewTask
                    isNewTaskActive={isNewTaskActive}
                    projectId={projectId}
                    taskName={taskName}
                    milestone={milestone}
                    importance={importance}
                    timeframe={timeframe}
                    description={description}
                    obsolete={obsolete}
                    setProjectId={setProjectId}
                    setTaskName={setTaskName}
                    setMilestone={setMilestone}
                    setImportance={setImportance}
                    setTimeframe={setTimeframe}
                    setDescription={setDescription}
                    setObsolete={setObsolete}
                    onSave={onSave}
                    resetForm={resetForm}
                    setIsNewTaskActive={setIsNewTaskActive}
                    projectList={props.projects}
                    error={error}
                    setError={setError}
                />
        </>
    );
};

export default Tasks;
