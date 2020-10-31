import React, { useRef } from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Hint, IHintOption } from '..';
import { renderHook } from '@testing-library/react-hooks';
import '@testing-library/jest-dom/extend-expect';

const stringOptions = ['Persimmon', 'Pears', 'Pea', 'Papaya', 'Apples', 'Apricots', 'Avocados'];
const objectOptions = [
    {
        id: '1',
        text: 'Persimmon'
    },
    {
        id: '2',
        text: 'Pears'
    },
    {
        id: '3',
        text: 'Pea'
    },
    {
        id: '4',
        text: 'Papaya'
    },
    {
        id: '5',
        text: 'Apples'
    },
    {
        id: '6',
        text: 'Apricots'
    },
    {
        id: '7',
        text: 'Avocados'
    }
];
const handleChange = jest.fn();
const ArrowRight = 'ArrowRight';
const Tab = 'Tab';
let input: HTMLInputElement;
let hint: HTMLInputElement;
let textFiller: HTMLSpanElement;

describe('Hint input without allowTabFill prop', () => {
    describe('With string options', () => {
        beforeEach(() => {
            const { container } = render(
                <Hint options={stringOptions}>
                    <input onChange={handleChange} />
                </Hint>
            );

            [input, hint, textFiller] = getElements(container);
        });

        runCommonTests();

        it('should not have autocomplete functionality when disableHint is set to true', () => {
            const { container } = render(
                <Hint options={stringOptions} disableHint={true}>
                    <input onChange={handleChange} />
                </Hint>
            );

            const inputs = container.getElementsByTagName('input');
            expect(inputs.length).toBe(1);
        });

        it('should call onAutoComplete callback once input gets filled with hint', () => {
            const handleOnAutoComplete = jest.fn();

            const { container } = render(
                <Hint options={stringOptions} onAutoComplete={handleOnAutoComplete}>
                    <input onChange={handleChange} />
                </Hint>
            );
            const inputs = container.getElementsByTagName('input');
            const input = inputs[0];
            const hint = inputs[1];

            fireEvent.change(input, { target: { value: 'Pe' } });
            fireEvent.keyDown(input, { key: ArrowRight });
            expect(handleOnAutoComplete).toHaveBeenCalledWith('Pea');

            input.focus();

            fireEvent.change(input, { target: { value: 'Pea' } });
            fireEvent.click(hint, { target: { selectionEnd: 1 } });
            expect(handleOnAutoComplete).toHaveBeenCalledWith('Pears');

            input.focus();

            fireEvent.change(input, { target: { value: 'Per' } });
            fireEvent.keyDown(input, { key: Tab });
            expect(handleOnAutoComplete).toHaveBeenCalledTimes(2);
        });

        it('should not clash with other hint input instances', () => {
            const { container } = render(
                <>
                    <Hint options={stringOptions.slice()}>
                        <input onChange={handleChange} />
                    </Hint>
                    <Hint options={stringOptions.slice()}>
                        <input onChange={handleChange} />
                    </Hint>
                </>
            );

            runMultipleInstancesTest(container);
        });
    });

    describe('With object options', () => {
        beforeEach(() => {
            const { container } = render(
                <Hint options={objectOptions}>
                    <input onChange={handleChange} />
                </Hint>
            );

            input = container.getElementsByTagName('input')[0];
            hint = container.getElementsByTagName('input')[1];
            textFiller = container.getElementsByClassName('rah-text-filler')[0] as HTMLSpanElement;
        });

        runCommonTests();

        it('should call onAutoComplete callback once input gets filled with hint', () => {
            const handleOnAutoComplete = jest.fn();

            const { container } = render(
                <Hint options={objectOptions} onAutoComplete={handleOnAutoComplete}>
                    <input onChange={handleChange} />
                </Hint>
            );
            const inputs = container.getElementsByTagName('input');
            const input = inputs[0];
            const hint = inputs[1];

            fireEvent.change(input, { target: { value: 'Pe' } });
            fireEvent.keyDown(input, { key: ArrowRight });
            expect(handleOnAutoComplete).toHaveBeenCalledWith({
                id: '3',
                text: 'Pea'
            });

            input.focus();

            fireEvent.change(input, { target: { value: 'Pea' } });
            fireEvent.click(hint, { target: { selectionEnd: 1 } });
            expect(handleOnAutoComplete).toHaveBeenCalledWith({
                id: '2',
                text: 'Pears'
            });

            input.focus();

            fireEvent.change(input, { target: { value: 'Per' } });
            fireEvent.keyDown(input, { key: Tab });
            expect(handleOnAutoComplete).toHaveBeenCalledTimes(2);
        });

        it('should not clash with other hint input instances', () => {
            const { container } = render(
                <>
                    <Hint options={objectOptions.slice()}>
                        <input onChange={handleChange} />
                    </Hint>
                    <Hint options={objectOptions.slice()}>
                        <input onChange={handleChange} />
                    </Hint>
                </>
            );

            runMultipleInstancesTest(container);
        });
    });

    function getElements(container: HTMLElement): [HTMLInputElement, HTMLInputElement, HTMLSpanElement] {
        const inputs = container.getElementsByTagName('input');
        const input = inputs[0];
        const hint = inputs[1];
        const textFiller = container.getElementsByClassName('rah-text-filler')[0] as HTMLSpanElement;

        return [input, hint, textFiller];
    }

    function runCommonTests() {
        it('should suggest the correct hint while typing', () => {
            fireEvent.change(input, { target: { value: 'P' } });
            expect(hint.value).toBe('apaya');

            fireEvent.change(input, { target: { value: 'Pe' } });
            expect(hint.value).toBe('a');

            fireEvent.change(input, { target: { value: '' } });
            expect(hint.value).toBe('');
        });

        it('should fill up the text filler behind correctly while typing', () => {
            fireEvent.change(input, { target: { value: 'P' } });
            expect(textFiller.innerHTML).toBe('P');

            fireEvent.change(input, { target: { value: 'Pe' } });
            expect(textFiller.innerHTML).toBe('Pe');
        });

        it('should autoComplete the input correctly on press of right button', () => {
            fireEvent.change(input, { target: { value: 'ap' } });
            fireEvent.keyDown(input, { key: ArrowRight });

            expect(input.value).toBe('apples');
            expect(hint.value).toBe('');
            expect(textFiller.innerHTML).toBe('');
        });

        it('should remove hint on blur of the input and re-add it on refocus', () => {
            input.focus();

            fireEvent.change(input, { target: { value: 'ap' } });
            expect(hint.value).toBe('ples');

            input.blur();
            expect(hint.value).toBe('');

            input.focus();
            expect(hint.value).toBe('ples');
        });

        it('should have the correct values when the autocompleted text is a part of the next match and goes through a peculiar blur-focus scenario', () => {
            input.focus();

            fireEvent.change(input, { target: { value: 'pe' } });
            expect(hint.value).toBe('a');

            fireEvent.keyDown(input, { key: ArrowRight });
            expect(input.value).toBe('pea');
            expect(hint.value).toBe('');
            expect(textFiller.innerHTML).toBe('');

            input.blur();
            input.focus();

            expect(input.value).toBe('pea');
            expect(hint.value).toBe('rs');
            expect(textFiller.innerHTML).toBe('pea');
        });

        it('should not allow Tab button to autocomplete input with hint', () => {
            fireEvent.change(input, { target: { value: 'ap' } });
            fireEvent.keyDown(input, { key: Tab });

            expect(input.value).toBe('ap');
            expect(hint.value).toBe('ples');
        });

        it('should not autocomplete input with hint when caret is not at the end of text', () => {
            fireEvent.change(input, { target: { value: 'Pe', selectionEnd: 1 } });
            fireEvent.keyDown(input, { key: ArrowRight });

            expect(input.value).toBe('Pe');
        });

        it(`should not suggest hint when there's no match`, () => {
            fireEvent.change(input, { target: { value: 'Pears' } });
            expect(hint.value).toBe('');

            fireEvent.keyDown(input, { key: ArrowRight });
            expect(hint.value).toBe('');
        });
    }

    function runMultipleInstancesTest(container: HTMLElement) {
        const inputs = container.getElementsByTagName('input');
        const input1 = inputs[0],
            input2 = inputs[2],
            hint2 = inputs[3];

        fireEvent.change(input1, { target: { value: 'Pe' } });
        expect(hint2.value).toBe('');

        fireEvent.keyDown(input1, { key: ArrowRight });
        expect(input2.value).toBe('');
        expect(hint2.value).toBe('');
    }
});

