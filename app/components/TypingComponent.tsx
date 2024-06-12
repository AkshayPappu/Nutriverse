import React, { useState } from 'react';
import { Typewriter } from 'react-simple-typewriter';

const TypingComponent = () => {

  return (
    <div className="text-5xl font-semibold">
      Nutriverse:&nbsp;
      <span className={'text-green-300'}>
        <Typewriter
          words={[
            'Fueling Your Journey to Health.',
            'Your Gateway to Nutritious Living.',
            'Where Every Meal Matters.',
            'Healthy Eating, Simplified.'
          ]}
          loop={0}
          cursor
          cursorStyle="|"
          typeSpeed={120}
          deleteSpeed={100}
          delaySpeed={1000}
        />
      </span>
    </div>
  );
};

export default TypingComponent;
