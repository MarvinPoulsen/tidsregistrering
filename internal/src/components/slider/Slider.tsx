import React, { FC, useState } from 'react';
import './slider.scss';

export interface Sliderprops {
    any: any;
}
const max = 90;
const min = 7;

const Slider: FC = () => {
    const [value, setValue] = useState(14);
    const handleChange = (e) => {
        setValue(e.target.value);
        console.log(value);
    };

    const getBackgroundSize = () => {
        return {
            backgroundSize: `${((value - min) * 100) / (max - min)}% 100%`,
        };
    };
    return (
        <>
            <div className="field">
                <label className="label">Vælg periode: {value} dage</label>
                <div className="control is-expanded">
                    <input
                        type="range"
                        min={min}
                        max={max}
                        onChange={handleChange}
                        style={getBackgroundSize()}
                        value={value}
                    />
                </div>
            </div>
        </>
    );
};

export default Slider;