describe('Hint input with allowTabFill prop set to true', () => {
    describe('With string options', () => {
        beforeEach(() => {
            const { container } = render(
                <Hint options={stringOptions} allowTabFill>
                    <input onChange={e => handleChange(e.target.value)} />
                </Hint>
            );

            [input, hint] = getElements(container);
        });

        runCommonTests();
    });

    describe('With object options', () => {
        beforeEach(() => {
            const { container } = render(
                <Hint options={objectOptions} allowTabFill>
                    <input onChange={e => handleChange(e.target.value)} />
                </Hint>
            );

            [input, hint] = getElements(container);
        });

        runCommonTests();
    });

    function getElements(container: HTMLElement): [HTMLInputElement, HTMLInputElement] {
        const inputs = container.getElementsByTagName('input');
        const input = inputs[0];
        const hint = inputs[1];

        return [input, hint];
    }

    function runCommonTests() {
        it('should autoComplete the input correctly on press of tab button', async () => {
            fireEvent.change(input, { target: { value: 'ap' } });
            fireEvent.keyDown(input, { key: Tab });

            expect(input.value).toBe('apples');
            expect(hint.value).toBe('');
        });

        it('should autoComplete the input correctly on press of right button', async () => {
            fireEvent.change(input, { target: { value: 'ap' } });
            fireEvent.keyDown(input, { key: ArrowRight });

            expect(input.value).toBe('apples');
            expect(hint.value).toBe('');
        });

        it('should not autocomplete input with hint when caret is not at the end of the input text', () => {
            fireEvent.change(input, { target: { value: 'Pe', selectionEnd: 1 } });
            fireEvent.keyDown(input, { key: Tab });
            fireEvent.keyDown(input, { key: ArrowRight });

            expect(input.value).toBe('Pe');
        });

    }
});

