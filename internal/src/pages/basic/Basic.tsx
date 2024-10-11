// Import statements
import React, { useState, useEffect } from 'react';

import TimeRegistration from '../../components/timeregistration/TimeRegistration';
import TimeTable from '../../components/table/TimeTable';
import TimeChart from '../../components/timechart/TimeChart';
import { isSameDay } from 'date-fns';
import Slider from '../../components/slider/Slider';
import PiechartNoLegend from '../../components/timechart/PiechartNoLegend';
import LegendTable from '../../components/timechart/LegendTable';
import { TimeEntry, Project, SpsUser, FavoritTask } from '../../SPS';

export interface PieGroup {
    projectName: string;
    value: number;
    on: boolean;
}
export interface LegendData {
    projectName: string;
    on: boolean;
}
interface StackedDataSeries {
    projectName: string;
    values: number[];
    stack: string;
}
interface BasicProps {
    registrations: TimeEntry[];
    taskDate: Date;
    taskStart: Date;
    taskEnd: Date;
    projects: Project[];
    user: SpsUser;
    onSave: () => void;
    editEntry: number;
    setEditEntry: (id) => void;
    onDelete: (id) => void;
    tasks: FavoritTask[];
    setTaskDate: (newTaskDate) => void;
    taskTime: number;
    setTaskTime: (minutes) => void;
    note: string;
    setNote: (newNote) => void;
    resetForm: () => void;
    taskId: number;
    setTaskId: (newTaskId) => void;
    setAllDay: (isAllDay: boolean) => void;
    formInfo?: () => void;
}
const Basic = (props: BasicProps) => {
    const [range, setRange] = useState<number>(7);
    const [legendData, setLegendData] = useState<LegendData[]>([]);

    useEffect(() => {
        const data: LegendData[] = props.projects.map((item) => {
            return {
                projectName: item.projectName,
                on: true,
            };
        });
        setLegendData(data);
    }, [props.projects]);
    /**
     *
     */
    const filteredTasks = props.registrations.filter((te) => isSameDay(te.taskDate, props.taskDate));

    const endDate = new Date(props.taskDate);
    endDate.setHours(0, 0, 0, 0);
    const startDate = new Date(endDate);
    const dateRange = range - 1;
    startDate.setDate(startDate.getDate() - dateRange);
    /**
     * @description registreringer filtreret på dato interval
     */
    const filterData = props.registrations.filter((a) => {
        const lookupDate = new Date(a.taskDate);
        return lookupDate >= startDate && lookupDate <= endDate;
    });

    const taskList = filterData.map((element) => {
        const task = props.tasks.find((t) => t.id === element.taskId);
        const project = props.projects.find((p) => p.id === task.projectId);

        return {
            taskDate: element.taskDate,
            taskTime: element.taskTime,
            projectName: project.projectName,
        };
    });
    const projectList: string[] = [...new Set(taskList.map((item) => item.projectName))];

    const dataSeries: StackedDataSeries[] = [];
    const pieGroups: PieGroup[] = [];
    projectList.forEach((element) => {
        const filteredProjects = taskList.filter((p) => p.projectName === element);
        const dateCopy = new Date(props.taskDate.getTime());
        dateCopy.setDate(dateCopy.getDate() - dateRange);

        const values: number[] = [];
        let sum = 0;
        for (let i = 0; i <= dateRange; i++) {
            const filteredByDate = filteredProjects.filter((d) => isSameDay(d.taskDate, dateCopy));
            values.push(filteredByDate.reduce((total, currentItem) => (total = total + (currentItem.taskTime || 0)), 0));
            sum += filteredByDate.reduce((total, currentItem) => (total = total + (currentItem.taskTime || 0)), 0);
            dateCopy.setDate(dateCopy.getDate() + 1);
        }
        dataSeries.push({ projectName: element, values, stack: '0' });
        const legendItem = legendData.find((p) => p.projectName === element);
        const isOn = legendItem ? legendItem.on : true;
        pieGroups.push({
            projectName: element,
            value: sum,
            on: isOn,
        });
    });
    const labels: string[][] = [];
    for (let i = 0; i <= dateRange; i++) {
        const labelPair: string[] = [];
        labelPair.push(new Intl.DateTimeFormat('da-DK', { weekday: 'short' }).format(startDate));
        labelPair.push(
            startDate.toLocaleDateString('da-DK', {
                month: 'short',
                day: 'numeric',
            })
        );
        labels.push(labelPair);
        startDate.setDate(startDate.getDate() + 1);
    }
    /**
     * Toggle if the row on table is on or off
     * @param projectName
     */
    const onLegendRowToggle = (projectName: string) => {
        const updatedlegendData = [...legendData];
        const project = updatedlegendData.find((p) => p.projectName === projectName);
        project.on = !project.on;
        setLegendData(updatedlegendData);
    };

    return (
        <>
            <section className="section">
                <div className="columns">
                    <div className="column is-full">
                        {props.user && (
                            <TimeRegistration
                                setTaskDate={props.setTaskDate}
                                date={props.taskDate}
                                data={props.tasks}
                                userId={props.user.shortid}
                                onSave={props.onSave}
                                editEntry={props.editEntry}
                                note={props.note}
                                setNote={props.setNote}
                                resetForm={props.resetForm}
                                taskId={props.taskId}
                                setTaskId={props.setTaskId}
                                taskTime={props.taskTime}
                                setTaskTime={props.setTaskTime}
                            />
                        )}
                    </div>
                </div>
                <div className="columns">
                    <div className="column is-half">
                        <TimeTable
                            data={filteredTasks}
                            tasks={props.tasks}
                            onDelete={props.onDelete}
                            setEditEntry={props.setEditEntry}
                            setTaskDate={props.setTaskDate}
                            setNote={props.setNote}
                            setTaskId={props.setTaskId}
                            setAllDay={props.setAllDay}
                            setTaskTime={props.setTaskTime}
                        />
                    </div>
                    <div className="column">
                        <div className="block">
                            <Slider onRangeChange={setRange} maxValue={90} minValue={7} value={range} />
                            {props.registrations && (
                                <TimeChart
                                    setTaskDate={props.setTaskDate}
                                    date={props.taskDate}
                                    dateRange={dateRange}
                                    bgColorsStart={0}
                                    labels={labels}
                                    dataSeries={dataSeries}
                                    visibility={pieGroups.map((item) => item.on)}
                                />
                            )}
                        </div>
                        <div className="block">
                            <div className="columns">
                                <div className="column is-half">
                                    <PiechartNoLegend data={pieGroups} visibility={pieGroups.map((item) => item.on)} />
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
        </>
    );
};

export default Basic;
