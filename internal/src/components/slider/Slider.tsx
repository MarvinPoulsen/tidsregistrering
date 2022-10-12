import React from 'react';
import './slider.scss';


interface SliderProps {
    onDateChanged: (date: Date) => void;
    value: Number;
  }
const Slider = (props: SliderProps) => {
    console.log('SliderProps: ',props)
    
    return (
    <>
        <div className="slidecontainer">				
            <input
                type="range" 
                min="1" 
                max="60" 
                value="14" 
                className="slider" 
                id="days-slider"
            />
        </div>
    </>
    );
};
export default Slider;
//Slider
// HousingMarket.prototype.updateSlider = function(timeseries){
// 	var max = timeseries.length-1;
// 	spsjq('#month').text(timeseries[max]);
// 	var $slider = spsjq("#month-slider");
// 	$slider.attr('max',max);
// 	$slider.val(max);
// 	$slider.change(function(e){
// 		var index = parseInt(e.target.value);
// 		spsjq('#month').text(timeseries[index]);
// 		this.updateMonthlyCharts(index);
// 	}.bind(this));
	
// }