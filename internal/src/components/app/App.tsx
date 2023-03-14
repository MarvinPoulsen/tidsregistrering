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
    const [logo, setLogo] = useState<string>('');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [projects, setProjects] = useState<Project[]>([]); // læser i tabellen projects (returner id og name)
    const [registrations, setRegistrations] = useState<TimeEntry[]>([]);
    const [taskDate, setTaskDate] = useState<Date>(new Date()); // valgte dato,
    const [taskTime, setTaskTime] = useState<number>(30)
    const [taskStart, setTaskStart] = useState<Date>(new Date(new Date().setHours(8, 0, 0, 0))); // valgte dato,
    const [taskEnd, setTaskEnd] = useState<Date>(new Date(new Date().setHours(8, 30, 0, 0))); // valgte dato,
    const [note, setNote] = useState<string>('');
    const [taskId, setTaskId] = useState<number>(1);
    const [allDay, setAllDay] = useState<boolean>(true)

    const [editEntry, setEditEntry] = useState<number>(null); // indeholder id 
    
    const [error, setError] = useState<string | null>(null);
    const [isDeletingId, setIsDeletingId] = useState<number>(null);
    const [isFavoriteActive, setIsFavoriteActive] = useState<boolean>(false);
    const [isEditCalendarActive, setIsEditCalendarActive] = useState<boolean>(false);
    const sps = useRef<SPS>(new SPS());
    if (error){console.log(error)}
    // const ses = sps.getParam()
    // const isSuperUser =

    // const isSuperUser = mm.getSession().getPrincipal().hasPermission('endpoint.ep_lk_tmm_superbruger');
    // const isLeader = lederadgang (brug dette endpoint til at hente statistikdata fra tmm)
    // const isAdministrator = administrator (brug dette endpoint til at hente userdata fra tmm)

    useEffect(() => {
        const getDataFromSps = async () => {
            await sps.current.initialize();
            const user = sps.current.getUser();
            setUser(user);
            const siteUrl = sps.current.getParameter('cbinfo.site.url');
            const logoUrl = sps.current.getParameter('module.tasm.logo');
            setLogo(siteUrl + logoUrl);
            const taskList = await sps.current.getTaskData();
            setTasks(taskList);

            const projectList: Project[] = await sps.current.getProjectsData();
            setProjects(projectList);
            refresh();
        };
        getDataFromSps();
    }, []);
    const refresh = async () => {
        const registrationData = await sps.current.getTimeRegistrationData(); //user.shortId
        setRegistrations(registrationData);
    };

    /**
     * @description eksistensen af editEntry afgør om det er en update eller insert
     * - editEntry {number|null} - id'et fra registrations tabellen
     */
    const onSave = async () => {
        const entry: TimeEntry ={
            userId: user.shortid,
            taskDate,
            taskTime,
            taskId,
            taskStart,
            taskEnd,
            note,
            allDay
        }
        // eksistensen af editEntry afgør om det er en update eller insert
        if (editEntry) {
            entry.id = editEntry;
            await sps.current.updateTimeRegistration(entry);
            setEditEntry(null);
        }else {
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
    const getTaskDescription = (id: number): string => {
        const entry = registrations.find((te) => te.id === id);
        const task = tasks.find((t) => t.id === entry.taskId);
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
        const updatedTasks = [...tasks];
        for (const task of updatedTasks) {
            task.isFavorite = favoriteIds.includes(task.id);
        }
        setTasks(updatedTasks);
        setIsFavoriteActive(false);
    };
    
    const resetForm = ()=> {
        setEditEntry(null);
        setTaskTime(30);
        setTaskId(1);
        setTaskStart(new Date(taskDate.setHours(8, 0, 0, 0)));
        setTaskEnd(new Date(taskDate.setHours(8, 30, 0, 0)));
        setNote('');
        setAllDay(true)
        setError(null);
    }

    return (
        <>
            <section className="hero is-info is-small">
                {user && <Navbar user={user} setIsFavoriteActive={setIsFavoriteActive} logo={logo} />}
            </section>
            <Routes>
                <Route path="/">
                    <Route
                        index
                        element={
                            <Basic
                                registrations={registrations}
                                taskDate={taskDate}
                                projects={projects}
                                user={user}
                                onSave={onSave}
                                editEntry={editEntry}
                                setEditEntry={setEditEntry}
                                onDelete={(id) => onDelete(id)}
                                tasks={tasks}
                                setTaskDate={setTaskDate}
                                taskStart={taskStart}
                                taskEnd={taskEnd}
                                taskTime={taskTime}
                                setTaskTime={setTaskTime}
                                note={note}
                                setNote={setNote}
                                taskId={taskId}
                                setTaskId={setTaskId}
                                setAllDay={setAllDay}
                                resetForm={resetForm}
                            />
                        }
                    />
                    <Route
                        path="/basic"
                        element={
                            <Basic
                                registrations={registrations}
                                taskDate={taskDate}
                                projects={projects}
                                user={user}
                                onSave={onSave}
                                editEntry={editEntry}
                                setEditEntry={setEditEntry}
                                onDelete={(id) => onDelete(id)}
                                tasks={tasks}
                                setTaskDate={setTaskDate}
                                taskStart={taskStart}
                                taskEnd={taskEnd}
                                taskTime={taskTime}
                                setTaskTime={setTaskTime}
                                note={note}
                                setNote={setNote}
                                resetForm={resetForm}
                                taskId={taskId}
                                setTaskId={setTaskId}
                                setAllDay={setAllDay}
                            />
                        }
                    />
                    <Route 
                        path="/complex" 
                        element={
                            <Complex 
                                registrations={registrations}
                                taskDate={taskDate}
                                projects={projects}
                                tasks={tasks}
                                setEditEntry={setEditEntry}
                                setTaskDate={setTaskDate}
                                setTaskStart={setTaskStart}
                                setTaskEnd={setTaskEnd}
                                setIsEditCalendarActive={setIsEditCalendarActive}
                                taskTime={taskTime}
                                setTaskTime={setTaskTime}
                                note={note}
                                setNote={setNote}
                                resetForm={resetForm}
                                taskId={taskId}
                                setTaskId={setTaskId}
                                setAllDay={setAllDay}
                            />
                        } 
                    />
                    <Route path="/statistics" element={<Statistics />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/users" element={<Users />} />
                </Route>
            </Routes>
            {tasks && projects && (
                <Favorites
                    isActive={isFavoriteActive}
                    taskList={tasks}
                    onSave={saveFavorites}
                    setIsFavoriteActive={setIsFavoriteActive}
                    projectList={projects}
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
            {tasks && (
                <EditCalendar
                    isActive={isEditCalendarActive}
                    date={taskDate}
                    onSave={onSave}
                    setIsEditCalendarActive={setIsEditCalendarActive}
                    start={taskStart}
                    end={taskEnd}
                    taskList={tasks}
                    user={user}
                    editEntry={editEntry}
                    note={note}
                    setNote={setNote}
                    resetForm={resetForm}
                    taskId={taskId}
                    setTaskId={setTaskId}
                    allDay={allDay}
                    setAllDay={setAllDay}
                />
            )}
        </>
    );
};

export default App;
