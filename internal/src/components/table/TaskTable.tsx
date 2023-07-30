import React from 'react';
import { useTable } from 'react-table';
import Icon from '@mdi/react';
import { mdiPencil, mdiDelete } from '@mdi/js';
import { Task, Project } from '../../SPS';
import format from 'date-fns/format';
// import {toHoursAndMinutes} from '../../utils'

interface TaskTableProps {
    tasks: Task[];
    projects: Project[]
}
function TaskTable(props: TaskTableProps) {    
    // console.log('TaskTableProps: ',props)
    const handleOnEdit = (element)=>{
        console.log('element: ',element)
    }
    const onDelete = (e)=>{
        console.log('e: ',e)
    }
    const tasks = props.tasks.map((element) => {
        const milestone = format(element.milestone, "dd-MM-yyyy")

    const project = props.projects.find((p) => p.id === element.projectId);
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
            col3: project.projectName,
            col4: element.taskName,
            col5: element.timeframe,
            col6: milestone,
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
                Header: 'Projekt',
                accessor: 'col3',
            },
            {
                Header: 'Navn',
                accessor: 'col4',
            },
            {
                Header: 'Tidsforbrug',
                accessor: 'col5',
            },
            {
                Header: 'Deadline',
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
export default TaskTable;
