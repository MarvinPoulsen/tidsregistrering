// Import statements
import React, { useEffect, useState, useRef } from 'react';
import ProjectTable from '../../components/table/ProjectTable';
import SPS, { Project } from '../../SPS';
import Icon from '@mdi/react';
// import { mdiEyeOff, mdiEye, mdiMagnify, mdiTablePlus, mdiPlus } from '@mdi/js';
import { mdiEyeOff, mdiEye, mdiMagnify, mdiTablePlus } from '@mdi/js';
import NewProject from '../../components/modal/NewProject';
import { endOfYear } from 'date-fns';



interface ProjectProps {
    sps: SPS;
    // projects: Project[];
    formInfo?: () => void;
}
const Projects = (props: ProjectProps) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [obsolete, setObsolete] = useState<boolean>(true);
    const [searchVal, setSearchVal] = useState('');
    const [isNewProjectActive, setIsNewProjectActive] = useState<boolean>(false);
    

    const [editEntry, setEditEntry] = useState<number>(null); // indeholder id
    const [teamId, setTeamId] = useState<number>(0);
    const [horizon, setHorizon] = useState<Date>(endOfYear(new Date())); // valgte dato,
    const [importance, setImportance] = useState<number>(0);
    const [projectName, setProjectName] = useState<string>('');
    const [sbsysId, setSbsysId] = useState<number>(0);
    const [timeframe, setTimeframe] = useState<number>(0);


    const resetForm = () => {
        setEditEntry(null);
        setTeamId(0);
        setHorizon(endOfYear(new Date()));
        setImportance(0);
        setProjectName('');
        setSbsysId(0);
        setTimeframe(0);
        setObsolete(true);
        setError(null);
    };


    const sps = useRef<SPS>(new SPS()); // kan evt. erstattes med props.sps
    if (error) {
        console.log(error);
    }
    useEffect(() => {
        const getDataFromSps = async () => {
            await sps.current.initialize(); // kan evt. erstattes med props.sps
            const projectsGross: Project[] = await sps.current.getAdminProjectsData(); // kan evt. erstattes med props.sps
            // const projectsGross: Project[] = await props.sps.getAdminProjectsData();
            const projectsObsolete = obsolete ? projectsGross.filter((o) => o.obsolete === false) : projectsGross;

            const filterBySearch = searchVal
                ? projectsObsolete.filter((item) => item.projectName.toLowerCase().includes(searchVal.toLowerCase()))
                : projectsObsolete;
            setProjects(filterBySearch);
        };
        getDataFromSps();
    }, [obsolete, searchVal]);



    const onSave = async () => {
        const entry: Project = {
            teamId,
            projectName,
            horizon,
            importance,
            timeframe,
            sbsysId,
            obsolete,
        };
        // eksistensen af editEntry afgør om det er en update eller insert
        if (editEntry) {
            entry.id = editEntry;
            await props.sps.updateProject(entry);
            setEditEntry(null);
        } else {
            await props.sps.insertProject(entry);
        }
        // refresh();
    };
    const onInput = (e) => setSearchVal(e.target.value);

    const onClear = () => {
      setSearchVal('');
    };
  
    const toggleObsolete = () => {
        setObsolete(!obsolete);
    };

    // const obsoleteText = obsolete ? 'Vis forældede projekter' : 'Skjul forældede projekter';
    const obsoleteIcon = obsolete ? <Icon path={mdiEye} size={1} /> : <Icon path={mdiEyeOff} size={1} />;
    const obsoleteStyle = obsolete ? 'is-outlined' : '';

    return (
        <>
            <section className="section">
                <div className="columns">
                    <div className="column is-half">
                        <div className="field is-grouped">
                            <p className="control">
                                <button 
                                    className="button"
                                    // className="button is-brand"
                                    onClick={() => setIsNewProjectActive(true)}
                                >
                                    <Icon path={mdiTablePlus} size={1} /></button>
                            </p>
                                <div className="field has-addons has-addons-right control is-expanded">
                                    <div className="control has-icons-left is-expanded">
                                        <input
                                            className="input"
                                            type="text"
                                            placeholder={"Søg på projekt navn"}
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
                                            <button 
                                                className="delete"
                                                onClick={onClear}                                                
                                            >                                                
                                            </button>
                                        </a>
                                    </div>
                                </div>
                            <p className="control">
                                <button className={'button ' + obsoleteStyle} type="button" onClick={toggleObsolete}>
                                {/* <button className={'button is-info ' + obsoleteStyle} type="button" onClick={toggleObsolete}> */}
                                    {obsoleteIcon}
                                </button>
                            </p>
                        </div>
                        <ProjectTable 
                            projects={projects}
                            teamId={teamId}
                            setTeamId={setTeamId}
                            projectName={projectName}
                            setProjectName={setProjectName}
                            horizon={horizon}
                            setHorizon={setHorizon}
                            importance={importance}
                            setImportance={setImportance}
                            timeframe={timeframe}
                            setTimeframe={setTimeframe}
                            sbsysId={sbsysId}
                            setSbsysId={setSbsysId}
                            obsolete={obsolete}
                            setObsolete={setObsolete}
                            setEditEntry={setEditEntry}
                            resetForm={resetForm}
                            setIsNewProjectActive={setIsNewProjectActive}
                            error={error}
                            setError={setError}
                        />
                    </div>
                </div>
            </section>
            {projects && (
                <NewProject
                    isNewProjectActive={isNewProjectActive}
                    projectName={projectName}
                    teamId={teamId}
                    horizon={horizon}
                    importance={importance}
                    timeframe={timeframe}
                    sbsysId={sbsysId}
                    obsolete={obsolete}


                    setTeamId={setTeamId}
                    setHorizon={setHorizon}
                    setImportance={setImportance}
                    setProjectName={setProjectName}
                    setSbsysId={setSbsysId}
                    setTimeframe={setTimeframe}
                    setObsolete={setObsolete}
                    onSave={onSave}
                    resetForm={resetForm}
                    setIsNewProjectActive={setIsNewProjectActive}
                    error={error}
                    setError={setError}
                    
                />
            )}
        </>
    );
};

export default Projects;
