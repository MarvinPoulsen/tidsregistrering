import React, { FC, useEffect, useState } from 'react';
import './app.scss';

import Navbar from '../navbar/Navbar';
import TimeRegistration from '../timeregistration/TimeRegistration';
import TimeTable from '../timetable/TimeTable';
import TimeChart from '../timechart/TimeChart';
import SPS, { TimeEntry } from '../../SPS';
import format from 'date-fns/format';
let sps: SPS;

const App: FC = () => {
  const [user, setUser] = useState(null);
  const [timeRegistrationData, setTimeRegistrationData] = useState(null);
  const [taskData, setTaskData] = useState(null);
  const [isDeletingId, setIsDeletingId] = useState<number>(null);
  const [editEntry, setEditEntry] = useState();
  useEffect(async () => {
    sps = new SPS();
    await sps.initialize();
    const user = sps.getUser();
    setUser(user);
    

    const taskData = await sps.getTaskData(); //
    const favoritTasks = await sps.getFavoritTasks();
    const favoritTaskData = taskData.filter(td=>favoritTasks.includes(td.id));
    setTaskData(favoritTaskData);
    refresh();
  }, []);
  const onSave = async (entry: TimeEntry) => {
    // eksistensen af id afgør om det er en update eller insert
    if (entry.id) {
      await sps.updateTimeRegistration(entry);
      setEditEntry(null);
    } else {
      await sps.insertTimeRegistration(entry);
    }
    refresh();
  };
  const onDelete = (id: number) => {
    setIsDeletingId(id);
  };
  const confirmDelete = async () => {
    await sps.deleteTimeRegistration(isDeletingId);
    refresh();
    closeModal();
  };
  const onEdit = (e: TimeEntry) => {
    setEditEntry(e);
  };
  const refresh = async () => {
    const timeRegistrationData = await sps.getTimeRegistrationData(); //user.shortId
    setTimeRegistrationData(timeRegistrationData);
  };

  const closeModal = () => {
    setIsDeletingId(null);
  };

  const [date, setDate] = useState(new Date());
  const [range, setRange] = useState(14);

  const getTaskDescription = (id: number): string => {
    function toHoursAndMinutes(totalMinutes) {
      const minutes = totalMinutes % 60;
      const hours = Math.floor(totalMinutes / 60);
      return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}`;
    }
    function padTo2Digits(num) {
      return num.toString().padStart(2, '0');
    }
    const entry = timeRegistrationData.find((te) => te.id === id);
    const task = taskData.find((t) => t.id === entry.taskId);
    return (
      toHoursAndMinutes(entry.time) +
      ' - ' +
      task.name +
      ' - ' +
      format(entry.date, 'dd-MM-yyyy') +
      ', note: ' +
      entry.note
    );
  };

  return (
    <>
      <section className="hero is-info is-small">
        {user && <Navbar user={user} />}
      </section>
      <section className="section">
        <div className="columns">
          <div className="column is-full">
            {taskData && (
              <TimeRegistration
                onDateChanged={setDate}
                date={date}
                data={taskData}
                userId={user.shortid}
                onSave={onSave}
                editEntry={editEntry}
              />
            )}
          </div>
        </div>
        <div className="columns">
          <div className="column is-half">
            {timeRegistrationData && (
              <TimeTable
                data={timeRegistrationData}
                date={date}
                taskData={taskData}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            )}
          </div>
          <div className="column">
            {timeRegistrationData && (
              <TimeChart
                onDateChanged={setDate}
                date={date}
                data={timeRegistrationData}
                taskData={taskData}
              />
            )}
            
          </div>
        </div>
      </section>
      <div className={'modal' + (isDeletingId ? ' is-active' : '')}>
        <div className="modal-background" onClick={closeModal}></div>
        <div className="modal-content">
          <div className="box">
            {isDeletingId && (
              <p>
                Vil du slette de registrede tid? <br />
                {getTaskDescription(isDeletingId)}
              </p>
            )}
            <button className="button is-danger" onClick={confirmDelete}>
              Slet
            </button>
            <button className="button" onClick={closeModal}>
              Annuler
            </button>
          </div>
        </div>
        <button
          className="modal-close is-large"
          aria-label="close"
          onClick={closeModal}
        ></button>
      </div>
    </>
  );
};

export default App;
