
import React from 'react';
import { ModulationType, WaveformShape, FrequencyUnit, TimeUnit } from '../types';

interface ControlPanelProps {
    carrierAmplitude: number;
    setCarrierAmplitude: (val: number) => void;
    carrierFrequency: number;
    setCarrierFrequency: (val: number) => void;
    carrierFreqUnit: FrequencyUnit;
    setCarrierFreqUnit: (val: FrequencyUnit) => void;
    modulatingAmplitude: number;
    setModulatingAmplitude: (val: number) => void;
    modulatingFrequency: number;
    setModulatingFrequency: (val: number) => void;
    modulatingFreqUnit: FrequencyUnit;
    setModulatingFreqUnit: (val: FrequencyUnit) => void;
    modulatingWaveform: WaveformShape;
    setModulatingWaveform: (val: WaveformShape) => void;
    modulationType: ModulationType;
    setModulationType: (val: ModulationType) => void;
    amModulationIndex: number;
    setAmModulationIndex: (val: number) => void;
    fmFrequencyDeviation: number;
    setFmFrequencyDeviation: (val: number) => void;
    pmPhaseSensitivity: number;
    setPmPhaseSensitivity: (val: number) => void;
    timeDuration: number;
    setTimeDuration: (val: number) => void;
    timeUnit: TimeUnit;
    setTimeUnit: (val: TimeUnit) => void;
    samplingFrequency: number;
    setSamplingFrequency: (val: number) => void;
    samplingFreqUnit: FrequencyUnit;
    setSamplingFreqUnit: (val: FrequencyUnit) => void;
}

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-gray-900 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-cyan-400 mb-4 border-b border-gray-600 pb-2">{title}</h3>
        {children}
    </div>
);

const InputGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        {children}
    </div>
);

const NumberInput: React.FC<{ value: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; step?: number; min?: number }> = ({ value, onChange, step = 0.1, min = 0 }) => (
    <input type="number" value={value} onChange={onChange} step={step} min={min} className="w-full bg-gray-700 text-white rounded-md p-2 border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none"/>
);

const Select: React.FC<{ value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode }> = ({ value, onChange, children }) => (
    <select value={value} onChange={onChange} className="w-full bg-gray-700 text-white rounded-md p-2 border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none">
        {children}
    </select>
);

