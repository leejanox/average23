declare module "react-slider" {
    import React from "react";
    export interface SliderProps {
      min?: number;
      max?: number;
      value?: number | number[];
      onChange?: (value: number | number[]) => void;
      className?: string;
      thumbClassName?: string;
      trackClassName?: string;
    }
    const Slider: React.FC<SliderProps>;
    export default Slider;
}
  