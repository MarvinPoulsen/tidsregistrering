// Import statements
import React, { useState } from 'react';
import { getWeek, lastDayOfWeek, startOfWeek } from 'date-fns';
import { da } from 'date-fns/locale';
import { ToolbarProps as OriginalToolbarProps, View, Event } from 'react-big-calendar';
import { toHoursAndMinutes, getPeriodData } from '../../utils';
import WeekStatus from '../../components/modal/WeekStatus';

// Interface definitions

interface ToolbarProps extends OriginalToolbarProps {
    events: Event[];
    holidays: Event[];
    norms: number[];
}

// Constants

// Helper functions

// Component
const CustomToolbar = ({
    onNavigate,
    onView,
    localizer: { messages },
    label,
    views,
    view,
    date,
    events, // Add events prop here
    norms, // Add events prop here
    holidays, // Add events prop here
}: ToolbarProps) => {
    // useState hooks
    const [isWeekStatusActive, setIsWeekStatusActive] = useState<boolean>(false);

    // useRef hooks

    // Functions

    // useEffect hooks

    // Data processing

    let resultStart = startOfWeek(date, { weekStartsOn: 1 });
    const resultEnd = lastDayOfWeek(date, { weekStartsOn: 1 });

    const { flex, vacation, illness, normTime: norm} = getPeriodData(resultStart, resultEnd, events, holidays, norms);

    const ViewNamesGroup = () => {
        let viewNames = views as string[];

        if (viewNames.length > 1) {
            return viewNames.map((name) => (
                <button
                    type="button"
                    key={name}
                    // className={clsx({ 'rbc-active': view === name })}
                    className={`rbc-active ${view === name ? 'rbc-active' : ''}`}
                    onClick={() => onView(name as View)}
                >
                    {(messages as any)[name]}
                </button>
            ));
        }
    };

    const week = getWeek(date, {
        locale: da,
        weekStartsOn: 1,
    });

    // Conditional values
    const flexBalanceText = flex < 0 ? 'button has-text-danger has-text-weight-semibold' : 'button has-text-weight-semibold';

    // Component return
    return (
        <>
            <div className="rbc-toolbar">
                <span className="rbc-btn-group">
                    <button type="button" onClick={() => onNavigate('TODAY')}>
                        {/* {messages.today} */}
                        {/* Dags dato */}I dag
                    </button>
                    <button type="button" onClick={() => onNavigate('PREV')}>
                        {/* {messages.previous} */}
                        &#60;
                    </button>
                    <button type="button" onClick={() => onNavigate('NEXT')}>
                        {/* {messages.next} */}
                        &#62;
                    </button>
                </span>

                <span className="rbc-toolbar-label">
                    Uge {week} ({label})
                </span>

                <span className="rbc-btn-group">
                    <ViewNamesGroup />
                    <button type="button" onClick={() => setIsWeekStatusActive(true)} className={flexBalanceText}>
                        {toHoursAndMinutes(flex)}
                    </button>
                </span>
            </div>
            <WeekStatus
                isWeekStatusActive={isWeekStatusActive}
                setIsWeekStatusActive={setIsWeekStatusActive}
                flex={flex}
                vacation={vacation}
                illness={illness}
                norm={norm}
            />
        </>
    );
};
export default CustomToolbar;