export const ControlPanel: React.FC<ControlPanelProps> = (props) => {
    
    const vrmsCarrier = (props.carrierAmplitude / Math.sqrt(2)).toFixed(2);
    const vrmsModulating = (props.modulatingAmplitude / Math.sqrt(2)).toFixed(2);
    
    return (
        <div className="flex flex-col space-y-6">
            <Card title="Carrier Wave (c(t))">
                <InputGroup label={`Amplitude (Ac): ${props.carrierAmplitude} Vp`}>
                    <input type="range" min="0.1" max="20" step="0.1" value={props.carrierAmplitude} onChange={(e) => props.setCarrierAmplitude(parseFloat(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"/>
                    <div className="text-xs text-gray-500 mt-1">Vrms: {vrmsCarrier}V</div>
                </InputGroup>
                <InputGroup label="Frequency (fc)">
                    <div className="flex space-x-2">
                        <NumberInput value={props.carrierFrequency} onChange={(e) => props.setCarrierFrequency(parseFloat(e.target.value))} />
                        <Select value={props.carrierFreqUnit} onChange={(e) => props.setCarrierFreqUnit(e.target.value as FrequencyUnit)}>
                            {Object.values(FrequencyUnit).map(unit => <option key={unit} value={unit}>{unit}</option>)}
                        </Select>
                    </div>
                </InputGroup>
            </Card>

            <Card title="Modulating Wave (m(t))">
                <InputGroup label={`Amplitude (Am): ${props.modulatingAmplitude} Vp`}>
                     <input type="range" min="0.1" max="20" step="0.1" value={props.modulatingAmplitude} onChange={(e) => props.setModulatingAmplitude(parseFloat(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"/>
                     <div className="text-xs text-gray-500 mt-1">Vrms: {vrmsModulating}V</div>
                </InputGroup>
                <InputGroup label="Frequency (fm)">
                    <div className="flex space-x-2">
                        <NumberInput value={props.modulatingFrequency} onChange={(e) => props.setModulatingFrequency(parseFloat(e.target.value))} />
                        <Select value={props.modulatingFreqUnit} onChange={(e) => props.setModulatingFreqUnit(e.target.value as FrequencyUnit)}>
                            {Object.values(FrequencyUnit).map(unit => <option key={unit} value={unit}>{unit}</option>)}
                        </Select>
                    </div>
                </InputGroup>
                 <InputGroup label="Waveform Shape">
                    <Select value={props.modulatingWaveform} onChange={(e) => props.setModulatingWaveform(e.target.value as WaveformShape)}>
                        {Object.values(WaveformShape).map(shape => <option key={shape} value={shape}>{shape}</option>)}
                    </Select>
                </InputGroup>
            </Card>

             <Card title="Modulation Parameters">
                <InputGroup label="Modulation Type">
                    <Select value={props.modulationType} onChange={(e) => props.setModulationType(e.target.value as ModulationType)}>
                        <optgroup label="Analog Modulation">
                            <option value={ModulationType.AM}>AM (Amplitude Modulation)</option>
                            <option value={ModulationType.FM}>FM (Frequency Modulation)</option>
                            <option value={ModulationType.PM}>PM (Phase Modulation)</option>
                        </optgroup>
                        <optgroup label="Digital Modulation">
                            <option value={ModulationType.ASK}>ASK (Amplitude Shift Keying)</option>
                            <option value={ModulationType.FSK}>FSK (Frequency Shift Keying)</option>
                            <option value={ModulationType.PSK}>PSK (Phase Shift Keying)</option>
                        </optgroup>
                    </Select>
                </InputGroup>
                {props.modulationType === ModulationType.AM && (
                    <InputGroup label={`Modulation Index (m): ${props.amModulationIndex}`}>
                         <input type="range" min="0" max="2" step="0.05" value={props.amModulationIndex} onChange={(e) => props.setAmModulationIndex(parseFloat(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"/>
                    </InputGroup>
                )}
                {(props.modulationType === ModulationType.FM || props.modulationType === ModulationType.FSK) && (
                    <InputGroup label="Frequency Deviation (Δf)">
                        <NumberInput value={props.fmFrequencyDeviation} onChange={(e) => props.setFmFrequencyDeviation(parseFloat(e.target.value))} />
                    </InputGroup>
                )}
                {props.modulationType === ModulationType.PM && (
                    <InputGroup label={`Phase Sensitivity (kp): ${props.pmPhaseSensitivity}`}>
                        <input type="range" min="0" max="10" step="0.1" value={props.pmPhaseSensitivity} onChange={(e) => props.setPmPhaseSensitivity(parseFloat(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"/>
                    </InputGroup>
                )}
            </Card>

            <Card title="Plotting Controls">
                <InputGroup label="Time Scale (Duration)">
                    <div className="flex space-x-2">
                         <NumberInput value={props.timeDuration} onChange={(e) => props.setTimeDuration(parseFloat(e.target.value))} min={0.001} step={0.001} />
                         <Select value={props.timeUnit} onChange={(e) => props.setTimeUnit(e.target.value as TimeUnit)}>
                             {Object.values(TimeUnit).map(unit => <option key={unit} value={unit}>{unit}</option>)}
                         </Select>
                    </div>
                </InputGroup>
                <InputGroup label="Sampling Frequency (Fs)">
                    <div className="flex space-x-2">
                        <NumberInput value={props.samplingFrequency} onChange={(e) => props.setSamplingFrequency(parseFloat(e.target.value))} min={1} />
                        <Select value={props.samplingFreqUnit} onChange={(e) => props.setSamplingFreqUnit(e.target.value as FrequencyUnit)}>
                             {Object.values(FrequencyUnit).map(unit => <option key={unit} value={unit}>{unit}</option>)}
                        </Select>
                    </div>
                     <div className="text-xs text-gray-500 mt-1">Higher Fs provides better resolution.</div>
                </InputGroup>
            </Card>
        </div>
    );
};
