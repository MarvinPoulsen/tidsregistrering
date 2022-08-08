import React, { useState } from 'react';
import DatePicker from 'react-datepicker';

// import required css from library
import "react-datepicker/dist/react-datepicker.css";

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';

const TimePicker = () => {
  const [startDate, setStartDate] = useState(new Date().setHours(0, 0, 0, 0));
  return (
    <DatePicker
      selected={startDate}
      onChange={(time) => setStartDate(time)}
      timeFormat="HH:mm"
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={15}
      timeCaption="Time"
      dateFormat="HH:mm"
      className="input"
    />
  );
};

export default TimePicker;
