import React from 'react';
import { useTable } from 'react-table';
import Icon from '@mdi/react';
import { mdiPencil, mdiDelete } from '@mdi/js';
import { Task, TimeEntry } from '../../SPS';
import format from 'date-fns/format';
import {toHoursAndMinutes} from '../../utils'

interface TimeTableProps {
    data: TimeEntry[];
    tasks: Task[];
    onDelete: (id: number) => void;
    setEditEntry:(id)=>void;
    setNote: (newNote) => void;
    setTaskDate:(newTaskDate)=>void;
    setTaskId:(newTaskId)=>void;
    setTaskTime:(minutes)=>void;
    setAllDay:(isAllDay:boolean)=>void;
}
function TimeTable(props: TimeTableProps) {
    
    // console.log('TimeTableProps: ',props)
    const handleOnEdit = (element)=>{
        props.setNote(element.note)
        props.setTaskDate(new Date(element.taskDate.setHours(0, 0, 0, 0)))
        props.setTaskId(element.taskId)
        props.setTaskTime(element.taskTime)
        props.setAllDay(element.allDay)
        props.setEditEntry(element.id)
    }
    const tasks = props.data.map((element) => {
        
        const task = props.tasks.find((t) => t.id === element.taskId);
        return {
            col1: (
                <a onClick={() => handleOnEdit(element)} href="#">
                    <Icon 
                        path={mdiPencil}
                        size={0.7}
                    />
                </a>
            ),
            col2: (
                <a onClick={() => props.onDelete(element.id)} href="#">
                    <Icon 
                        path={mdiDelete}
                        size={0.7}
                    />
                </a>
            ),
            col3: task.taskName,
            col4: format(element.taskDate, 'dd-MM-yyyy'),
            col5: toHoursAndMinutes(element.taskTime),
            col6: element.note,
        };
    });
    const data = React.useMemo(() => tasks, [props.data]);

    const columns = React.useMemo(
        () => [
            {
                Header: '',
                accessor: 'col1', // accessor is the "key" in the data
            },
            {
                Header: '',
                accessor: 'col2',
            },
            {
                Header: 'Opgave',
                accessor: 'col3',
            },
            {
                Header: 'Dato',
                accessor: 'col4',
            },
            {
                Header: 'Tid (min)',
                accessor: 'col5',
            },
            {
                Header: 'Beskrivelse',
                accessor: 'col6',
            },
        ],
        []
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable({ columns, data });

    return (
        <table
            {...getTableProps({
                className:
                    'table is-bordered is-narrow is-hoverable is-fullwidth',
            })}
        >
            <thead>
                {headerGroups.map((headerGroup, i) => (
                    <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                        {headerGroup.headers.map((column, i) => (
                            <th {...column.getHeaderProps()} key={i}>
                                {column.render('Header')}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()} key={i}>
                            {row.cells.map((cell, i) => {
                                return (
                                    <td {...cell.getCellProps()} key={i}>
                                        {cell.render('Cell')}
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
export default TimeTable;
