// Import statements
import React, { useState } from 'react';
import { useTable } from 'react-table';
import Icon from '@mdi/react';
import { mdiPencil, mdiDelete, mdiDeleteOff } from '@mdi/js';
import { User } from '../../SPS';

interface UserTableProps {
    users: User[];
    // project: string;
    // setProject: (project) => void;
    // standard_time: number;
    // setStandard_time: (standard_time) => void;
    // deviations_time: number;
    // setDeviations_time: (deviations_time) => void;
    // working_time: number;
    // setWorking_time: (working_time) => void;
    // obsolete: boolean;
    // setObsolete: (isObsolete: boolean) => void;
    // onSave: () => void;
    // setEditEntry: (id) => void;
    // resetForm: () => void;
    // setIsEditUserActive: (isOn: boolean) => void;
    // error: string;
    // setError: (errorDescription) => void;
}
function UserTable(props: UserTableProps) {
    // console.log('UserTableProps: ',props)
    const[isObsoleteId,setIsObsoleteId] = useState<number>(null);

    
    const closeModal = () => {
        // props.resetForm();
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
        // props.onSave()
        closeModal();
    };
    const handleOnEdit = (element) => {
        // console.log('obsolete: ',props.obsolete)
        console.log('element: ', element);
        // props.setEditEntry(element.id);
        // props.setProject(element.project);
        // props.setStandard_time(element.standard_time);
        // props.setDeviations_time(element.deviations_time);
        // props.setWorking_time(element.working_time);
        // props.setObsolete(element.obsolete);
        // props.setIsEditUserActive(true)
        // props.setError(null)
    };
    const onObsolete = (element) => {
        console.log('element: ', element);
        // props.setEditEntry(element.id);
        // props.setProject(element.project);
        // props.setStandard_time(element.standard_time);
        // props.setDeviations_time(element.deviations_time);
        // props.setWorking_time(element.working_time);
        // props.setObsolete(!element.obsolete);
        // setIsObsoleteId(element.id);
    };


    const users = props.users.map((element) => {
        const navn = element.user_name + ' (' +  element.abbreviation + ')';
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
            col3: navn,
            col4: element.abbreviation,
            col5: element.working_time,
            col6: element.deviations_time,
            col7: element.standard_time,
            col8: element.project,
            obsolete: element.obsolete,
        };
    });
    const data = React.useMemo(() => users, [props.users]);

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
                Header: 'Brugernavn',
                accessor: 'col4',
            },
            {
                Header: 'Arbejdstid',
                accessor: 'col5',
            },
            {
                Header: 'Tidsafvigelse',
                accessor: 'col6',
            },
            {
                Header: 'Standard tid',
                accessor: 'col7',
            },
            {
                Header: 'Projekt',
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
                        // console.log('row: ', row.original.obsolete);
                        prepareRow(row);
                        return (
                            <tr
                                {...row.getRowProps({
                                    className: row.original.obsolete ? 'is-italic' : '',
                                    // className: row.original.obsolete ? 'has-background-grey has-text-info-light is-italic' : '',
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
export default UserTable;
