import React, { FC, useState, useEffect, Component } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker, { registerLocale } from 'react-datepicker';
import da from 'date-fns/locale/da'; // the locale you want
registerLocale('da', da); // register it with the name you want
import Icon from '@mdi/react';
import { mdiUpdate, mdiDeleteClock } from '@mdi/js';
import { TimeEntry } from '../../SPS';

interface FlexTimeRegistrationProps {
  onDateChanged: (date: Date) => void;
  date: Date;
  data: any;
  userId: string;
  onSave: (entry: TimeEntry) => void;
  editEntry?: TimeEntry;
}

const FlexTimeRegistration: FC = (props: FlexTimeRegistrationProps) => {
  console.log('FlexTimeRegistrationProps: ', props);
  const startHours = props.date.getDay() > 0 && props.date.getDay() < 6 ? 8 : 0;
  const endHours =
    props.date.getDay() > 0 && props.date.getDay() < 6
      ? props.date.getDay() < 4
        ? 15
        : props.date.getDay() === 4
        ? 17
        : 13
      : 0;
  const endMinuts =
    props.date.getDay() > 0 && props.date.getDay() < 4
      ? 30
      : props.date.getDay() === 5
      ? 30
      : 0;
  const [flexTimeIn, setFlexTimeIn] = useState(
    props.date.setHours(startHours, 0, 0, 0)
  );
  const [flexTimeOut, setFlexTimeOut] = useState(
    new Date().setHours(endHours, endMinuts, 0, 0)
  );

  console.log('flexTimeIn: ', flexTimeIn);
  console.log('flexTimeOut: ', flexTimeOut);
  const setTime = () => {
    setFlexTimeIn(new Date());
  }
  const resetForm = () => {
    // setTaskId(1);
    // setTime(new Date().setHours(0, 0, 0, 0));
    // setNote('');
  };

  const handleSubmit = (event) => {
    // const timeZero = new Date().setHours(0, 0, 0, 0);
    // event.preventDefault();
    // let minutes = time - timeZero;
    // const formData: TimeEntry = {
    //   taskId,
    //   date: props.date,
    //   time: minutes / 60000,
    //   note,
    //   userId: props.userId,
    // };
    // // hvis editEntry har et id skal vi laver update istedet for insert
    // if (props.editEntry && props.editEntry.id) {
    //   formData.id = props.editEntry.id;
    // }
    // props.onSave(formData);
    // resetForm();
  };

  return (
    <div className="box">
      <form onSubmit={handleSubmit}>
        <div className="block">
          <div className="field is-horizontal columns is-align-items-flex-end">
            <div className="field-label is-normal column is-3">
              <label className="label">Kommet:</label>
            </div>
            <div className="field-body">
              <div className="field column is-6">
                <DatePicker
                  selected={flexTimeIn}
                  onChange={(newTime) => setFlexTimeIn(newTime.getTime())}
                  timeFormat="HH:mm"
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="HH:mm"
                  className="input"
                  name="flexTimeIn"
                  value={flexTimeIn}
                />
              </div>
              <div className="field is-grouped column">
                <button 
                  className="button is-white"                
                  onClick={setTime}
                >
                  <Icon path={mdiUpdate} size={1.2} color="rgb(37, 121, 83)" />
                </button>
                {/* <button className="button is-white">
                  <Icon path={mdiDeleteClock}
                    size={1.2}
                    color="rgb(37, 121, 83)"
                  />
                </button> */}
              </div>
            </div>
          </div>
        </div>
        <div className="block">
          <div className="field is-horizontal columns is-align-items-flex-end">
            <div className="field-label is-normal column is-3">
              <label className="label">Gået:</label>
            </div>
            <div className="field-body">
              <div className="field column is-6">
                <DatePicker
                  selected={flexTimeOut}
                  onChange={(newTime) => setFlexTimeIn(newTime.getTime())}
                  timeFormat="HH:mm"
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="HH:mm"
                  className="input"
                  name="flexTimeOut"
                  value={flexTimeOut}
                />
              </div>
              <div className="field is-grouped column">
                <button className="button is-white">
                  <Icon path={mdiUpdate} size={1.2} color="rgb(37, 121, 83)" />
                </button>
                {/* <button className="button is-white">
                  <Icon path={mdiDeleteClock}
                    size={1.2}
                    color="rgb(37, 121, 83)"
                  />
                </button> */}
              </div>
            </div>
          </div>
        </div>
        <div className="field is-grouped">
          <p className="control">
            <button className="button is-success">Save</button>
          </p>
          <p className="control">
            <button
              className="button is-light"
              type="button"
              onClick={resetForm}
            >
              Cancel
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default FlexTimeRegistration;
