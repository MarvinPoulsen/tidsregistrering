import React, { FC, useState } from 'react';

import TimePicker from '../timepicker/TimePicker';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker, { registerLocale } from 'react-datepicker';
import da from 'date-fns/locale/da'; // the locale you want
// import { TaskList } from '../../SPS';
registerLocale('da', da); // register it with the name you want

interface TimeRegistrationProps {
  onDateChanged: (date: Date) => void;
  date: Date;
  // data: any;
}

const TimeRegistration: FC = (props: TimeRegistrationProps) => {
  // const options = props.data;
const [startDate, setStartDate] = useState(new Date().setHours(0, 0, 0, 0));
const [formData, setFormData] = useState(
  {taskId: '',
  // taskName: '',
  date: props.date,
  time: startDate,
  note: ''
  }
);

console.log('formData: ',formData);

// function creatList(){
//   options.map((option, index) => (
//     <option key={index} value={index}>
//       {option.name}
//     </option>
//   ))
// }

function handleChange(event){
  console.log('event: ',event);
  console.log('event.target.name: ',event.target.name);
  const {name, value} = event.target

  setFormData(prevFormData => {
    return{
      ...prevFormData,
      [name]: value
    }
  });
}

function handleSubmit(event){
  event.preventDefault()
  // submitToApi(formData)
  console.log(formData)
}

function resetForm(){
  const restDate = new Date().setHours(0, 0, 0, 0);
  console.log(restDate)
  setFormData(()=>{
    return{taskId: '',
    // taskName: '',
    date: props.date,
    time: new Date().setHours(0, 0, 0, 0),
    note: ''

    }
  })
  
}
  return (
    <div className='box'>
      <form onSubmit={handleSubmit}>
      <div className='columns is-align-items-flex-end'>
        <div className='column is-1'>
          <div className='field'>
            <label className='label'>OpgaveID</label>
            <input 
              className='input' 
              type='text' 
              placeholder='' 
              onChange={handleChange} 
              name='taskId'
              value={formData.taskId}
            />
          </div>
        </div>
        <div className='column is-3'>
          <div className='field'>
            <label className='label'>Vælg opgave</label>
            <p class="help is-success">This is a description of the selected task</p>
            <div className='select is-fullwidth'>
              <select
                onChange={handleChange}
                name='taskId'
                value={formData.taskId}
              >
                {/* {options.map((option, index) => (
        <option key={index} value={index}>
          {option.name}
        </option>
      ))} */}
                <option value=''></option>
                <option value='1'>Tidsregistring</option>
                <option value='2'>Tal om Lolland</option>
                <option value='3'>Demolition</option>
                <option value='4'>Teammøder</option>
                <option value='5'>Intern sparring m. andre teams</option>
                <option value='6'>IT support</option>
                <option value='7'>Drift GIS og geodata</option>
                <option value='8'>Lavbundsprojekt</option>
                <option value='9'>Vådområdeprojekt</option>
              </select>
            </div>
            {/* <p class="help is-success">This is a description of the selected task</p> */}
          </div>
        </div>
        <div className='column is-2'>
          <DatePicker
            selected={props.date}
            onChange={props.onDateChanged}
            locale='da'
            showWeekNumbers
            className='input'
            dateFormat='yyyy-MM-dd'
            name='date'
            value={formData.date}
          />
        </div>
        <div className='column is-1'>
          <DatePicker
            selected={startDate}
            onChange={(time) => setStartDate(time)}
            timeFormat='HH:mm'
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption='Time'
            dateFormat='HH:mm'
            className='input'
            name='time'
            value={formData.time}
          />
        </div>
        <div className='column is-3'>
          <div className='control'>
            <textarea 
              className='textarea' 
              placeholder='Note'
              rows='2'
              onChange={handleChange} 
              name='note'
              value={formData.note}
            />
          </div>
        </div>
        <div className='column is-2'>
          <div className='field is-grouped'>
            <p className='control'>
              <button className='button is-success'>
                Save
              </button>
            </p>
            <p className='control'>
              <button 
                className='button is-danger is-outlined' 
                type='button'
                onClick={resetForm}
              >
                Cancel
              </button>
            </p>
          </div>

        </div>
      </div>
      </form>
    </div>
  );
};

export default TimeRegistration;
