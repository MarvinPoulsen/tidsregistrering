import React, { FC, useEffect, useState } from 'react';
import './app.scss';

import Navbar from '../navbar/Navbar';
import TimeRegistration from '../timeregistration/TimeRegistration';
import TimeTable from '../timetable/TimeTable';
import TimeChart from '../timechart/TimeChart';
import SPS, { TimeEntry } from '../../SPS';
import format from 'date-fns/format';
import { isSameDay } from 'date-fns';
import Favorites from '../modal/Favorites';
import Slider from '../slider/Slider';
import PiechartNoLegend from '../timechart/PiechartNoLegend';
import LegendTable from '../timechart/LegendTable';
import { toHoursAndMinutes } from '../../utils';
let sps: SPS;

interface StackedDataSeries {
    name: string;
    values: number[];
    stack: string;
}
interface PieGroup {
    name: string;
    value: number;
    on: boolean;
}

const App: FC = () => {
    const [user, setUser] = useState(null);
    const [timeRegistrationData, setTimeRegistrationData] = useState(null);
    const [taskData, setTaskData] = useState(null);
    const [isDeletingId, setIsDeletingId] = useState<number>(null);
    const [editEntry, setEditEntry] = useState();
    const [isFavoriteActive, setIsFavoriteActive] = useState<boolean>(false);
    const [projectsData, setProjectsData] = useState(null);
    const [legendData, setLegendData] = useState<PieGroup[]>([]);
    const [taskDate, setTaskDate] = useState(new Date());
    const [range, setRange] = useState(14);
    useEffect(async () => {
        sps = new SPS();
        await sps.initialize();
        const user = sps.getUser();
        setUser(user);

        const tasks = await sps.getTaskData();
        setTaskData(tasks);

        const projects = await sps.getProjectsData();
        setProjectsData(projects);
        refresh();
        const data: any[] = [
            ...new Set(
                projects.map((item) => {
                    return {
                        name: item.name,
                        on: true,
                    };
                })
            ),
        ];
        setLegendData(data);
    }, []);
    const onSave = async (entry: TimeEntry) => {
        // eksistensen af id afgør om det er en update eller insert
        if (entry.id) {
            await sps.updateTimeRegistration(entry);
            setEditEntry(null);
        } else {
            await sps.insertTimeRegistration(entry);
        }
        refresh();
    };
    const onDelete = (id: number) => {
        setIsDeletingId(id);
    };
    const confirmDelete = async () => {
        await sps.deleteTimeRegistration(isDeletingId);
        refresh();
        closeModal();
    };
    const onEdit = (e: TimeEntry) => {
        setEditEntry(e);
    };
    const refresh = async () => {
        const timeRegistrationData = await sps.getTimeRegistrationData(); //user.shortId
        setTimeRegistrationData(timeRegistrationData);
    };
    const closeModal = () => {
        setIsDeletingId(null);
    };
    const getTaskDescription = (id: number): string => {
        const entry = timeRegistrationData.find((te) => te.id === id);
        const task = taskData.find((t) => t.id === entry.taskId);
        return (
            toHoursAndMinutes(entry.time) +
            ' - ' +
            task.name +
            ' - ' +
            format(entry.date, 'dd-MM-yyyy') +
            ', note: ' +
            entry.note
        );
    };
    const saveFavorites = (favoriteIds: number[]) => {
        sps.updateFavorites(favoriteIds);
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

    const filteredTasks =
        timeRegistrationData &&
        timeRegistrationData.filter((te) => isSameDay(te.date, taskDate));

    let endDate = new Date(taskDate);
    endDate.setHours(0, 0, 0, 0);
    let startDate = new Date(endDate);
    const dateRange = range - 1;
    startDate.setDate(startDate.getDate() - dateRange);
    const filterData =
        timeRegistrationData &&
        timeRegistrationData.filter((a) => {
            const lookupDate = new Date(a.date);
            return lookupDate >= startDate && lookupDate <= endDate;
        });

    const tasks =
        filterData &&
        filterData.map((element) => {
            const task = taskData.find((t) => t.id === element.taskId);
            const project = projectsData.find((p) => p.id === task.projectId);
            return {
                taskDate: element.date,
                taskTime: element.time,
                // taskName: task.name,
                // projectId: task.projectId,
                projectName: project.name,
            };
        });

    const projects: any[] = tasks && [
        ...new Set(tasks.map((item) => item.projectName)),
    ];

    let dataSeries: StackedDataSeries[] = [];
    let pieGroups: PieGroup[] = [];
    projects &&
        projects.forEach((element) => {
            const filteredProjects = tasks.filter(
                (p) => p.projectName === element
            );
            let dateCopy = new Date(taskDate.getTime());
            dateCopy.setDate(dateCopy.getDate() - dateRange);

            let values: number[] = [];
            let sum: number = 0;
            for (let i = 0; i <= dateRange; i++) {
                let filteredByDate = filteredProjects.filter((d) =>
                    isSameDay(d.taskDate, dateCopy)
                );
                values.push(
                    filteredByDate.reduce(
                        (total, currentItem) =>
                            (total = total + (currentItem.taskTime || 0)),
                        0
                    )
                );
                sum += filteredByDate.reduce(
                    (total, currentItem) =>
                        (total = total + (currentItem.taskTime || 0)),
                    0
                );
                dateCopy.setDate(dateCopy.getDate() + 1);
            }
            dataSeries.push({ name: element, values, stack: '0' });
            pieGroups.push({
                name: element,
                value: sum,
                on: legendData.find((p) => p.name === element).on,
            });
        });

    let labels: string[][] = [];
    for (let i = 0; i <= dateRange; i++) {
        const labelPair: string[] = [];
        labelPair.push(
            new Intl.DateTimeFormat('da-DK', { weekday: 'short' }).format(
                startDate
            )
        );
        labelPair.push(
            startDate.toLocaleDateString('da-DK', {
                month: 'short',
                day: 'numeric',
            })
        );
        labels.push(labelPair);
        startDate.setDate(startDate.getDate() + 1);
    }

    const onLegendRowToggle = (projectName: string) => {
        const updatedlegendData = [...legendData];
        const project = updatedlegendData.find((p) => p.name === projectName);
        project.on = !project.on;
        setLegendData(updatedlegendData);
    };

    return (
        <>
            <section className="hero is-info is-small">
                {user && <Navbar user={user} editFavorites={editFavorites} />}
            </section>
            <section className="section">
                <div className="columns">
                    <div className="column is-full">
                        {taskData && (
                            <TimeRegistration
                                onDateChanged={setTaskDate}
                                date={taskDate}
                                data={taskData}
                                userId={user.shortid}
                                onSave={onSave}
                                editEntry={editEntry}
                            />
                        )}
                    </div>
                </div>
                <div className="columns">
                    <div className="column is-half">
                        {timeRegistrationData && (
                            <TimeTable
                                data={filteredTasks}
                                taskData={taskData}
                                onDelete={onDelete}
                                onEdit={onEdit}
                            />
                        )}
                    </div>
                    <div className="column">
                        <div className="block">
                            <Slider
                                onRangeChange={setRange}
                                maxValue={90}
                                minValue={7}
                                value={range}
                            />
                            {timeRegistrationData && (
                                <TimeChart
                                    onDateChanged={setTaskDate}
                                    date={taskDate}
                                    dateRange={dateRange}
                                    bgColorsStart={0}
                                    labels={labels}
                                    dataSeries={dataSeries}
                                    visibility={pieGroups.map(
                                        (item) => item.on
                                    )}
                                />
                            )}
                        </div>
                        <div className="block">
                            <div className="columns">
                                <div className="column is-half">
                                    <PiechartNoLegend
                                        data={pieGroups}
                                        visibility={pieGroups.map(
                                            (item) => item.on
                                        )}
                                    />
                                </div>
                                <div className="column is-half">
                                    <LegendTable
                                        headers={['Projekt', 'Tid']}
                                        data={pieGroups}
                                        onRowToggle={onLegendRowToggle}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
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
                        <button
                            className="button is-danger"
                            onClick={confirmDelete}
                        >
                            Slet
                        </button>
                        <button className="button" onClick={closeModal}>
                            Annuler
                        </button>
                    </div>
                </div>
                <button
                    className="modal-close is-large"
                    aria-label="close"
                    onClick={closeModal}
                ></button>
            </div>
        </>
    );
};

export default App;
