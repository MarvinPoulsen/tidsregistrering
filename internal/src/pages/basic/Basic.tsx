import React, { useState, useEffect } from 'react';

import TimeRegistration from '../../components/timeregistration/TimeRegistration';
import TimeTable from '../../components/timetable/TimeTable';
import TimeChart from '../../components/timechart/TimeChart';
import { isSameDay } from 'date-fns';
import Slider from '../../components/slider/Slider';
import PiechartNoLegend from '../../components/timechart/PiechartNoLegend';
import LegendTable from '../../components/timechart/LegendTable';
import { TimeEntry, Project, User, Task } from '../../SPS';

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
    timeRegistrationData: TimeEntry[];    
    taskDate:Date;
    taskStart:Date;
    taskEnd:Date;
    projectsData:Project[];
    user:User;
    onSave:(entry)=>void;
    editEntry:TimeEntry;
    onDelete:(id)=>void;
    onEdit:(e: TimeEntry)=>void
    taskData:Task[];
    onDateChanged:(newTaskDate)=>void
}
const Basic = (props:BasicProps) => {
    // console.log('props.projectsData: ',props.projectsData)
    const [range, setRange] = useState<number>(14);
    const [legendData, setLegendData] = useState<LegendData[]>([]);

    useEffect(() => {
        const data: LegendData[] = 
        // [
        //     ...new Set(
                props.projectsData.map((item) => {
                    return {
                        projectName: item.projectName,
                        on: true,
                    };
                })
        //     ),
        // ]
        ;
        console.log('data: ',data)
        setLegendData(data);
    }, [props.projectsData]);
    /**
     * 
     */
    const filteredTasks = props.timeRegistrationData.filter((te) =>
        isSameDay(te.taskDate, props.taskDate)
    );

    const endDate = new Date(props.taskDate);
    endDate.setHours(0, 0, 0, 0);
    const startDate = new Date(endDate);
    const dateRange = range - 1;
    startDate.setDate(startDate.getDate() - dateRange);
    /**
     * @description registreringer filtreret på dato interval
     */
    const filterData = props.timeRegistrationData.filter((a) => {
        const lookupDate = new Date(a.taskDate);
        return lookupDate >= startDate && lookupDate <= endDate;
    });
    // console.log('filterData: ',filterData)

    const tasks = filterData.map((element) => {
        // console.log('element: ',element)
        const task = props.taskData.find((t) => t.id === element.taskId);
        const project = props.projectsData.find((p) => p.id === task.projectId);
        
        return {
            taskDate: element.taskDate,
            taskTime: element.taskTime,
            // taskName: task.taskName,
            // projectId: task.projectId,
            projectName: project.projectName,
        };
    });
    // console.log('tasks: ',tasks)
    const projects: string[] = [...new Set(tasks.map((item) => item.projectName))];
    // console.log('projects: ',projects)

    const dataSeries: StackedDataSeries[] = [];
    const pieGroups: PieGroup[] = [];
    projects.forEach((element) => {
        const filteredProjects = tasks.filter((p) => p.projectName === element);
        const dateCopy = new Date(props.taskDate.getTime());
        dateCopy.setDate(dateCopy.getDate() - dateRange);

        const values: number[] = [];
        let sum = 0;
        for (let i = 0; i <= dateRange; i++) {
            const filteredByDate = filteredProjects.filter((d) =>
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
        dataSeries.push({ projectName: element, values, stack: '0' });
        const legendItem = legendData.find((p) => p.projectName === element);
        const isOn = legendItem ? legendItem.on : true;
        pieGroups.push({
            projectName: element,
            value: sum,
            on: isOn,
        });
    });
    console.log('pieGroups: ',pieGroups)
    const labels: string[][] = [];
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
    /**
     * Toggle the if row on table is on or off
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
                                onDateChanged={props.onDateChanged}
                                date={props.taskDate}
                                data={props.taskData}
                                userId={props.user.shortId}
                                onSave={props.onSave}
                                editEntry={props.editEntry}
                                start={props.taskStart}
                                end={props.taskEnd}
                            />
                        )}
                    </div>
                </div>
                <div className="columns">
                    <div className="column is-half">
                        <TimeTable
                            data={filteredTasks}
                            taskData={props.taskData}
                            onDelete={props.onDelete}
                            onEdit={props.onEdit}
                        />
                    </div>
                    <div className="column">
                        <div className="block">
                            <Slider
                                onRangeChange={setRange}
                                maxValue={90}
                                minValue={7}
                                value={range}
                            />
                            {props.timeRegistrationData && (
                                <TimeChart
                                    onDateChanged={props.onDateChanged}
                                    date={props.taskDate}
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
        </>
    );
};

export default Basic;