describe('Hint input with allowTabFill prop set to true alongside another input', () => {
    let nextInput: HTMLInputElement;

    describe('With string options', () => {
        beforeEach(() => {
            const { container } = render(
                <>
                    <Hint options={stringOptions} allowTabFill>
                        <input onChange={handleChange} />
                    </Hint>
                    <input id='next-input' onChange={handleChange} />
                </>
            );

            [input, nextInput] = getElements(container);
        });

        runCommonTests();
    });

    describe('With object options', () => {
        beforeEach(() => {
            const { container } = render(
                <>
                    <Hint options={objectOptions} allowTabFill>
                        <input onChange={handleChange} />
                    </Hint>
                    <input id='next-input' onChange={handleChange} />
                </>
            );

            [input, nextInput] = getElements(container);
        });

        runCommonTests();
    });

    function getElements(container: HTMLElement): [HTMLInputElement, HTMLInputElement] {
        const inputs = container.getElementsByTagName('input');
        const input = inputs[0];
        const nextInput = inputs[2];

        return [input, nextInput];
    }

    function runCommonTests() {
        it(`should not move focus to the next-input when there's a value to autoComplete and Tab button is pressed`, () => {
            input.focus();
            fireEvent.change(input, { target: { value: 'Pe' } });
            userEvent.tab();

            expect(input).toHaveFocus();
        });

        it('should move focus to the next-input when the caret is not at the end of the main-input text and Tab button is pressed', () => {
            input.focus();
            fireEvent.change(input, { target: { value: 'Pea', selectionEnd: 1 } });
            userEvent.tab();

            expect(nextInput).toHaveFocus();
        });

        it('should move focus to the next-input when the main-input is empty and Tab button is pressed', () => {
            input.focus();
            fireEvent.change(input, { target: { value: '', } });
            userEvent.tab();

            expect(nextInput).toHaveFocus();
        });

        it(`should go to the next tabIndex when there's no hint suggestion and Tab button is pressed`, () => {
            input.focus();
            fireEvent.change(input, { target: { value: 'RandomText' } });
            userEvent.tab();

            expect(nextInput).toHaveFocus();
        });

        it(`should go to the next tabIndex when one of the options is typed and there's no hint suggestion and Tab button is pressed`, () => {
            input.focus();
            fireEvent.change(input, { target: { value: 'Pears' } });
            userEvent.tab();

            expect(nextInput).toHaveFocus();
        });
    }
});

