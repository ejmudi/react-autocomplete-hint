import React, {
    useState,
    cloneElement,
    useEffect,
    useRef,
    ReactElement
} from 'react';
import { mergeRefs, interpolateStyle } from './utils';

export interface IHintProps {
    options: Array<string>;
    disableHint?: boolean;
    children: ReactElement;
    allowTabFill?: boolean;
}

export const Hint: React.FC<IHintProps> = props => {
    const child = React.Children.only(props.children) as ReactElement<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>>;

    const {
        options,
        disableHint,
        allowTabFill
    } = props;

    const childProps = child.props;

    let mainInputRef = useRef<HTMLInputElement>(null);
    let hintWrapperRef = useRef<HTMLSpanElement>(null);
    let hintRef = useRef<HTMLInputElement>(null);
    const [text, setText] = useState('');
    const [hint, setHint] = useState('');
    const [changeEvent, setChangeEvent] = useState<React.ChangeEvent<HTMLInputElement>>();

    useEffect(() => {
        if (disableHint) {
            return;
        }

        const inputStyle = mainInputRef.current && window.getComputedStyle(mainInputRef.current);
        inputStyle && styleHint(hintWrapperRef, hintRef, inputStyle);
    });

    const getHint = (text: string) => {
        if (!text || text === '') {
            return '';
        }

        const match = options
            .filter(x => x.toLowerCase() !== text.toLowerCase() && x.toLowerCase().startsWith(text.toLowerCase()))
            .sort()[0];

        return match
            ? match.slice(text.length)
            : '';
    };

    const setAvailableHint = () => {
        if (hint !== '') {
            if (changeEvent) {
                changeEvent.target.value = text + hint;
                childProps.onChange && childProps.onChange(changeEvent);
                setHint('');
            }
        }
    };

    const styleHint = (
        hintWrapperRef: React.RefObject<HTMLSpanElement>,
        hintRef: React.RefObject<HTMLInputElement>,
        inputStyle: CSSStyleDeclaration) => {
        if (hintWrapperRef?.current?.style) {
            hintWrapperRef.current.style.fontFamily = inputStyle.fontFamily;
            hintWrapperRef.current.style.fontSize = inputStyle.fontSize;
            hintWrapperRef.current.style.width = inputStyle.width;
            hintWrapperRef.current.style.height = inputStyle.height;
            hintWrapperRef.current.style.lineHeight = inputStyle.lineHeight;
            hintWrapperRef.current.style.boxSizing = inputStyle.boxSizing;
            hintWrapperRef.current.style.margin = interpolateStyle(inputStyle, 'margin');
            hintWrapperRef.current.style.padding = interpolateStyle(inputStyle, 'padding');
            hintWrapperRef.current.style.borderStyle = interpolateStyle(inputStyle, 'border', 'style');
            hintWrapperRef.current.style.borderWidth = interpolateStyle(inputStyle, 'border', 'width');
        }

        if (hintRef?.current?.style) {
            hintRef.current.style.fontFamily = inputStyle.fontFamily;
            hintRef.current.style.fontSize = inputStyle.fontSize;
            hintRef.current.style.lineHeight = inputStyle.lineHeight;
        }
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChangeEvent(e);
        e.persist();

        setText(e.target.value);
        setHint(getHint(e.target.value));
        childProps.onChange && childProps.onChange(e);
    };

    const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setHint(getHint(e.target.value));
        childProps.onFocus && childProps.onFocus(e);
    };

    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        //Only blur it if the new focus isn't the the hint input
        if (hintRef?.current !== e.relatedTarget) {
            setHint('');
            childProps.onBlur && childProps.onBlur(e);
        }
    };

    const ARROWRIGHT = 'ArrowRight';
    const TAB = 'Tab';
    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const caretIsAtTextEnd = (() => {
            // For selectable input types ("text", "search"), only select the hint if
            // it's at the end of the input value. For non-selectable types ("email",
            // "number"), always select the hint.

            const isNonSelectableType = e.currentTarget.selectionEnd == null;
            const caretIsAtTextEnd = isNonSelectableType
                ? true
                : e.currentTarget.selectionEnd === e.currentTarget.value.length;

            return caretIsAtTextEnd;
        })();

        if (caretIsAtTextEnd && e.key === ARROWRIGHT) {
            setAvailableHint();
        } else if (caretIsAtTextEnd && allowTabFill && e.key === TAB && hint !== '') {
            e.preventDefault();
            setAvailableHint();
        }

        childProps.onKeyDown && childProps.onKeyDown(e);
    };

    const onHintClick = (e: React.MouseEvent<HTMLInputElement>) => {
        const hintCaretPosition = e.currentTarget.selectionEnd || 0;

        // If user clicks the position before the first character of the hint, 
        // move focus to the end of the mainInput text
        if(hintCaretPosition === 0) {
            mainInputRef.current?.focus();
            return;
        }

        if (!!hint && hint !== '') {
            setAvailableHint();
            setTimeout(() => {
                mainInputRef.current?.focus();
                const caretPosition = text.length + hintCaretPosition;
                mainInputRef.current?.setSelectionRange(caretPosition, caretPosition);
            }, 0);
        }
    };

    const mainInput = cloneElement(
        child as any,
        {
            ...childProps,
            style: {
                boxSizing: 'border-box'
            },
            onChange,
            onBlur,
            onFocus,
            onKeyDown,
            ref: childProps.ref && typeof childProps.ref !== 'string'
                ? mergeRefs(childProps.ref, mainInputRef)
                : mainInputRef
        }
    );

    return (
        <div
            className="rah-input-wrapper"
            style={{
                position: 'relative',
                display: 'inline-block'
            }}>
            {
                disableHint
                    ? child
                    : (
                        <>
                            {mainInput}
                            <span
                                className="rah-hint-wrapper"
                                ref={hintWrapperRef}
                                style={{
                                    display: 'flex',
                                    pointerEvents: 'none',
                                    backgroundColor: 'transparent',
                                    borderColor: 'transparent',
                                    boxSizing: 'border-box',
                                    boxShadow: 'none',
                                    color: 'rgba(0, 0, 0, 0.35)',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                }}

                            >
                                <span
                                    style={{
                                        visibility: 'hidden',
                                        pointerEvents: 'none'
                                    }}
                                >
                                    {text}
                                </span>
                                <input
                                    className="rah-hint"
                                    ref={hintRef}
                                    onClick={onHintClick}
                                    style={{
                                        pointerEvents: !hint || hint === '' ? 'none' : 'visible',
                                        background: 'transparent',
                                        width: '100%',
                                        outline: 'none',
                                        border: 'none',
                                        boxShadow: 'none',
                                        padding: 0,
                                        margin: 0,
                                        color: 'rgba(0, 0, 0, 0.35)',
                                        caretColor: 'transparent'
                                    }}
                                    value={hint}
                                    onChange={() => null}
                                    tabIndex={-1}
                                />
                            </span>
                        </>
                    )
            }
        </div>
    );
}