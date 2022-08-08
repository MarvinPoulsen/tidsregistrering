import React from 'react';
import { useTable } from 'react-table'
import { MdModeEdit, MdDelete } from "react-icons/md";
import { TaskList, TimeEntry } from '../../SPS';
import format from 'date-fns/format'
import { isSameDay } from 'date-fns';

// const editButton: string = ''
interface TimeTableProps{
  date: Date;
  data: TimeEntry[];
  taskData: TaskList[];
  onDelete: (id:number) => void;
  onEdit: (entry:TimeEntry) => void;
}
function toHoursAndMinutes(totalMinutes) {
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);

  return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}`;
}

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

 function TimeTable(props: TimeTableProps) {
  const filteredTasks = props.data.filter((te)=>isSameDay(te.date, props.date))
  const tasks =  filteredTasks.map((element) => {
    const task = props.taskData.find(t => t.id === element.taskId)
    return {
      col1: <a onClick={()=>props.onEdit(element)}> 
              <MdModeEdit />
            </a>,
      col2: <a onClick={()=>props.onDelete(element.id)}>
              <MdDelete />
            </a>,
      col3: task.name,
      col4: format(element.date, 'dd-MM-yyyy'),
      col5: toHoursAndMinutes(element.time),
      col6: element.note,
    }
  });
  const data = React.useMemo(() => tasks,[props.date,props.data])
 
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
   )
 
   const {
     getTableProps,
     getTableBodyProps,
     headerGroups,
     rows,
     prepareRow,
   } = useTable({ columns, data })
 
   return (
     <table {...getTableProps({className: 'table is-bordered is-narrow is-hoverable is-fullwidth'})}>
       <thead>
         {headerGroups.map(headerGroup => (
           <tr {...headerGroup.getHeaderGroupProps()}>
             {headerGroup.headers.map(column => (
               <th
                 {...column.getHeaderProps()}
               >
                 {column.render('Header')}
               </th>
             ))}
           </tr>
         ))}
       </thead>
       <tbody {...getTableBodyProps()}>
         {rows.map(row => {
           prepareRow(row)
           return (
             <tr {...row.getRowProps()}>
               {row.cells.map(cell => {
                 return (
                   <td
                     {...cell.getCellProps()}
                   >
                     {cell.render('Cell')}
                   </td>
                 )
               })}
             </tr>
           )
         })}
       </tbody>
     </table>
   )
 }
 export default TimeTable