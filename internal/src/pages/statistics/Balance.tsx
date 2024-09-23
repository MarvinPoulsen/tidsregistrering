// Import statements
import React, { useState } from 'react';
import { Holiday, SpsUser, TimeEntry } from '../../SPS';
import FlexTimeBalance from '../../components/chart/FlexTimeBalance';
import { StackedDataSeries } from '../../components/timechart/TimeChart';
import {
    add,
    getDay,
    getDaysInMonth,
    getMonth,
    isSameDay,
} from 'date-fns';
import { overlapMinutes, toHoursAndMinutes } from '../../utils';

// Interface definitions
interface BalanceProps {
    registrations: TimeEntry[];
    user: SpsUser;
    formInfo?: () => void;
    selectedDate: Date;
    selectedYear: number;
    setTaskDate: (newTaskDate) => void;
    holidays: Holiday[];
    norms: number[];
    flexYear: number;
    vacation: number;
    illness: number;
}

// Constants
// Helper functions
const getMonthData = (year, month, data, holidays, norms) => {
    const dataSeries: StackedDataSeries[] = [];
    const labels: string[][] = [];
    const standard: number[] = [];
    const minus: number[] = [];
    const plus: number[] = [];
    const illness: number[] = [];
    const vacation: number[] = [];
    let flexStatus: number = 0;
    const daysInMonth = getDaysInMonth(new Date(year, month));
    let day = 1;
    while (day <= daysInMonth) {
        const dato = new Date(year, month, day);
        const isFuture = new Date() < dato || isSameDay(dato, new Date());
        const dayNo = getDay(dato);
        const norm = norms[dayNo];
        const holiday = holidays.find((item) => isSameDay(item.holiday_start, dato));
        const labelPair: string[] = [];
        labelPair.push(new Intl.DateTimeFormat('da-DK', { weekday: 'short' }).format(dato));
        labelPair.push(
            dato.toLocaleDateString('da-DK', {
                month: 'short',
                day: 'numeric',
            })
        );
        labels.push(labelPair);

        const filteredByDate = data.filter((d) => isSameDay(d.taskDate, dato));
        const isVacation = filteredByDate.filter((item) => item.taskId === 24);
        const isIllness = filteredByDate.filter((item) => item.taskId === 27);
        const isWork = filteredByDate.filter((item) => item.taskId !== 27 && item.taskId !== 24 && item.taskId !== 26); //fJerner sygdom, ferie og flex

        const workTime = isWork.reduce((total, currentItem) => (total = total + (currentItem.taskTime || 0)), 0);
        const illnessTime = isIllness.reduce((total, currentItem) => (total = total + (currentItem.taskTime || 0)), 0);
        if (isVacation.length > 0) {
            isVacation.forEach((item) => {
                const vacationStart = new Date(item.taskStart);
                const vacationEnd = new Date(item.taskEnd);
                const normStart = norm > 0 ? new Date(dato.setHours(8, 0, 0, 0)) : dato;
                const normEnd = norm > 0 ? add(normStart, { minutes: norm }) : dato;
                const vacationTime = overlapMinutes(normStart, normEnd, vacationStart, vacationEnd);
                if (vacationTime < norm) {
                    const newNorm = norm - vacationTime;
                    vacation.push(vacationTime);
                    if (newNorm < workTime) {
                        standard.push(newNorm);
                        minus.push(0);
                        const flex = workTime - newNorm;
                        plus.push(flex);
                        flexStatus += flex;
                    } else {
                        standard.push(workTime);
                        const flex = isFuture ? 0 : illnessTime > newNorm - workTime ? 0 : newNorm - workTime - illnessTime;
                        minus.push(flex);
                        plus.push(0);
                        flexStatus -= flex;
                    }
                } else {
                    standard.push(0);
                    minus.push(0);
                    plus.push(workTime);
                    flexStatus += workTime;
                    vacation.push(norm);
                }
            });
        } else if (holiday) {
            vacation.push(0);
            if (holiday.all_day) {
                standard.push(0);
                minus.push(0);
                plus.push(workTime);
                flexStatus += workTime;
            } else {
                const holidayWorkTime = norm > holiday.work_time ? holiday.work_time : norm;
                if (holidayWorkTime < workTime) {
                    standard.push(holidayWorkTime);
                    minus.push(0);
                    const flex = workTime - holidayWorkTime;
                    plus.push(flex);
                    flexStatus += flex;
                } else {
                    standard.push(workTime);
                    const flex = isFuture
                        ? 0
                        : illnessTime > holidayWorkTime - workTime
                        ? 0
                        : holidayWorkTime - workTime - illnessTime;
                    minus.push(flex);
                    plus.push(0);
                    flexStatus -= flex;
                }
            }
        } else {
            vacation.push(0);
            if (norm < workTime) {
                standard.push(norm);
                minus.push(0);
                const flex = workTime - norm;
                plus.push(flex);
                flexStatus += flex;
            } else {
                standard.push(workTime);
                const flex = isFuture ? 0 : illnessTime > norm - workTime ? 0 : norm - workTime - illnessTime;
                minus.push(flex);
                plus.push(0);
                flexStatus -= flex;
            }
        }
        illness.push(illnessTime);

        day++;
    }

    dataSeries.push({ projectName: 'standard', values: standard, stack: '0' });
    dataSeries.push({ projectName: 'minus', values: minus, stack: '0' });
    dataSeries.push({ projectName: 'plus', values: plus, stack: '0' });
    dataSeries.push({ projectName: 'illness', values: illness, stack: '0' });
    dataSeries.push({ projectName: 'vacation', values: vacation, stack: '1' });
    console.log('dataSeries(',year,'-',month+1,'): ', dataSeries)
    return { dataSeries, labels, flexMonth: flexStatus };
};

