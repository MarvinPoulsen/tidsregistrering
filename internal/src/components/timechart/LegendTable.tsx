// Import statements
import React from 'react';
import { useTable } from 'react-table';
import './legendTable.scss';
import colors from '../../colors';
import { PiechartData } from './PiechartNoLegend';
import { toHoursAndMinutes } from '../../utils';

interface LegendTableProps {
    headers: string[];
    data: PiechartData[];
    onRowToggle: (projectName: string) => void;
}

const createTableData = (data, headers) => {
    const tableData: object[] = [];
    const tableColumns: object[] = [];
    for (let i = 0; i < headers.length; i++) {
        const colNo = i + 1;
        const header = headers[i];
        tableColumns.push({
            Header: header,
            // title: header, // todo
            accessor: 'col' + colNo,
            Footer:
                i === 0
                    ? 'I alt'
                    : toHoursAndMinutes(data.filter((item) => item.on).reduce((sum, current) => sum + current.value, 0)),
        });
    }
    for (let i = 0; i < data.length; i++) {
        const tableRow = data[i];
        tableData.push({ col1: tableRow.projectName, col2: toHoursAndMinutes(tableRow.value) });
    }

    return [tableData, tableColumns];
};

function LegendTable(props: LegendTableProps) {
    const [data, columns] = React.useMemo(() => createTableData(props.data, props.headers), [props.data, props.headers]);
    const { getTableProps, getTableBodyProps, headerGroups, footerGroups, rows, prepareRow } = useTable({ columns, data });

    return (
        <>
            <table
                {...getTableProps({
                    className: 'table is-bordered is-hoverable is-size-7 is-fullwidth is-narrow',
                })}
            >
                <thead>
                    {headerGroups.map((headerGroup) => {
                        const { key, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps();
                        return (
                            <tr key={key} {...restHeaderGroupProps}>
                                {headerGroup.headers.map((column) => {
                                    const { key, ...restColumn } = column.getHeaderProps();
                                    return (
                                        <th key={key} {...restColumn}>
                                            {column.render('Header')}
                                        </th>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row) => {
                        prepareRow(row);
                        const { key, ...restRowProps } = row.getRowProps();
                        const isOff = !props.data[row.index].on;
                        return (
                            <tr key={key} {...restRowProps} onClick={() => props.onRowToggle(row.values.col1)}>
                                {row.cells.map((cell) => {
                                    const { key, ...restCellProps } = cell.getCellProps({ className: ' content' + (isOff ? ' is-off' : '') });
                                    return (
                                        <td key={key} {...restCellProps}>
                                            {cell.column.id === 'col1' && (
                                                <span
                                                    className="color-box"
                                                    style={{
                                                        background: colors.bgColors[row.index],
                                                        borderColor: colors.borderColors[row.index],
                                                    }}
                                                ></span>
                                            )}
                                            {cell.render('Cell')}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
                <tfoot>
                    {footerGroups.map((group) => {
                        const { key, ...restFooterGroupProps } = group.getFooterGroupProps();
                        return (
                            <tr key={key} {...restFooterGroupProps}>
                                {group.headers.map((column) => {
                                    const { key, ...restColumn } = column.getFooterProps();
                                    return (
                                        <th key={key} {...restColumn}>
                                            {column.render('Footer')}
                                        </th>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tfoot>
            </table>
        </>
    );
}

export default LegendTable;
