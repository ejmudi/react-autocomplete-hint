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
}

export const Hint: React.FC<IHintProps> = props => {
    const child = React.Children.only(props.children) as ReactElement<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>>;

    const {
        options,
        disableHint
    } = props;

    const childProps = child.props;

    let mainInputRef = useRef<HTMLInputElement>(null);
    let hintRef = useRef<HTMLInputElement>(null);
    const [hint, setHint] = useState('');

    useEffect(() => {
        if (disableHint) {
            return;
        }

        const inputStyle = mainInputRef.current && window.getComputedStyle(mainInputRef.current);
        inputStyle && styleHint(hintRef, inputStyle);
    });

    const getHint = (text: string) => {
        if (!text || text === '') {
            return '';
        }

        const match = options
            .filter(x => x.toLowerCase() !== text.toLowerCase() && x.toLowerCase().startsWith(text.toLowerCase()))
            .sort()[0];

        // While Text matching is case-insensitive, the casing entered by the user so far should be 
        // preserved in the hint for UX benefits and also without the preservation, the hint won't
        // overlap well if user types a different case from the selected option.
        return match
            ? text + match.slice(text.length)
            : '';
    };

    const styleHint = (
        hintRef: React.RefObject<HTMLInputElement>,
        inputStyle: CSSStyleDeclaration) => {
        if (hintRef?.current?.style) {
            hintRef.current.style.fontSize = inputStyle.fontSize;
            hintRef.current.style.width = inputStyle.width;
            hintRef.current.style.height = inputStyle.height;
            hintRef.current.style.lineHeight = inputStyle.lineHeight;
            hintRef.current.style.boxSizing = inputStyle.boxSizing;
            hintRef.current.style.margin = interpolateStyle(inputStyle, 'margin');
            hintRef.current.style.padding = interpolateStyle(inputStyle, 'padding');
            hintRef.current.style.borderStyle = interpolateStyle(inputStyle, 'border', 'style');
            hintRef.current.style.borderWidth = interpolateStyle(inputStyle, 'border', 'width');
        }
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHint(getHint(e.target.value));
        childProps.onChange && childProps.onChange(e);
    };

    const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setHint(getHint(e.target.value));
        childProps.onFocus && childProps.onFocus(e);
    };

    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setHint('');
        childProps.onBlur && childProps.onBlur(e);
    };

    const RIGHT = 39;
    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.keyCode === RIGHT) {
            // For selectable input types ("text", "search"), only select the hint if
            // it's at the end of the input value. For non-selectable types ("email",
            // "number"), always select the hint.

            const isNonSelectableType = e.currentTarget.selectionEnd == null;
            const cursorIsAtTextEnd = isNonSelectableType
                ? true
                : e.currentTarget.selectionEnd === e.currentTarget.value.length

            if (cursorIsAtTextEnd && hint !== '' && e.currentTarget.value !== hint) {
                e.currentTarget.value = hint;
                childProps.onChange && childProps.onChange(e as any);
                setHint('');
            }
        }
        childProps.onKeyDown && childProps.onKeyDown(e);
    };

    const mainInput = cloneElement(
        child as any,
        {
            ...childProps,
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
                                    left: 0
                                }}
                                tabIndex={-1}
                            />
                        </>
                    )
            }
        </div>
    );
}