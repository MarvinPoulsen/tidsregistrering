import React, { MouseEvent, useRef } from 'react';
import { TaskList, TimeEntry } from '../../SPS';
import { isSameDay, isWithinInterval, subDays } from 'date-fns';

interface TimeChartDataProps {
    onDateChanged: (date: Date) => void;
    date: Date;
    data: TimeEntry[];
    taskData: TaskList[];
  }
const TimeChartData = (props: TimeChartDataProps) => {
    console.log('TimeChartDataProps: ',props)
    let lastDate = new Date(props.date);
    // https://mui.com/material-ui/react-slider/
    const dateRange = 23;
    console.log('lastDate: ',lastDate)
    const firstDate = subDays(lastDate, dateRange);
    console.log('firstDate: ',firstDate)

    let filteredTasks = props.data.filter((te) => isWithinInterval(te.date, {start: firstDate,end: lastDate} ));
console.log('filteredTasks: ',filteredTasks)
    return <></>
}
export default TimeChartData;