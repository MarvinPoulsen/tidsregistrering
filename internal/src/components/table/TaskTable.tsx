import React from 'react';
import { useTable } from 'react-table';
import Icon from '@mdi/react';
import { mdiPencil, mdiDelete, mdiNumeric1Circle, mdiNumeric2CircleOutline, mdiNumeric3 } from '@mdi/js';
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
        const importance = element.importance < 1 ? '' :
            // <Icon path={mdiNull} size={1} color="blue"/> :
            element.importance < 2 ?
                <Icon path={mdiNumeric1Circle} size={1} color="red"/> :
                element.importance < 3 ?
                    <Icon path={mdiNumeric2CircleOutline} size={1} color="orange"/> :
                    <Icon path={mdiNumeric3} size={1} color="green"/> ;

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
            col5: element.description,
            col6: element.timeframe,
            col7: milestone,
            col8: importance,
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
                Header: 'Beskrivelse',
                accessor: 'col5',
            },
            {
                Header: 'Tidsforbrug',
                accessor: 'col6',
            },
            {
                Header: 'Deadline',
                accessor: 'col7',
            },
            {
                Header: '',
                accessor: 'col8',
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
