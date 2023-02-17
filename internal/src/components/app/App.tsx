import React, { useEffect, useState, useRef } from 'react';
import { Route, Routes } from 'react-router-dom';
import { toHoursAndMinutes } from '../../utils';
import './app.scss';
import SPS, { TimeEntry, Project, User, Task } from '../../SPS';
import Navbar from '../../components/navbar/Navbar';
import Favorites from '../../components/modal/Favorites';
import EditCalendar from '../../components/modal/EditCalendar';
import Complex from '../../pages/complex/Complex';
import Basic from '../../pages/basic/Basic';
import Statistics from '../../pages/statistics/Statistics';
import Projects from '../../pages/admin/Projects';
import Tasks from '../../pages/admin/Tasks';
import Users from '../../pages/admin/Users';
import format from 'date-fns/format';

const App = () => {
    const [user, setUser] = useState<User>(null);
    const [projectsData, setProjectsData] = useState<Project[]>([]); // læser i tabellen projects (returner id og name)
    const [taskDate, setTaskDate] = useState<Date>(new Date()); // valgte dato,
    const [taskStart, setTaskStart] = useState<Date>(null); // valgte dato,
    const [taskEnd, setTaskEnd] = useState<Date>(null); // valgte dato,
    const [timeRegistrationData, setTimeRegistrationData] = useState<TimeEntry[]>([]);
    const [taskData, setTaskData] = useState<Task[]>([]);
    const [isDeletingId, setIsDeletingId] = useState<number>(null);
    const [editEntry, setEditEntry] = useState<TimeEntry>(null);
    const [isFavoriteActive, setIsFavoriteActive] = useState<boolean>(false);
    const [isEditCalendarActive, setIsEditCalendarActive] = useState<boolean>(false);
    const [logo, setLogo] = useState<string>('');
    const sps = useRef<SPS>(new SPS());
    // console.log(sps)
    // const ses = sps.getParam()
    // const isSuperUser =

    // const isSuperUser = mm.getSession().getPrincipal().hasPermission('endpoint.ep_lk_tmm_superbruger');
    // const isLeader = lederadgang (brug dette endpoint til at hente statistikdata fra tmm)
    // const isAdministrator = administrator (brug dette endpoint til at hente userdata fra tmm)

    useEffect(() => {
        const getDataFromSps = async () => {
            await sps.current.initialize();
            const user = sps.current.getUser();
            console.log('sps.current.getUser: ', user);
            setUser(user);
            const siteUrl = sps.current.getParameter('cbinfo.site.url');
            const logoUrl = sps.current.getParameter('module.tasm.logo');
            setLogo(siteUrl + logoUrl);
            const tasks = await sps.current.getTaskData();
            // console.log('tasks: ',tasks)
            setTaskData(tasks);

            const projects: Project[] = await sps.current.getProjectsData();
            console.log('projects: ',projects)
            setProjectsData(projects);
            refresh();
        };
        getDataFromSps();
    }, []);
    /**
     * @description eksistensen af id afgør om det er en update eller insert
     * @param entry
     */
    const onSave = async (entry: TimeEntry) => {
        // eksistensen af id afgør om det er en update eller insert
        if (entry.id) {
            await sps.current.updateTimeRegistration(entry);
            setEditEntry(null);
        } else {
            await sps.current.insertTimeRegistration(entry);
        }
        refresh();
    };
    const onDelete = (id: number) => {
        setIsDeletingId(id);
    };
    const confirmDelete = async () => {
        await sps.current.deleteTimeRegistration(isDeletingId);
        refresh();
        closeModal();
    };
    const onEdit = (e: TimeEntry) => {
        setEditEntry(e);
    };
    const refresh = async () => {
        const timeRegistrationData = await sps.current.getTimeRegistrationData(); //user.shortId
        // console.log(timeRegistrationData)
        setTimeRegistrationData(timeRegistrationData);
    };
    const getTaskDescription = (id: number): string => {
        const entry = timeRegistrationData.find((te) => te.id === id);
        const task = taskData.find((t) => t.id === entry.taskId);
        return (
            toHoursAndMinutes(entry.taskTime) +
            ' - ' +
            task.taskName +
            ' - ' +
            format(entry.taskDate, 'dd-MM-yyyy') +
            ', note: ' +
            entry.note
        );
    };
    const closeModal = () => {
        setIsDeletingId(null);
    };
    const saveFavorites = (favoriteIds: number[]) => {
        sps.current.updateFavorites(favoriteIds);
        const updatedTaskData = [...taskData];
        for (const task of updatedTaskData) {
            task.isFavorite = favoriteIds.includes(task.id);
        }
        setTaskData(updatedTaskData);
        closeFavorites();
    };
    const closeFavorites = () => {
        setIsFavoriteActive(false);
    };
    const editFavorites = () => {
        setIsFavoriteActive(true);
    };
    const onDateChanged = (newTaskDate: Date) => {
        setTaskDate(newTaskDate);
        // console.log(taskDate)
    };
    // const openEditCalendar = () => {
    //     setIsEditCalendarActive(true);
    // };
    // const closeEditCalendar = () => {
    //     setIsEditCalendarActive(false);
    // };
    return (
        <>
            <section className="hero is-info is-small">
                {user && <Navbar user={user} editFavorites={editFavorites} logo={logo} />}
            </section>
            <Routes>
                <Route path="/">
                    <Route
                        index
                        element={
                            <Basic
                                timeRegistrationData={timeRegistrationData}
                                taskDate={taskDate}
                                projectsData={projectsData}
                                user={user}
                                onSave={(entry) => onSave(entry)}
                                editEntry={editEntry}
                                onDelete={(id) => onDelete(id)}
                                onEdit={(e: TimeEntry) => onEdit(e)}
                                taskData={taskData}
                                onDateChanged={(newTaskDate) => onDateChanged(newTaskDate)}
                                taskStart={taskStart}
                                taskEnd={taskEnd}
                            />
                        }
                    />
                    <Route
                        path="/basic"
                        element={
                            <Basic
                                timeRegistrationData={timeRegistrationData}
                                taskDate={taskDate}
                                projectsData={projectsData}
                                user={user}
                                onSave={(entry) => onSave(entry)}
                                editEntry={editEntry}
                                onDelete={(id) => onDelete(id)}
                                onEdit={(e: TimeEntry) => onEdit(e)}
                                taskData={taskData}
                                onDateChanged={(newTaskDate) => onDateChanged(newTaskDate)}
                                taskStart={taskStart}
                                taskEnd={taskEnd}
                            />
                        }
                    />
                    <Route 
                        path="/complex" 
                        element={
                            <Complex 
                                timeRegistrationData={timeRegistrationData}
                                taskDate={taskDate}
                                projectsData={projectsData}
                                taskData={taskData}
                            />
                        } 
                    />
                    <Route path="/statistics" element={<Statistics />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/users" element={<Users />} />
                </Route>
            </Routes>
            {taskData && projectsData && (
                <Favorites
                    isActive={isFavoriteActive}
                    taskList={taskData}
                    onSave={saveFavorites}
                    onClose={closeFavorites}
                    projectList={projectsData}
                />
            )}
            <div className={'modal' + (isDeletingId ? ' is-active' : '')}>
                <div className="modal-background" onClick={closeModal}></div>
                <div className="modal-content">
                    <div className="box">
                        {isDeletingId && (
                            <p>
                                Vil du slette de registrede tid? <br />
                                {getTaskDescription(isDeletingId)}
                            </p>
                        )}
                        <button className="button is-danger" onClick={confirmDelete}>
                            Slet
                        </button>
                        <button className="button" onClick={closeModal}>
                            Annuler
                        </button>
                    </div>
                </div>
                <button className="modal-close is-large" aria-label="close" onClick={closeModal}></button>
            </div>
            <EditCalendar
                isActive={isEditCalendarActive}
                onSave={function (eventIds: number[]): void {
                    throw new Error('Function not implemented.');
                }}
                onClose={function (): void {
                    throw new Error('Function not implemented.');
                }}
            />
        </>
    );
};

export default App;
