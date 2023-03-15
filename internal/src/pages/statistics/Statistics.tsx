import React, { useState } from 'react';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import { TimeEntry, Project, User, Task } from '../../SPS';
import { isSameYear } from 'date-fns';
import da from 'date-fns/locale/da'; // the locale you want

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
    for (const regByYear of registrationsByYear){
        // console.log()
    regList.push(
        <p className="panel-block" key={regByYear.id}>
            {regByYear.taskId}
        </p>
    )}
    return (
        <>
            <section className="section">
                <div className="columns">
                    <div className="column is-3"></div>
                    <div className="column">
                        {regList}
                    </div>
                </div>
            </section>
        </>
    );
};
export default Statistics;
