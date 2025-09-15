
import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ControlPanel } from './components/ControlPanel';
import { VisualizationPanel } from './components/VisualizationPanel';
import { EquationModal } from './components/EquationModal';
import { ModulationType, WaveformShape, FrequencyUnit, TimeUnit, WaveformPoint } from './types';

const App: React.FC = () => {
  // Carrier Wave State
  const [carrierAmplitude, setCarrierAmplitude] = useState<number>(5);
  const [carrierFrequency, setCarrierFrequency] = useState<number>(1000);
  const [carrierFreqUnit, setCarrierFreqUnit] = useState<FrequencyUnit>(FrequencyUnit.HZ);

  // Modulating Wave State
  const [modulatingAmplitude, setModulatingAmplitude] = useState<number>(2);
  const [modulatingFrequency, setModulatingFrequency] = useState<number>(100);
  const [modulatingFreqUnit, setModulatingFreqUnit] = useState<FrequencyUnit>(FrequencyUnit.HZ);
  const [modulatingWaveform, setModulatingWaveform] = useState<WaveformShape>(WaveformShape.SINE);

  // Modulation State
  const [modulationType, setModulationType] = useState<ModulationType>(ModulationType.AM);
  const [amModulationIndex, setAmModulationIndex] = useState<number>(0.8);
  const [fmFrequencyDeviation, setFmFrequencyDeviation] = useState<number>(500);
  const [pmPhaseSensitivity, setPmPhaseSensitivity] = useState<number>(1.5);

  // Plotting State
  const [timeDuration, setTimeDuration] = useState<number>(0.02);
  const [timeUnit, setTimeUnit] = useState<TimeUnit>(TimeUnit.S);
  const [samplingFrequency, setSamplingFrequency] = useState<number>(50);
  const [samplingFreqUnit, setSamplingFreqUnit] = useState<FrequencyUnit>(FrequencyUnit.KHZ);

  const [isEquationModalOpen, setIsEquationModalOpen] = useState(false);

  const {
    carrierWave,
    modulatingWave,
    modulatedWave,
    params,
  } = useMemo(() => {
    const getMultiplier = (unit: FrequencyUnit | TimeUnit) => {
      switch (unit) {
        case FrequencyUnit.KHZ: return 1e3;
        case FrequencyUnit.MHZ: return 1e6;
        case TimeUnit.MS: return 1e-3;
        case TimeUnit.US: return 1e-6;
        default: return 1;
      }
    };

    const fc = carrierFrequency * getMultiplier(carrierFreqUnit);
    const fm = modulatingFrequency * getMultiplier(modulatingFreqUnit);
    const Ac = carrierAmplitude;
    const Am = modulatingAmplitude;
    const m = amModulationIndex;
    const df = fmFrequencyDeviation;
    const kp = pmPhaseSensitivity;
    const Fs = samplingFrequency * getMultiplier(samplingFreqUnit);
    const T = timeDuration * getMultiplier(timeUnit);
    const nPoints = Math.floor(T * Fs);
    const t = Array.from({ length: nPoints }, (_, i) => i / Fs);

    const calculatedParams = { fc, fm, Ac, Am, m, df, kp };

    const carrier = t.map(time => ({ time, amplitude: Ac * Math.sin(2 * Math.PI * fc * time) }));

    let modulating: WaveformPoint[] = [];
    if (modulatingWaveform === WaveformShape.SINE) {
      modulating = t.map(time => ({ time, amplitude: Am * Math.sin(2 * Math.PI * fm * time) }));
    } else { // Square Wave
      modulating = t.map(time => ({ time, amplitude: Am * Math.sign(Math.sin(2 * Math.PI * fm * time)) || Am }));
    }

    let modulated: WaveformPoint[] = [];
    switch (modulationType) {
      case ModulationType.AM:
        modulated = t.map((time, i) => {
            const modSignal = modulatingWaveform === WaveformShape.SINE ? Am * Math.sin(2 * Math.PI * fm * time) : modulating[i].amplitude;
            const amplitude = Ac * (1 + m * (modSignal / Am));
            return { time, amplitude: amplitude * Math.sin(2 * Math.PI * fc * time) };
        });
        break;
      case ModulationType.FM:
        const beta = df / fm;
        let cumulativePhase = 0;
        modulated = t.map((time, i) => {
            if (i > 0) {
                const dt = t[i] - t[i-1];
                const modSignal = modulatingWaveform === WaveformShape.SINE ? Am * Math.sin(2 * Math.PI * fm * t[i-1]) : modulating[i-1].amplitude;
                const instFreq = fc + df * (modSignal/Am);
                cumulativePhase += 2 * Math.PI * instFreq * dt;
            }
            return { time, amplitude: Ac * Math.sin(cumulativePhase) };
        });
        break;
      case ModulationType.PM:
        modulated = t.map((time, i) => {
            const modSignal = modulatingWaveform === WaveformShape.SINE ? Am * Math.sin(2 * Math.PI * fm * time) : modulating[i].amplitude;
            const phase = 2 * Math.PI * fc * time + kp * modSignal;
            return { time, amplitude: Ac * Math.sin(phase) };
        });
        break;
      case ModulationType.ASK:
        modulated = t.map((time, i) => {
            const amplitude = modulating[i].amplitude > 0 ? Ac : Ac/4;
            return { time, amplitude: amplitude * Math.sin(2 * Math.PI * fc * time) };
        });
        break;
      case ModulationType.FSK:
        modulated = t.map((time, i) => {
            const freq = modulating[i].amplitude > 0 ? fc + df : fc - df;
            return { time, amplitude: Ac * Math.sin(2 * Math.PI * freq * time) };
        });
        break;
      case ModulationType.PSK:
        modulated = t.map((time, i) => {
            const phase = modulating[i].amplitude > 0 ? 0 : Math.PI;
            return { time, amplitude: Ac * Math.sin(2 * Math.PI * fc * time + phase) };
        });
        break;
    }

    return { carrierWave: carrier, modulatingWave: modulating, modulatedWave: modulated, params: calculatedParams };
  }, [
    carrierAmplitude, carrierFrequency, carrierFreqUnit,
    modulatingAmplitude, modulatingFrequency, modulatingFreqUnit, modulatingWaveform,
    modulationType, amModulationIndex, fmFrequencyDeviation, pmPhaseSensitivity,
    timeDuration, timeUnit, samplingFrequency, samplingFreqUnit
  ]);

  return (
    <div className="min-h-screen bg-gray-850 p-4 lg:p-8 font-sans">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-cyan-400">Wave Modulation Simulator</h1>
        <p className="text-gray-400 mt-2">An interactive tool for visualizing telecommunication signals.</p>
      </header>
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ControlPanel
            carrierAmplitude={carrierAmplitude} setCarrierAmplitude={setCarrierAmplitude}
            carrierFrequency={carrierFrequency} setCarrierFrequency={setCarrierFrequency}
            carrierFreqUnit={carrierFreqUnit} setCarrierFreqUnit={setCarrierFreqUnit}
            
            modulatingAmplitude={modulatingAmplitude} setModulatingAmplitude={setModulatingAmplitude}
            modulatingFrequency={modulatingFrequency} setModulatingFrequency={setModulatingFrequency}
            modulatingFreqUnit={modulatingFreqUnit} setModulatingFreqUnit={setModulatingFreqUnit}
            modulatingWaveform={modulatingWaveform} setModulatingWaveform={setModulatingWaveform}

            modulationType={modulationType} setModulationType={setModulationType}
            amModulationIndex={amModulationIndex} setAmModulationIndex={setAmModulationIndex}
            fmFrequencyDeviation={fmFrequencyDeviation} setFmFrequencyDeviation={setFmFrequencyDeviation}
            pmPhaseSensitivity={pmPhaseSensitivity} setPmPhaseSensitivity={setPmPhaseSensitivity}

            timeDuration={timeDuration} setTimeDuration={setTimeDuration}
            timeUnit={timeUnit} setTimeUnit={setTimeUnit}
            samplingFrequency={samplingFrequency} setSamplingFrequency={setSamplingFrequency}
            samplingFreqUnit={samplingFreqUnit} setSamplingFreqUnit={setSamplingFreqUnit}
          />
        </div>
        <div className="lg:col-span-2">
           <VisualizationPanel 
                carrierWave={carrierWave}
                modulatingWave={modulatingWave}
                modulatedWave={modulatedWave}
                onShowEquations={() => setIsEquationModalOpen(true)}
           />
        </div>
      </main>
      <EquationModal 
        isOpen={isEquationModalOpen}
        onClose={() => setIsEquationModalOpen(false)}
        modulationType={modulationType}
        modulatingWaveform={modulatingWaveform}
        params={params}
      />
      <footer className="fixed bottom-4 right-4 text-gray-600 text-xs opacity-70 pointer-events-none">
        made by reza nurhadi saputra by aistudio
      </footer>
    </div>
  );
};

export default App;
