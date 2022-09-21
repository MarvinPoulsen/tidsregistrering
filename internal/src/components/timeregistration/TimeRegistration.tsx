import React, { FC, useState, useEffect } from 'react';

import 'react-datepicker/dist/react-datepicker.css';
import DatePicker, { registerLocale } from 'react-datepicker';
import da from 'date-fns/locale/da'; // the locale you want
import { TimeEntry } from '../../SPS';
import './timeRegistration.scss';
registerLocale('da', da); // register it with the name you want

interface TimeRegistrationProps {
  onDateChanged: (date: Date) => void;
  date: Date;
  data: any;
  userId: string;
  onSave: (entry: TimeEntry) => void;
  editEntry?: TimeEntry;
}

const TimeRegistration: FC = (props: TimeRegistrationProps) => {
  const [taskId, setTaskId] = useState<number>(1);
  const [note, setNote] = useState('');
  const startHours = props.date.getDay() > 0 && props.date.getDay() < 6 ? 8 : 0; // change to -> if (filter for user and date tmm.registration) has time end set to highest value else 8
  const [startTime, setStartTime] = useState(
    props.date.setHours(startHours, 0, 0, 0)
  );
  const endMinuts = 15;
  const [endTime, setEndTime] = useState(
    props.date.setHours(startHours, endMinuts, 0, 0)
  );
  const timeMinuts = 15;
  const [time, setTime] = useState(new Date().setHours(0, timeMinuts, 0, 0));

  useEffect(() => {
    if (props.editEntry) {
      setTaskId(props.editEntry.taskId);
      setTime(new Date().setHours(0, props.editEntry.time, 0, 0));
      setNote(props.editEntry.note);
    }
  }, [props.editEntry]);

  const handleStartTime = () => {
    setStartTime(new Date());
  };
  const handleEndTime = () => {
    setEndTime(new Date());
  };
  function handleTaskIdChange(event) {
    setTaskId(parseInt(event.target.value));
  }
  function handleNoteChange(event) {
    setNote(event.target.value);
  }
  function handleSubmit(event) {
    const timeZero = new Date().setHours(0, 0, 0, 0);
    event.preventDefault();
    let minutes = time - timeZero;
    const formData: TimeEntry = {
      taskId,
      date: props.date,
      time: minutes / 60000,
      note,
      userId: props.userId,
    };
    // hvis editEntry har et id skal vi laver update istedet for insert
    if (props.editEntry && props.editEntry.id) {
      formData.id = props.editEntry.id;
    }
    props.onSave(formData);
    resetForm();
  }
  function resetForm() {
    setTaskId(1);
    setTime(new Date().setHours(0, 0, 0, 0));
    setNote('');
  }

  const options = props.data;
  const selectedOption = options.find((item) => item.id === taskId);
  const description =
    selectedOption && selectedOption.description !== ''
      ? selectedOption.description
      : 'Ingen beskrivelse af den valgte opgave endnu';

  return (
    <div className="box">
      <div className="block">
        <form onSubmit={handleSubmit}>
          <div className="columns is-align-items-flex-end">
            <div className="column is-1">
              <div className="field">
                <label className="label">OpgaveID</label>
                <input
                  className="input"
                  type="text"
                  placeholder=""
                  onChange={handleTaskIdChange}
                  name="taskId"
                  value={taskId}
                />
              </div>
            </div>
            <div className="column is-3">
              <div className="field">
                <label className="label">Vælg opgave</label>
                <div className="select is-fullwidth">
                  <select
                    onChange={handleTaskIdChange}
                    name="taskId"
                    value={taskId}
                  >
                    {options.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="column is-2">
              <DatePicker
                todayButton="Dags dato"
                selected={props.date}
                onChange={props.onDateChanged}
                locale="da"
                showWeekNumbers
                className="input"
                dateFormat="dd-MM-yyyy"
                name="date"
                value={props.date}
              />
            </div>
            <div className="column is-2">
              {/* <div className="field is-horizontal is-align-items-flex-end columns">
                <div className="field-label is-normal column is-2">
                  <label className="label">Start:</label>
                </div>
                <div className="field-body column">
                  <div className="field">
                    <p className="control">
                      <DatePicker
                        selected={startTime}
                        onChange={(newStartTime) =>
                          setStartTime(newStartTime.getTime())
                        }
                        timeFormat="HH:mm"
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="HH:mm"
                        className="input"
                        name="startTime"
                        value={startTime}
                      />
                    </p>
                  </div>
                </div>
              </div>
              <div className="field is-horizontal is-align-items-flex-end columns">
                <div className="field-label is-normal column is-2">
                  <label className="label">Slut:</label>
                </div>
                <div className="field-body column">
                  <div className="field">
                    <p className="control">
                      <DatePicker
                        selected={endTime}
                        onChange={(newEndTime) =>
                          setEndTime(newEndTime.getTime())
                        }
                        timeFormat="HH:mm"
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="HH:mm"
                        className="input"
                        name="flexTimeOut"
                        value={endTime}
                      />
                    </p>
                  </div>
                </div>
              </div> */}
              <div className="field is-horizontal is-align-items-flex-end columns">
                <div className="field-label is-normal column is-2">
                  <label className="label">Tid:</label>
                </div>
                <div className="field-body column">
                  <div className="field">
                    <p className="control">
                      <DatePicker
                        selected={time}
                        onChange={(newTime) => setTime(newTime.getTime())}
                        timeFormat="HH:mm"
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        timeCaption="Time"
                        dateFormat="HH:mm"
                        className="input"
                        name="time"
                        value={time}
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="column">
              <div className="control">
                <textarea
                  className="textarea"
                  placeholder="Note"
                  rows="2"
                  onChange={handleNoteChange}
                  name="note"
                  value={note}
                />
              </div>
            </div>
            <div className="column is-narrow">
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
            </div>
          </div>
        </form>
      </div>
      <article className="message is-success is-small">
        <div className="message-body">{description}</div>
      </article>
    </div>
  );
};

export default TimeRegistration;
