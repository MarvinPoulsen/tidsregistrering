// Import statements
import React, { useState } from 'react';
import { TimeEntry, Project, SpsUser, FavoritTask, Holiday } from '../../SPS';
import { add, getDay, getDaysInYear, getYear, isSameDay, isSameYear } from 'date-fns';
import TaskBarchart from '../../components/chart/TaskBarchart';
import Balance from './Balance';
// import { overlapMinutes } from '../../utils';

// Interface definitions
interface StatisticsProps {
    holidays: Holiday[];
    registrations: TimeEntry[];
    projects: Project[];
    tasks: FavoritTask[];
    user: SpsUser;
    formInfo?: () => void;
    currentDate: Date;
    years: number[];
    setTaskDate: (newTaskDate) => void;
}

export interface FlexStatusYear {
    year: number;
    flexBalance: number;
    vacation: number;
    illness: number;
}

// Constants
const norms = [0, 450, 450, 450, 540, 330, 0];
// Helper functions
export const overlapMinutes = (interval1Start, interval1End, interval2Start, interval2End) => {
    const start = interval1Start > interval2Start ? interval1Start : interval2Start;
    const end = interval1End < interval2End ? interval1End : interval2End;
    const overlap = start < end ? (end - start) / (1000 * 60) : 0; // Convert milliseconds to minutes

    return overlap;
};


const getYearData = (year, data, holidays) => {
    let flexStatus: number = 0;
    let vacation: number = 0;
    let illness: number = 0;
    let currentDayInYear = new Date(year, 0, 1);
    const daysInYear = getDaysInYear(currentDayInYear);
    let day = 1;
    while (day <= daysInYear) {
        const filteredByDate = data.filter((d) => isSameDay(d.taskDate, currentDayInYear));
        const isVacation = filteredByDate.filter((item) => item.taskId === 24);
        const isIllness = filteredByDate.filter((item) => item.taskId === 27);
        const isWork = filteredByDate.filter((item) => item.taskId !== 27 && item.taskId !== 24 && item.taskId !== 26);
        const workTime = isWork.reduce((total, currentItem) => (total = total + (currentItem.taskTime || 0)), 0);
        const illnessTime = isIllness.reduce((total, currentItem) => (total = total + (currentItem.taskTime || 0)), 0);
        const isFuture = new Date() < currentDayInYear || isSameDay(currentDayInYear, new Date());
        const holiday = holidays.find((item) => isSameDay(item.holiday_start, currentDayInYear));
        const dayNo = getDay(currentDayInYear);
        const norm = norms[dayNo];

        if (isVacation.length > 0) {
            isVacation.forEach((item) => {
                // console.log('isVacation: ',isVacation)
                const vacationStart = new Date(item.taskStart);
                const vacationEnd = new Date(item.taskEnd);
                const normStart = norm > 0 ? new Date(currentDayInYear.setHours(8, 0, 0, 0)) : currentDayInYear;
                const normEnd = norm > 0 ? add(normStart, { minutes: norm }) : currentDayInYear;
                const vacationTime = overlapMinutes(normStart, normEnd, vacationStart, vacationEnd);

                if (vacationTime > 0 && item.allDay === 'false') {
                    vacation += vacationTime;
                    const newNorm = norm - vacationTime;
                    if (workTime > newNorm) {
                        flexStatus += workTime - newNorm;
                    } else {
                        flexStatus -= newNorm - workTime;
                    }
                } else {
                    flexStatus += workTime;
                    vacation += norm;
                }
            });
        } else if (holiday) {
            if (holiday.all_day) {
                // console.log('holiday all day long!');
                flexStatus += workTime;
            } else {
                const holidayWorkTime = norm > holiday.work_time ? holiday.work_time : norm;
                if (holidayWorkTime < workTime) {
                    const flex = workTime - holidayWorkTime;
                    flexStatus += flex;
                } else {
                    const flex = isFuture
                        ? 0
                        : illnessTime > holidayWorkTime - workTime
                        ? 0
                        : holidayWorkTime - workTime - illnessTime;
                    flexStatus -= flex;
                }
                // console.log('holiday: ', holiday);
            }
        } else {
            if (norm < workTime) {
                const flex = workTime - norm;
                flexStatus += flex;
            } else {
                const flex = isFuture ? 0 : illnessTime > norm - workTime ? 0 : norm - workTime - illnessTime;
                flexStatus -= flex;
            }
            // console.log('no holiday');
        }
        illness += illnessTime;
        currentDayInYear = add(currentDayInYear, { days: 1 });
        day++;
    }

    return { flexYear: flexStatus, vacation, illness };
};

