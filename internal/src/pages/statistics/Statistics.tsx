import React, { useState } from 'react';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import { TimeEntry, Project, User, Task } from '../../SPS';
import { isSameYear } from 'date-fns';
import da from 'date-fns/locale/da'; // the locale you want
import TaskBarchart from '../../components/taskstats/TaskBarchart';

interface StatisticsProps {
    registrations: TimeEntry[];
    projects: Project[];
    tasks: Task[];
    user: User;
}
const Statistics = (props: StatisticsProps) => {
    console.log('StatisticsProps: ', props);
    const [year, setYear] = useState(new Date());

    const regList: JSX.Element[] = [];
    console.log('Year: ', year);

    const registrationsByYear = props.registrations.filter((te) => isSameYear(te.taskDate, year));
    console.log('registratioByYear: ', registrationsByYear);
    const taskBarData:unknown[] = []
    for (const task of props.tasks) {
        const filteredByTask = registrationsByYear.filter((t) => t.taskId === task.id);
        const time = filteredByTask.reduce((total, currentItem) => (total = total + (currentItem.taskTime || 0)), 0);
        if (time !== 0){
            if(task.id === 1){
                console.log('Ny opgave: ', time)
                taskBarData.push({'Ny opgave': time})
            } else {
                console.log(task.taskName,': ', time)
                taskBarData.push({[task.taskName]: time})
            }
        }

    }
    for (const regByYear of registrationsByYear) {
        const task = props.tasks.find((t) => t.id === regByYear.taskId);
        // console.log('regByYear: ',regByYear)
        // console.log('task: ', task)
        regList.push(
            <p className="panel-block" key={regByYear.id}>
                {task.taskName}{regByYear.taskTime}
            </p>
        );
    }
    return (
        <>
            <section className="section">
                <div className="columns">
                    <div className="column is-3">
                        <aside className="menu">
                            <p className="menu-label">Bruger</p>
                            <ul className="menu-list">
                                <li>
                                    <a>Dashboard</a>
                                </li>
                                <li>
                                    <a>Customers</a>
                                </li>
                            </ul>
                            {/* <p className="menu-label">Team</p>
                            <ul className="menu-list">
                                <li>
                                    <a>Team Settings</a>
                                </li>
                                <li>
                                    <a className="is-active">Manage Your Team</a>
                                    <ul>
                                        <li>
                                            <a>Members</a>
                                        </li>
                                        <li>
                                            <a>Plugins</a>
                                        </li>
                                        <li>
                                            <a>Add a member</a>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <a>Invitations</a>
                                </li>
                                <li>
                                    <a>Cloud Storage Environment Settings</a>
                                </li>
                                <li>
                                    <a>Authentication</a>
                                </li>
                            </ul> */}
                            <p className="menu-label">Projekt</p>
                            <ul className="menu-list">
                                <li>
                                    <a>Payments</a>
                                </li>
                                <li>
                                    <a>Transfers</a>
                                </li>
                                <li>
                                    <a>Balance</a>
                                </li>
                            </ul>
                        </aside>
                    </div>
                    <div className="column">
                        <TaskBarchart
                            data={taskBarData}
                        />
                        {/* {regList} */}
                        </div>
                </div>
            </section>
        </>
    );
};
export default Statistics;
