import React from 'react';
import { useTable } from 'react-table';
import './legendTable.scss'
import colors from '../../colors';
import { PiechartData } from './PiechartNoLegend'
import {toHoursAndMinutes} from '../../utils'

interface LegendTableProps {
  headers: string[];
  data: PiechartData[];
  onRowToggle: (projectName: string) => void;
}

const createTableData = (data, headers) => {
  const tableData: object[] = [];
  const tableColumns: object[] = [];
  for (let i = 0; i < headers.length; i++){
    const header = headers[i];
    tableColumns.push({ 
        Header: header,
        title: header, // todo 
        accessor: 'col'+(i+1).toString(),
        Footer: i===0 ? 'I alt': toHoursAndMinutes(data.filter(item=>item.on).reduce((sum, current) => sum + current.value, 0)) 
    })
  }
  for (let i = 0; i < data.length; i++) {
    const tableRow = data[i];
    tableData.push({ col1: tableRow.name, col2: toHoursAndMinutes(tableRow.value) });
  }

  return [tableData, tableColumns];
};

function LegendTable(props: LegendTableProps) {
  const [data, columns] = React.useMemo(
    () => createTableData(props.data, props.headers),
    [props.data, props.headers]
  );
  const { getTableProps, getTableBodyProps, headerGroups, footerGroups, rows, prepareRow } =
    useTable({ columns, data });
  return (
    <table
      {...getTableProps({
        className:
          'table is-bordered is-hoverable is-size-7 is-fullwidth is-narrow',
      })}
    >
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>
                <abbr title={column.render('title')}>
                {column.render('Header')}
                </abbr>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          const isOff = !props.data[row.index].on          
          return (
            <tr {...row.getRowProps()} onClick={()=> props.onRowToggle(row.values.col1)}>
              {row.cells.map((cell) => {
                return (
                  <td {...cell.getCellProps({ className: ' content' +(isOff? ' is-off':'') })}>
                    {cell.column.id === 'col1' && 
                      <span 
                        className='color-box' 
                        style={{
                          background: colors.bgColors[row.index],
                          borderColor: colors.borderColors[row.index]
                        }}
                      >                        
                      </span>
                    }
                    {cell.render('Cell')}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        {footerGroups.map(group => (
          <tr {...group.getFooterGroupProps()}>
            {group.headers.map(column => (
              <th {...column.getFooterProps()}>{column.render('Footer')}</th>
            ))}
          </tr>
        ))}
      </tfoot>
    </table>
  );
}

export default LegendTable;
