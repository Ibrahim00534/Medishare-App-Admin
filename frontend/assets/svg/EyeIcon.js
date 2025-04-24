// EyeIcon.js
import React from 'react';
import Svg, { Path } from 'react-native-svg';

const EyeIcon = ({ isVisible }) => {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <Path
        d={isVisible 
          ? "M12 4.5C6.75 4.5 2.25 10.5 2.25 10.5s4.5 6 9.75 6 9.75-6 9.75-6S17.25 4.5 12 4.5zm0 9C9.75 13.5 8 11.25 8 9.75c0-1.5 1.5-3 4-3 2.5 0 4 1.5 4 3 0 1.5-1.5 3-4 3z"
          : "M12 4.5C6.75 4.5 2.25 10.5 2.25 10.5s4.5 6 9.75 6 9.75-6 9.75-6S17.25 4.5 12 4.5zm0 9c-1.5 0-2.25-1.5-2.25-2.25 0-1.5 1.5-2.25 2.25-2.25 1.5 0 2.25 1.5 2.25 2.25S13.5 13.5 12 13.5zm0-9a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"
        }
        fill="#009387"
      />
    </Svg>
  );
};

export default EyeIcon;
