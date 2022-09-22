import React, { MouseEvent, useRef } from 'react';
import { TaskList, TimeEntry } from '../../SPS';
import { isSameDay } from 'date-fns';

interface TimeChartDataProps {
    onDateChanged: (date: Date) => void;
    date: Date;
    data: TimeEntry[];
    taskData: TaskList[];
  }
const TimeChartData = (props: TimeChartDataProps) => {
    console.log('TimeChartDataProps: ',props)
    let currentDate = new Date(props.date);
    // https://mui.com/material-ui/react-slider/
    const dateRange = 13;
    console.log('currentDate: ',currentDate)
    currentDate.setDate(currentDate.getDate() - dateRange);
    console.log('firstDate: ',currentDate)
    return <></>
}
export default TimeChartData;