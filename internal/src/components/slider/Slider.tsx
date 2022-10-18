import React, { FC } from 'react';
import './slider.scss';

export interface Sliderprops {
    onRangeChange: (value: number)=> void;
    maxValue: number;
    minValue: number;
    value: number;
}

const Slider: FC = (props: Sliderprops) => {
    const handleChange = (e) => {
        props.onRangeChange(e.target.value);
    };

    const getBackgroundSize = () => {
        return {
            backgroundSize: `${((props.value - props.minValue) * 100) / (props.maxValue - props.minValue)}% 100%`,
        };
    };
    return (
        <>
            <div className="field">
                <label className="label">Vælg periode: {props.value} dage</label>
                <div className="control is-expanded">
                    <input
                        type="range"
                        min={props.minValue}
                        max={props.maxValue}
                        onChange={handleChange}
                        style={getBackgroundSize()}
                        value={props.value}
                    />
                </div>
            </div>
        </>
    );
};

export default Slider;
