import React, { useState } from 'react';
import DatePicker from 'react-datepicker';

// import required css from library
import "react-datepicker/dist/react-datepicker.css";

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';

const DateFilter = () => {
  const [startDate, setStartDate] = useState(new Date());
  return (
    <DatePicker 
      selected={startDate}
      onChange={date => setStartDate(date)}
      locale ="da_DK"
      showWeekNumbers
      className="input"
      dateFormat="yyyy-MM-dd"
    />
  );
};

export default DateFilter;
