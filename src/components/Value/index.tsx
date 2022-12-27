/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import CountUp from 'react-countup';

interface ValueProps {
    value: string | number;
    decimals?: number;
    defaultZero?: string;
}

export default function Value({ value, decimals }: ValueProps) {
    const [start, updateStart] = useState(0);
    const [end, updateEnd] = useState(0);

    useEffect(() => {
        if (typeof value === 'number') {
            updateStart(end);
            updateEnd(value);
        }
    }, [value]);

    return (
        <>
            {typeof value == 'string' ? (
                value
            ) : (
                <CountUp
                    start={start}
                    end={end}
                    decimals={
                        decimals !== undefined
                            ? decimals
                            : end < 0
                            ? 4
                            : end > 1e5
                            ? 0
                            : 3
                    }
                    duration={1}
                    separator=","
                />
            )}
        </>
    );
}
