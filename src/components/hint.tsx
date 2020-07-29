import React, { useState, cloneElement, useEffect, CSSProperties, ReactElement, useRef } from 'react';
import './hint.scss';
import { mergeRefs, interpolateStyle } from '../utils';

export interface IHintProps {
    options: Array<string>;
}

export const Hint: React.FC<IHintProps> = props => {
    // on press of Enter, tab and right key
    const {
        options,
        children: child
    } = props;

    const childProps = (child as ReactElement).props;

    let mainInputRef = useRef<HTMLInputElement>(null);
    let hintRef = useRef<HTMLInputElement>(null);
    const [hint, setHint] = useState('');

    const getHint = (text: string) => {
        if (!text || text === '') {
            return '';
        }

        const match = options.filter(x => x !== text && x.startsWith(text)).sort()[0];
        return match || '';
    };

    useEffect(() => {
        const inputStyle = window.getComputedStyle(mainInputRef.current);

        hintRef.current.style.borderStyle = interpolateStyle(inputStyle, 'border', 'style');
        hintRef.current.style.borderWidth = interpolateStyle(inputStyle, 'border', 'width'),
        hintRef.current.style.fontSize = inputStyle.fontSize;
        hintRef.current.style.height = inputStyle.height;
        hintRef.current.style.lineHeight = inputStyle.lineHeight;
        hintRef.current.style.margin = interpolateStyle(inputStyle, 'margin');
        hintRef.current.style.padding = interpolateStyle(inputStyle, 'padding');
    });

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHint(getHint(e.target.value));
        childProps.onChange && childProps.onChange(e);
    };

    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setHint('');
        childProps.onBlur && childProps.onBlur(e);
    };

    const mainInput = cloneElement(
        child as any,
        {
            ...childProps,
            onChange,
            onBlur,
            ref: mergeRefs(childProps.ref, mainInputRef)
        }
    );

    return (
        <div className="rah-input-wrapper">
            {mainInput}
            <input
                className="rah-input-hint"
                defaultValue={hint}
                ref={hintRef}
                style={{
                    
                        backgroundColor: 'transparent',
                        borderColor: 'transparent',
                        boxShadow: 'none',
                        color: 'rgba(0, 0, 0, 0.35)',
                        pointerEvents: 'none',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                }}
                tabIndex={-1}
            />
        </div>
    );
}