// Component
const Balance = (props: BalanceProps) => {

    // useState hooks
    const [selectedMonth, setSelectedMonth] = useState<number>(getMonth(props.selectedDate));

    // useRef hooks

    // Functions
    const handleMonth = (monthNumber) => {
        setSelectedMonth(monthNumber);
    };

    // useEffect hooks

    // Data processing
    const { dataSeries, labels, flexMonth } = getMonthData(
        props.selectedYear,
        selectedMonth,
        props.registrations,
        props.holidays,
        props.norms
    );

    // Conditional values
    const flexStatusMonth = flexMonth ? toHoursAndMinutes(flexMonth) : 0;
    const flexStatusYear = props.flexYear ? toHoursAndMinutes(props.flexYear) : 0;
    const vacation = props.vacation ? toHoursAndMinutes(props.vacation) : 0;
    const illness = props.illness ? toHoursAndMinutes(props.illness) : 0;
    const titleMonth = flexMonth < 0 ? 'title has-text-danger' : 'title';
    const titleYear = props.flexYear < 0 ? 'title has-text-danger' : 'title';
    // Component return
    return (
        <>
            <nav className="level">
                <div className="level-item has-text-centered">
                    <div>
                        <p className="heading">Status for valgte måned</p>
                        <p className={titleMonth}>{flexStatusMonth}</p>
                    </div>
                </div>
                <div className="level-item has-text-centered">
                    <div>
                        <p className="heading">Aktuel år</p>
                        <p className={titleYear}>{flexStatusYear}</p>
                    </div>
                </div>
                <div className="level-item has-text-centered">
                    <div>
                        <p className="heading">Ferie</p>
                        <p className="title">{vacation}</p>
                    </div>
                </div>
                <div className="level-item has-text-centered">
                    <div>
                        <p className="heading">Sygdom</p>
                        <p className="title">{illness}</p>
                    </div>
                </div>
            </nav>

            <div className="tabs is-boxed">
                <ul>
                    <li className={selectedMonth === 0 ? 'is-active' : ''}>
                        <a onClick={() => handleMonth(0)}>
                            <span className="icon is-small">
                                <i className="fas fa-image" aria-hidden="true"></i>
                            </span>
                            <span>Januar</span>
                        </a>
                    </li>
                    <li className={selectedMonth === 1 ? 'is-active' : ''}>
                        <a onClick={() => handleMonth(1)}>
                            <span className="icon is-small">
                                <i className="fas fa-music" aria-hidden="true"></i>
                            </span>
                            <span>Februar</span>
                        </a>
                    </li>
                    <li className={selectedMonth === 2 ? 'is-active' : ''}>
                        <a onClick={() => handleMonth(2)}>
                            <span className="icon is-small">
                                <i className="fas fa-film" aria-hidden="true"></i>
                            </span>
                            <span>Marts</span>
                        </a>
                    </li>
                    <li className={selectedMonth === 3 ? 'is-active' : ''}>
                        <a onClick={() => handleMonth(3)}>
                            <span className="icon is-small">
                                <i className="far fa-file-alt" aria-hidden="true"></i>
                            </span>
                            <span>April</span>
                        </a>
                    </li>
                    <li className={selectedMonth === 4 ? 'is-active' : ''}>
                        <a onClick={() => handleMonth(4)}>
                            <span className="icon is-small">
                                <i className="far fa-file-alt" aria-hidden="true"></i>
                            </span>
                            <span>Maj</span>
                        </a>
                    </li>
                    <li className={selectedMonth === 5 ? 'is-active' : ''}>
                        <a onClick={() => handleMonth(5)}>
                            <span className="icon is-small">
                                <i className="far fa-file-alt" aria-hidden="true"></i>
                            </span>
                            <span>Juni</span>
                        </a>
                    </li>
                    <li className={selectedMonth === 6 ? 'is-active' : ''}>
                        <a onClick={() => handleMonth(6)}>
                            <span className="icon is-small">
                                <i className="far fa-file-alt" aria-hidden="true"></i>
                            </span>
                            <span>Juli</span>
                        </a>
                    </li>
                    <li className={selectedMonth === 7 ? 'is-active' : ''}>
                        <a onClick={() => handleMonth(7)}>
                            <span className="icon is-small">
                                <i className="far fa-file-alt" aria-hidden="true"></i>
                            </span>
                            <span>August</span>
                        </a>
                    </li>
                    <li className={selectedMonth === 8 ? 'is-active' : ''}>
                        <a onClick={() => handleMonth(8)}>
                            <span className="icon is-small">
                                <i className="far fa-file-alt" aria-hidden="true"></i>
                            </span>
                            <span>September</span>
                        </a>
                    </li>
                    <li className={selectedMonth === 9 ? 'is-active' : ''}>
                        <a onClick={() => handleMonth(9)}>
                            <span className="icon is-small">
                                <i className="far fa-file-alt" aria-hidden="true"></i>
                            </span>
                            <span>Oktober</span>
                        </a>
                    </li>
                    <li className={selectedMonth === 10 ? 'is-active' : ''}>
                        <a onClick={() => handleMonth(10)}>
                            <span className="icon is-small">
                                <i className="far fa-file-alt" aria-hidden="true"></i>
                            </span>
                            <span>November</span>
                        </a>
                    </li>
                    <li className={selectedMonth === 11 ? 'is-active' : ''}>
                        <a onClick={() => handleMonth(11)}>
                            <span className="icon is-small">
                                <i className="far fa-file-alt" aria-hidden="true"></i>
                            </span>
                            <span>December</span>
                        </a>
                    </li>
                </ul>
            </div>
            <FlexTimeBalance
                dataSeries={dataSeries}
                labels={labels}
                bgColorsStart={41}
                month={selectedMonth}
                year={props.selectedYear}
                setTaskDate={props.setTaskDate}
                legendPosition="right"
                // title
            />
        </>
    );
};

// Component export
export default Balance;
