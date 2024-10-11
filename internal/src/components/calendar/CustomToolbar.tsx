import { getWeek, lastDayOfWeek, startOfWeek } from 'date-fns';
import { da } from 'date-fns/locale';
import React from 'react';
import { ToolbarProps as OriginalToolbarProps, View, Event } from 'react-big-calendar';
import { toHoursAndMinutes, getPeriodData } from '../../utils';

interface ToolbarProps extends OriginalToolbarProps {
    events: Event[];
    holidays: Event[];
    norms: number[];
}

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
   
    let resultStart = startOfWeek(date, { weekStartsOn: 1 })
    const resultEnd = lastDayOfWeek(date, { weekStartsOn: 1 })
    
    const { flex, vacation, illness } = getPeriodData(resultStart,resultEnd,events,holidays,norms);
    
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

    const flexBalanceText = flex < 0 ? 'button has-text-danger has-text-weight-semibold' : 'button has-text-weight-semibold';

    return (
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
                <button type="button" onClick={() => console.log('flex: ', flex,'\nferie: ', vacation,'\nsygdom: ', illness,'\nnorm: ', norms)} className={flexBalanceText}>
                    {toHoursAndMinutes(flex)}
                </button>
            </span>
        </div>
    );
};
export default CustomToolbar;