// Component
const Statistics = (props: StatisticsProps) => {
    // console.log('StatisticsProps: ', props);
    // useState hooks
    const [selectedOption, setSelectedOption] = useState<string>('Balance');
    const [selectedYear, setSelectedYear] = useState<number>(getYear(props.currentDate));

    // useRef hooks
    // Functions
    const handleOnClick = (element) => {
        // console.log('selectedYear: ', selectedYear);
        setSelectedOption(element);
    };

    // useEffect hooks
    // Data processing
    const { flexYear, vacation, illness } = getYearData(selectedYear, props.registrations, props.holidays);

    const year = new Date();

    const yearList: JSX.Element[] = [];
    for (const year of props.years) {
        yearList.push(
            <div key={year} className="dropdown-item">
                <a onClick={() => setSelectedYear(year)} className={selectedYear === year ? 'is-active has-text-white' : ''}>
                    {year}
                </a>
            </div>
        );
    }

    const regList: JSX.Element[] = [];
    // console.log('Year: ', year);

    const registrationsByYear = props.registrations.filter((te) => isSameYear(te.taskDate, year));
    // console.log('registratioByYear: ', registrationsByYear);
    const taskBarData: unknown[] = [];
    for (const task of props.tasks) {
        const filteredByTask = registrationsByYear.filter((t) => t.taskId === task.id);
        const time = filteredByTask.reduce((total, currentItem) => (total = total + (currentItem.taskTime || 0)), 0);
        if (time !== 0) {
            if (task.id === 1) {
                // console.log('Ny opgave: ', time)
                taskBarData.push({ 'Ny opgave': time });
            } else {
                // console.log(task.taskName,': ', time)
                taskBarData.push({ [task.taskName]: time });
            }
        }
    }
    for (const regByYear of registrationsByYear) {
        const task = props.tasks.find((t) => t.id === regByYear.taskId);
        // console.log('regByYear: ',regByYear)
        // console.log('task: ', task)
        regList.push(
            <p className="panel-block" key={regByYear.id}>
                {task.taskName}
                {regByYear.taskTime}
            </p>
        );
    }

    // Conditional values
    // Component return
    return (
        <>
            <section className="section">
                <div className="columns">
                    <div className="column is-1">
                        <aside className="menu">
                            <p className="menu-label">År</p>
                            <ul className="menu-list">
                                <li>
                                    <div className="dropdown is-hoverable">
                                        <div className="dropdown-trigger">
                                            {/* <a onClick={() => console.log('Hallo!')}> */}
                                            <a>
                                                {selectedYear}
                                                <span className="bulma-arrow-mixin"></span>
                                            </a>
                                        </div>
                                        <div className="dropdown-menu" id="dropdown-menu-years" role="menu">
                                            <div className="dropdown-content">{yearList}</div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <p className="menu-label">Bruger</p>
                            <ul className="menu-list ">
                                <li>
                                    <a
                                        onClick={() => handleOnClick('Balance')}
                                        className={selectedOption === 'Balance' ? 'is-active has-text-white' : ''}
                                    >
                                        Flekstid
                                    </a>
                                </li>
                                <li>
                                    <a
                                        onClick={() => handleOnClick('Opgaver')}
                                        className={selectedOption === 'Opgaver' ? 'is-active has-text-white' : ''}
                                    >
                                        Opgaver
                                    </a>
                                </li>
                            </ul>
                            {/* {props.user && props.user.hasPermission('endpoint.ep_lk_tasm_admin') && (
                                <>
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
                                </>
                            )} */}
                        </aside>
                    </div>
                    <div className="column">
                        {selectedOption === 'Balance' && (
                            <Balance
                                registrations={props.registrations}
                                user={props.user}
                                selectedDate={props.currentDate}
                                selectedYear={selectedYear}
                                setTaskDate={props.setTaskDate}
                                holidays={props.holidays}
                                norms={norms}
                                flexYear={flexYear}
                                vacation={vacation}
                                illness={illness}
                            />
                        )}
                        {selectedOption === 'Opgaver' && <TaskBarchart data={taskBarData} />}
                        {/* {regList} */}
                    </div>
                </div>
            </section>
        </>
    );
};
// Component export
export default Statistics;