describe('Hint input with onClick autocomplete feature', () => {
    describe('With string options', () => {
        beforeEach(() => {
            const { container } = render(
                <Hint options={stringOptions}>
                    <input onChange={handleChange} />
                </Hint>
            );

            [input, hint, textFiller] = getElements(container);
        });

        runCommonTests();
    });

    describe('With object options', () => {
        beforeEach(() => {
            const { container } = render(
                <Hint options={objectOptions}>
                    <input onChange={handleChange} />
                </Hint>
            );

            [input, hint, textFiller] = getElements(container);
        });

        runCommonTests();
    });

    function getElements(container: HTMLElement): [HTMLInputElement, HTMLInputElement, HTMLSpanElement] {
        const inputs = container.getElementsByTagName('input');
        const input = inputs[0];
        const hint = inputs[1];
        const textFiller = container.getElementsByClassName('rah-text-filler')[0] as HTMLSpanElement;

        return [input, hint, textFiller];
    }

    function runCommonTests() {
        it('should not autoComplete the input when the user clicks the hint at position 0', () => {
            fireEvent.change(input, { target: { value: 'Pers' } });
            fireEvent.click(hint, { target: { selectionEnd: 0 } });
            expect(input.value).toBe('Pers');
            expect(input.selectionEnd).toBe(4);
        });

        it('should autoComplete the input when the user clicks the hint at a position other than 0', () => {
            fireEvent.change(input, { target: { value: 'Pers' } });
            fireEvent.click(hint, { target: { selectionEnd: 1 } });

            expect(input.value).toBe('Persimmon');
            expect(hint.value).toBe('');
            expect(textFiller.innerHTML).toBe('');
        });

        it('should move focus to the mainInput with the caret at the end of the text when the user clicks the hint at position 0', () => {
            fireEvent.change(input, { target: { value: 'Pers' } });
            fireEvent.click(hint, { target: { selectionEnd: 0 } });

            expect(input).toHaveFocus();
            expect(input.selectionEnd).toBe(4);
        });

        it('should keep the mainInput caret at the position where the user clicked the hint, if clicked at a position other than 0', () => {
            jest.useFakeTimers();

            fireEvent.change(input, { target: { value: 'Pers' } });
            fireEvent.click(hint, { target: { selectionEnd: 1 } });

            jest.runAllTimers();

            expect(input.selectionEnd).toBe(5);
        });
    }
});

describe('Hint with ref set on input', () => {
    describe('With string options', () => {
        runNonCallbackRefsTest(stringOptions);
        runCallbackRefsTest(stringOptions);
    });

    describe('With object options', () => {
        runNonCallbackRefsTest(objectOptions);
        runCallbackRefsTest(objectOptions);
    });

    function runNonCallbackRefsTest(options: Array<string | IHintOption>) {
        it('should preserve a non-callback ref set on the input', () => {
            const { result } = renderHook(() => useRef<HTMLInputElement>(null));
            const inputRef = result.current;

            const { container } = render(
                <Hint options={options}>
                    <input onChange={handleChange} ref={inputRef} />
                </Hint>
            );

            if (inputRef.current) {
                inputRef.current.style.lineHeight = '1.5px';
            }

            runRefPreservationTest(container);
        });
    }

    function runCallbackRefsTest(options: Array<string | IHintOption>) {
        it('should preserve callback ref set on the input', () => {
            let inputRef: any;

            const { container } = render(
                <Hint options={options}>
                    <input onChange={handleChange} ref={element => {
                        inputRef = element;
                    }} />
                </Hint>
            );

            inputRef.style.lineHeight = '1.5px';

            runRefPreservationTest(container);
        });
    }

    function runRefPreservationTest(container: HTMLElement) {
        const inputs = container.getElementsByTagName('input');
        const input = inputs[0];
        const hint = inputs[1];
        const hintWrapper = container.getElementsByClassName('rah-hint-wrapper')[0] as HTMLSpanElement;

        fireEvent.change(input, { target: { value: 'a' } });

        expect(hintWrapper.style.lineHeight).toBe('1.5px');
        expect(hint.style.lineHeight).toBe('1.5px');
    }
});
