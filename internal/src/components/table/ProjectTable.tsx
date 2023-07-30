import React from 'react';
import { useTable } from 'react-table';
import Icon from '@mdi/react';
import { mdiPencil, mdiDelete } from '@mdi/js';
import { Project } from '../../SPS';
import format from 'date-fns/format';

interface ProjectTableProps {
    projects: Project[];
}
function ProjectTable(props: ProjectTableProps) {
    
    // console.log('ProjectTableProps: ',props)
    const handleOnEdit = (element)=>{
        console.log('element: ',element)
    }
    const onDelete = (e)=>{
        console.log('e: ',e)
    }
    const projects = props.projects.map((element) => {
        const horizon = format(element.horizon, "dd-MM-yyyy")

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
            col3: element.projectName,
            col4: element.timeframe,
            col5: horizon,
        };
    });
    const data = React.useMemo(() => projects, [props.projects]);

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
export default ProjectTable;
