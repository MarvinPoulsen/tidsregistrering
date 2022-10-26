import React from 'react';
import { useTable } from 'react-table';
import Icon from '@mdi/react';
import { mdiPencil, mdiDelete } from '@mdi/js';
import { Task, TimeEntry } from '../../SPS';
import format from 'date-fns/format';
import {toHoursAndMinutes} from '../../utils'

interface TimeTableProps {
    data: TimeEntry[];
    taskData: Task[];
    onDelete: (id: number) => void;
    onEdit: (entry: TimeEntry) => void;
}
function TimeTable(props: TimeTableProps) {
    const tasks = props.data.map((element) => {
        const task = props.taskData.find((t) => t.id === element.taskId);
        return {
            col1: (
                <a onClick={() => props.onEdit(element)} href="#">
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
            col3: task.name,
            col4: format(element.date, 'dd-MM-yyyy'),
            col5: toHoursAndMinutes(element.time),
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
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <th {...column.getHeaderProps()}>
                                {column.render('Header')}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map((cell) => {
                                return (
                                    <td {...cell.getCellProps()}>
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
