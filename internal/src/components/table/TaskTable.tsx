// Import statements
import React, { useState } from 'react';
import { useTable } from 'react-table';
import Icon from '@mdi/react';
import { mdiPencil, mdiDelete, mdiDeleteOff, mdiNumeric1Circle, mdiNumeric2CircleOutline, mdiNumeric3, mdiNull } from '@mdi/js';
import { Task, Project } from '../../SPS';
import format from 'date-fns/format';
// import {toHoursAndMinutes} from '../../utils'

interface TaskTableProps {
    tasks: Task[];
    projects: Project[];
    projectId: number;
    setProjectId: (projectId) => void;
    taskName: string;
    setTaskName: (taskName) => void;
    milestone: Date;
    setMilestone: (milestone) => void;
    importance: number;
    setImportance: (importance) => void;
    timeframe: number;
    setTimeframe: (timeframe) => void;
    description: string;
    setDescription: (description) => void;
    obsolete: boolean;
    setObsolete: (isObsolete: boolean) => void;
    onSave: () => void;
    setEditEntry: (id) => void;
    resetForm: () => void;
    setIsNewTaskActive: (isOn: boolean) => void;
    error: string;
    setError: (errorDescription) => void;
}
function TaskTable(props: TaskTableProps) {
    // console.log('TaskTableProps: ',props)
    const[isObsoleteId,setIsObsoleteId] = useState<number>(null);

    
    const closeModal = () => {
        props.resetForm();
        setIsObsoleteId(null);
    };
    
    const confirmObsolete = () => {
        // console.log('isObsoleteId: ',isObsoleteId)
        // console.log('props.projectId: ',props.projectId)
        // console.log('props.taskName: ',props.taskName)
        // console.log('props.milestone: ',props.milestone)
        // console.log('props.importance: ',props.importance)
        // console.log('props.timeframe: ',props.timeframe)
        // console.log('props.description: ',props.description)
        // console.log('props.obsolete: ',props.obsolete)
        // console.log('props: ',props)
        props.onSave()
        closeModal();
    };
    const handleOnEdit = (element) => {
        // console.log('obsolete: ',props.obsolete)
        // console.log('element: ', element);
        props.setEditEntry(element.id);
        props.setProjectId(element.projectId);
        props.setTaskName(element.taskName);
        props.setMilestone(new Date(element.milestone));
        props.setImportance(element.importance);
        props.setTimeframe(element.timeframe);
        props.setDescription(element.description);
        props.setObsolete(element.obsolete);
        props.setIsNewTaskActive(true)
        props.setError(null)
    };
    const onObsolete = (element) => {
        // console.log('element: ', element);
        props.setEditEntry(element.id);
        props.setProjectId(element.projectId);
        props.setTaskName(element.taskName);
        props.setMilestone(new Date(element.milestone));
        props.setImportance(element.importance);
        props.setTimeframe(element.timeframe);
        props.setDescription(element.description);
        props.setObsolete(!element.obsolete);
        setIsObsoleteId(element.id);
    };


    const tasks = props.tasks.map((element) => {
        const milestone = format(element.milestone, 'dd-MM-yyyy');
        const importance = element.obsolete ? (
            <Icon path={mdiNull} size={1} color="lightgray" />
        ) : element.importance < 1 ? (
            ''
        ) : element.importance < 2 ? (
            <Icon path={mdiNumeric1Circle} size={1} color="red" />
        ) : element.importance < 3 ? (
            <Icon path={mdiNumeric2CircleOutline} size={1} color="orange" />
        ) : (
            <Icon path={mdiNumeric3} size={1} color="green" />
        );

        const project = props.projects.find((p) => p.id === element.projectId);
        return {
            col1: (
                <a onClick={() => handleOnEdit(element)}>
                    <Icon path={mdiPencil} size={0.7} />
                </a>
            ),
            col2: (
                <a onClick={() => onObsolete(element)}>
                    <Icon path={element.obsolete ? mdiDeleteOff : mdiDelete} size={0.7} />
                </a>
            ),
            col3: project.projectName,
            col4: element.taskName,
            col5: element.description,
            col6: element.timeframe,
            col7: milestone,
            col8: importance,
            obsolete: element.obsolete,
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

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

    return (
        <>
            <table
                {...getTableProps({
                    className: 'table is-bordered is-narrow is-hoverable is-fullwidth',
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
                            <tr
                                {...row.getRowProps({
                                    className: row.original.obsolete ? 'has-background-white-ter is-italic' : '',
                                })}
                                key={i}
                            >
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
            <div className={'modal' + (isObsoleteId ? ' is-active' : '')}>
                <div className="modal-background" onClick={closeModal}></div>
                <div className="modal-content">
                    <div className="box">
                        {isObsoleteId && (
                            <p>
                                Vil du slette de registrede tid? <br />
                                {/* {getTaskDescription(isObsoleteId)} */}
                            </p>
                        )}
                        <button className="button is-danger" onClick={confirmObsolete}>
                            Slet
                        </button>
                        <button className="button" onClick={closeModal}>
                            Annuler
                        </button>
                    </div>
                </div>
                <button className="modal-close is-large" aria-label="close" onClick={closeModal}></button>
            </div>
        </>
    );
}
export default TaskTable;
