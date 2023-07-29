import React from 'react';
import { useTable } from 'react-table';
import Icon from '@mdi/react';
import { mdiPencil, mdiDelete } from '@mdi/js';
import { Task } from '../../SPS';
import format from 'date-fns/format';
// import {toHoursAndMinutes} from '../../utils'

interface TaskTableProps {
    tasks: Task[];
    // data: TimeEntry[];
    // tasks: FavoritTask[];
    // onDelete: (id: number) => void;
    // setEditEntry:(id)=>void;
    // setNote: (newNote) => void;
    // setTaskDate:(newTaskDate)=>void;
    // setTaskId:(newTaskId)=>void;
    // setTaskTime:(minutes)=>void;
    // setAllDay:(isAllDay:boolean)=>void;
}
function TaskTable(props: TaskTableProps) {
    
    // console.log('ProjectTableProps: ',props)
    const handleOnEdit = (element)=>{
        console.log('element: ',element)
    //     props.setNote(element.note)
    //     props.setTaskDate(new Date(element.taskDate.setHours(0, 0, 0, 0)))
    //     props.setTaskId(element.taskId)
    //     props.setTaskTime(element.taskTime)
    //     props.setAllDay(element.allDay)
    //     props.setEditEntry(element.id)
    }
    const onDelete = (e)=>{
        console.log('e: ',e)
    }
    const tasks = props.tasks.map((element) => {
        const milestone = format(element.milestone, "dd-MM-yyyy")

    //     const task = props.tasks.find((t) => t.id === element.taskId);
        return {
            col1: (
                <a onClick={() => handleOnEdit(element)}>
                    <Icon 
                        path={mdiPencil}
                        size={0.7}
                    />
                </a>
            ),
            col2: (
                <a onClick={() => onDelete(element.id)}>
                    <Icon 
                        path={mdiDelete}
                        size={0.7}
                    />
                </a>
            ),
            col3: element.taskName,
            col4: element.timeframe,
            col5: milestone,
        };
    });
    const data = React.useMemo(() => tasks, [props.tasks]);

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
                Header: 'Navn',
                accessor: 'col3',
            },
            {
                Header: 'Tidsforbrug',
                accessor: 'col4',
            },
            {
                Header: 'Deadline',
                accessor: 'col5',
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
export default TaskTable;
