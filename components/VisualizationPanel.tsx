
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { WaveformPoint } from '../types';

interface VisualizationPanelProps {
    carrierWave: WaveformPoint[];
    modulatingWave: WaveformPoint[];
    modulatedWave: WaveformPoint[];
    onShowEquations: () => void;
}

const WaveformPlot: React.FC<{ title: string; data: WaveformPoint[]; color: string; }> = ({ title, data, color }) => {
    return (
        <div className="h-64 bg-gray-900 rounded-lg p-4 border border-gray-700">
            <h4 className="text-lg font-semibold text-center text-gray-300 mb-4">{title}</h4>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 20, left: -15, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                    <XAxis 
                        dataKey="time" 
                        stroke="#9CA3AF" 
                        tickFormatter={(t) => t.toExponential(1)} 
                        label={{ value: 'Time (s)', position: 'insideBottom', offset: -10, fill: '#9CA3AF' }}
                    />
                    <YAxis 
                        stroke="#9CA3AF" 
                        domain={['auto', 'auto']} 
                        label={{ value: 'Amplitude (V)', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563', color: '#E5E7EB' }}
                        labelStyle={{ color: '#E5E7EB' }}
                        formatter={(value: number) => [value.toFixed(2), 'Amplitude']}
                        labelFormatter={(label: number) => `t = ${label.toExponential(3)}s`}
                    />
                    <Line type="monotone" dataKey="amplitude" stroke={color} dot={false} isAnimationActive={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};


export const VisualizationPanel: React.FC<VisualizationPanelProps> = ({ carrierWave, modulatingWave, modulatedWave, onShowEquations }) => {
    return (
        <div className="flex flex-col space-y-6">
            <WaveformPlot title="Carrier Wave" data={carrierWave} color="#38BDF8" />
            <WaveformPlot title="Modulating Wave" data={modulatingWave} color="#34D399" />
            <WaveformPlot title="Modulated Wave" data={modulatedWave} color="#F472B6" />
            <div className="flex justify-center mt-4">
                <button 
                    onClick={onShowEquations}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out shadow-md"
                >
                    Show Equations
                </button>
            </div>
        </div>
    );
}
