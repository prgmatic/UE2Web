import { useEffect, useState } from 'react';
import { Emulator } from '../emulator/Emulator';
import { throttle } from 'lodash';

import {
  PlayIcon,
  PauseIcon,
  SquareIcon,
  StepForwardIcon,
} from 'lucide-react';

interface StepperControlsProps {
  emulator: Emulator;
}

const StepperControls: React.FC<StepperControlsProps> = ({ emulator }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isComputerOff, setIsComputerOff] = useState(true);
  const [tickRate, setTickRate] = useState(emulator.tickRate);
  const [tickCount, setTickCount] = useState(emulator.tickCount);


  const handleSingleStep = () => {
    emulator.singleStep();
  };

  const handleToggleRun = () => {
    if (isRunning) {
      emulator.pause();
    } else {
      emulator.run();
    }
  };

  const handleStop = () => {
    emulator.stop();
  };

  const handleTickRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setTickRate(value);
      emulator.tickRate = value;
    }
  };

  useEffect(() => {
    const update = () => {

      setIsComputerOff(!emulator.isAssembled);
      setIsRunning(emulator.isRunning);
      setTickCount(emulator.tickCount);
    }

    const throttledUpdate = throttle(update, 16, {
      leading: true,
      trailing: true,
    });

    emulator.onStateUpdated(throttledUpdate);
    throttledUpdate();

    return () => { throttledUpdate.cancel(); }
  }, [emulator])

  return (
    <div className="mb-4 px-4">
      <div className="flex gap-4 justify-center mb-2">
        <div className="flex gap-2 grow justify-end mb-2 mr-6">
          <button
            className="stepper-button hover:brightness-110 rounded disabled:opacity-50"
            onClick={handleSingleStep}
            disabled={isRunning}
          >
            <StepForwardIcon size={24} className='stroke-blue-300' />
          </button>

          <button
            className={`stepper-button hover:brightness-110  rounded`}
            onClick={handleToggleRun}
          >
            {isRunning ? <PauseIcon size={24} className='stroke-yellow-200' /> : <PlayIcon size={24} className='stroke-green-200' />}
          </button>

          <button
            className="stepper-button hover:brightness-110 rounded disabled:opacity-50"
            onClick={handleStop}
            disabled={isComputerOff}
          >
            <SquareIcon size={24} className='stroke-red-300' />
          </button>
        </div>
      </div>

      <div className='flex flex-row justify-center items-start gap-6'>


        <div className="flex flex-col items-center">
          <label htmlFor="tickRate" className="mb-1 text-sm font-medium">
            Tick Rate (Hz)
          </label>
          <input
            id="tickRate"
            type="number"
            min={1}
            value={tickRate}
            onChange={handleTickRateChange}
            className="w-24 px-2 py-1 border rounded text-center"
          />
        </div>

        <div className="flex flex-col items-center justify-start">
          <span className="text-sm font-medium mb-2">Tick Count:</span>
          <span className="text-lg font-mono">{tickCount}</span>
        </div>
      </div>
    </div>
  );
};

export default StepperControls;