
import React from 'react';
import { ModulationType, WaveformShape } from '../types';

interface EquationModalProps {
    isOpen: boolean;
    onClose: () => void;
    modulationType: ModulationType;
    modulatingWaveform: WaveformShape;
    params: {
        fc: number;
        fm: number;
        Ac: number;
        Am: number;
        m: number;
        df: number;
        kp: number;
    };
}

const formatFreq = (f: number) => {
    if (f >= 1e6) return `${(f/1e6).toFixed(2)} MHz`;
    if (f >= 1e3) return `${(f/1e3).toFixed(2)} KHz`;
    return `${f.toFixed(2)} Hz`;
}

const EquationDisplay: React.FC<{ title: string, equation: string }> = ({ title, equation }) => (
    <div className="mb-4">
        <h4 className="font-semibold text-cyan-400">{title}:</h4>
        <p className="text-lg bg-gray-800 p-3 rounded-md font-mono tracking-wider break-words">{equation}</p>
    </div>
)

export const EquationModal: React.FC<EquationModalProps> = ({ isOpen, onClose, modulationType, modulatingWaveform, params }) => {
    if (!isOpen) return null;

    const { Ac, Am, fc, fm, m, df, kp } = params;
    const beta = (df/fm).toFixed(2);
    
    const carrierEq = `c(t) = ${Ac.toFixed(2)} sin(2π * ${formatFreq(fc)} * t)`;
    
    let modulatingEq = '';
    if (modulatingWaveform === WaveformShape.SINE) {
        modulatingEq = `m(t) = ${Am.toFixed(2)} sin(2π * ${formatFreq(fm)} * t)`;
    } else {
        modulatingEq = `m(t) = Square wave with Amplitude ${Am.toFixed(2)}V and Frequency ${formatFreq(fm)}`;
    }

    let modulatedEq = '';
    switch (modulationType) {
        case ModulationType.AM:
            modulatedEq = `s(t) = ${Ac.toFixed(2)} [1 + ${m.toFixed(2)} * m(t)/${Am.toFixed(2)}] sin(2π * ${formatFreq(fc)} * t)`;
            break;
        case ModulationType.FM:
             modulatedEq = `s(t) = ${Ac.toFixed(2)} sin(2π * ${formatFreq(fc)} * t + ${beta} * sin(2π * ${formatFreq(fm)} * t))`;
            break;
        case ModulationType.PM:
             modulatedEq = `s(t) = ${Ac.toFixed(2)} sin(2π * ${formatFreq(fc)} * t + ${kp.toFixed(2)} * m(t))`;
            break;
        case ModulationType.ASK:
            modulatedEq = `s(t) = A(t) * sin(2π * ${formatFreq(fc)} * t), where A(t) shifts based on m(t)`;
            break;
        case ModulationType.FSK:
            modulatedEq = `s(t) = ${Ac.toFixed(2)} sin(2π * f(t) * t), where f(t) shifts between ${formatFreq(fc - df)} and ${formatFreq(fc + df)}`;
            break;
        case ModulationType.PSK:
            modulatedEq = `s(t) = ${Ac.toFixed(2)} sin(2π * ${formatFreq(fc)} * t + φ(t)), where φ(t) shifts based on m(t)`;
            break;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-gray-900 rounded-lg shadow-2xl p-8 w-full max-w-2xl border border-gray-700" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-cyan-300">Signal Equations</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl">&times;</button>
                </div>
                <div className="space-y-4">
                    <EquationDisplay title="Carrier Wave" equation={carrierEq} />
                    <EquationDisplay title="Modulating Wave" equation={modulatingEq} />
                    <EquationDisplay title="Modulated Wave" equation={modulatedEq} />
                </div>
            </div>
        </div>
    );
};
