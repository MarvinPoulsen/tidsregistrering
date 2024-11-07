// Import statements
import React from 'react';
import { toHoursAndMinutes } from '../../utils';
import { MyAbsencePresence } from '../app/App';
// Interface definitions

interface WeekStatusProps {
    isWeekStatusActive: boolean;
    setIsWeekStatusActive: (isOn: boolean) => void;
    flex: number;
    vacation: number;
    illness: number;
    norm: number;
    myAbsencePresence: MyAbsencePresence;
}
// Constants
// Helper functions
// Component
const WeekStatus = (props: WeekStatusProps) => {
    // useState hooks
    // useRef hooks
    // Functions
    const handleClose = () => {
        props.setIsWeekStatusActive(false);
    };
    // useEffect hooks
    // Data processing
    const flex = toHoursAndMinutes(props.flex);
    const flexImpact = Math.round((props.flex/60)*100)/100
    const vacation = toHoursAndMinutes(props.vacation);
    const illness = toHoursAndMinutes(props.illness);
    const norm = toHoursAndMinutes(props.norm);
    const {ssoUrl , mitIdUrl} = props.myAbsencePresence;
    // Conditional values
    // Component return
    return (
        <>
            <div className={'modal' + (props.isWeekStatusActive ? ' is-active' : '')}>
                <div className="modal-background" onClick={handleClose}></div>
                <div className="modal-content">
                    <div className="notification">
                        <button className="delete" onClick={handleClose}></button>
                        <div className="content">
                            <h1>Ugens registrering</h1>
                            <p>Flex balance: {flex}</p>
                            <p>Flexpåvirkning: {flexImpact}</p>
                            <p> Ferie: {vacation}</p>
                            <p> Fravær: {illness}</p>
                            <p> Norm: {norm}</p>
                            <p className="is-italic">Der er taget højde for helligdage i flex balancen</p>
                            <p>
                                <a href={ssoUrl} target="_blank" className="button">
                                    Mit Fravær/Nærvær - (Single Sign On)
                                </a>
                            </p>
                            <p>
                                <a href={mitIdUrl} target="_blank" className="button">
                                    Mit Fravær/Nærvær - MitID
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
                {/* <button className="modal-close is-large" aria-label="close"></button> */}
            </div>
        </>
    );
};

// Component export
export default WeekStatus;
