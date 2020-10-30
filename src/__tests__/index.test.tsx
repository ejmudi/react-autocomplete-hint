import React, { useRef } from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Hint } from '..';
import { renderHook } from '@testing-library/react-hooks';
import '@testing-library/jest-dom/extend-expect';

const options = ['Persimmon', 'Pear', 'Papaya', 'Peach', 'Apples', 'Apricots', 'Avocados'];
const handleChange = jest.fn();
let input: HTMLInputElement;
let hint: HTMLInputElement;
let hintWrapper: HTMLSpanElement;

describe('Hint input without allowTabFill prop', () => {
    beforeEach(() => {
        const { container } = render(
            <Hint options={options}>
                <input onChange={handleChange} />
            </Hint>
        );

        input = container.getElementsByTagName('input')[0];
        hint = container.getElementsByTagName('input')[1];
    });

    it('should suggest the correct hint while typing', () => {
        fireEvent.change(input, { target: { value: 'P' } });
        expect(hint.value).toBe('apaya');

        fireEvent.change(input, { target: { value: 'Pe' } });
        expect(hint.value).toBe('ach');
    });

    it('should autoComplete the input correctly on press of right button', async () => {
        fireEvent.change(input, { target: { value: 'ap' } });
        fireEvent.keyDown(input, { key: 'ArrowRight' });

        expect(input.value).toBe('apples');
        expect(hint.value).toBe('');
    });

    it('should not allow Tab button to autocomplete input with hint', () => {
        fireEvent.change(input, { target: { value: 'ap' } });
        fireEvent.keyDown(input, { key: 'Tab' });

        expect(input.value).toBe('ap');
        expect(hint.value).toBe('ples');
    });

    it('should not autocomplete input with hint when caret is not at the end of text', () => {
        fireEvent.change(input, { target: { value: 'Pe', selectionEnd: 1 } });
        fireEvent.keyDown(input, { key: 'ArrowRight' });

        expect(input.value).toBe('Pe');
    });

    it(`should not suggest hint when there's no match`, () => {
        fireEvent.change(input, { target: { value: 'Pears' } });
        expect(hint.value).toBe('');

        fireEvent.keyDown(input, { key: 'ArrowRight' });
        expect(hint.value).toBe('');
    });

    it('should not clash with other hint input instances', () => {
        const { container } = render(
            <>
                <Hint options={options}>
                    <input onChange={handleChange} />
                </Hint>
                <Hint options={options}>
                    <input onChange={handleChange} />
                </Hint>
            </>
        );

        const inputs = container.getElementsByTagName('input');
        const input1 = inputs[0],
            input2 = inputs[2],
            hint2 = inputs[3];

        fireEvent.change(input1, { target: { value: 'Pe' } });
        expect(hint2.value).toBe('');

        fireEvent.keyDown(input1, { key: 'ArrowRight' });
        expect(input2.value).toBe('');
        expect(hint2.value).toBe('');
    });

    it('should not have autocomplete functionality when disableHint is set to true', () => {
        const { container } = render(
            <Hint options={options} disableHint={true}>
                <input onChange={handleChange} />
            </Hint>
        );

        const inputs = container.getElementsByTagName('input');
        expect(inputs.length).toBe(1);
    });
});

describe('Hint input with allowTabFill prop set to true', () => {
    beforeEach(() => {
        const { container } = render(
            <Hint options={options} allowTabFill>
                <input onChange={e => handleChange(e.target.value)} />
            </Hint>
        );

        input = container.getElementsByTagName('input')[0];
        hint = container.getElementsByTagName('input')[1];
    });

    it('should autoComplete the input correctly on press of tab button', async () => {
        fireEvent.change(input, { target: { value: 'ap' } });
        fireEvent.keyDown(input, { key: 'Tab' });

        expect(input.value).toBe('apples');
        expect(hint.value).toBe('');
    });

    it('should autoComplete the input correctly on press of right button', async () => {
        fireEvent.change(input, { target: { value: 'ap' } });
        fireEvent.keyDown(input, { key: 'ArrowRight' });

        expect(input.value).toBe('apples');
        expect(hint.value).toBe('');
    });

    it('should not autocomplete input with hint when caret is not at the end of the input text', () => {
        fireEvent.change(input, { target: { value: 'Pe', selectionEnd: 1 } });
        fireEvent.keyDown(input, { key: 'Tab' });
        fireEvent.keyDown(input, { key: 'ArrowRight' });

        expect(input.value).toBe('Pe');
    });
});

describe('Hint input with allowTabFill prop set to true alongside another input', () => {
    let nextInput: HTMLInputElement;

    beforeEach(() => {
        const { container } = render(
            <>
                <Hint options={options} allowTabFill>
                    <input onChange={handleChange} />
                </Hint>
                <input id='next-input' onChange={handleChange} />
            </>
        );

        input = container.getElementsByTagName('input')[0];
        nextInput = container.getElementsByTagName('input')[2];
    });

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
        fireEvent.change(input, { target: { value: 'Pear' } });
        userEvent.tab();

        expect(nextInput).toHaveFocus();
    });
});

describe('Hint input with onClick autocomplete feature', () => {
    beforeEach(() => {
        const { container } = render(
            <Hint options={options}>
                <input onChange={handleChange} />
            </Hint>
        );

        input = container.getElementsByTagName('input')[0];
        hint = container.getElementsByTagName('input')[1];
    });

    it('should autoComplete the input when the user clicks the hint at position 0', () => {
        fireEvent.change(input, { target: { value: 'Pers' } });
        fireEvent.click(hint, { target: { selectionEnd: 0 } });
        expect(input.value).toBe('Pers');
        expect(input.selectionEnd).toBe(4);
    });

    it('should autoComplete the input when the user clicks the hint at a position other than 0', () => {
        fireEvent.change(input, { target: { value: 'Pers' } });
        fireEvent.click(hint, { target: { selectionEnd: 1 } });
        expect(input.value).toBe('Persimmon');
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
});

describe('Hint with ref set on input', () => {
    it('should preserve a non-callback ref set on the input', () => {
        const { result } = renderHook(() => useRef<HTMLInputElement>(null));
        const inputRef = result.current;

        const { container } = render(
            <Hint options={options}>
                <input onChange={handleChange} ref={inputRef} />
            </Hint>
        );

        input = container.getElementsByTagName('input')[0];
        hint = container.getElementsByTagName('input')[1];
        hintWrapper = container.getElementsByClassName('rah-hint-wrapper')[0] as HTMLSpanElement;

        if (inputRef.current) {
            inputRef.current.style.lineHeight = '1.5px';
        }

        fireEvent.change(input, { target: { value: 'a' } });

        expect(hintWrapper.style.lineHeight).toBe('1.5px');
        expect(hint.style.lineHeight).toBe('1.5px');
    });

    it('should preserve callback ref set on the input', () => {
        let inputRef: any;

        const { container } = render(
            <Hint options={options}>
                <input onChange={handleChange} ref={element => {
                    inputRef = element;
                }} />
            </Hint>
        );

        input = container.getElementsByTagName('input')[0];
        hint = container.getElementsByTagName('input')[1];
        hintWrapper = container.getElementsByClassName('rah-hint-wrapper')[0] as HTMLSpanElement;

        inputRef.style.lineHeight = '1.5px';

        fireEvent.change(input, { target: { value: 'a' } });

        expect(hintWrapper.style.lineHeight).toBe('1.5px');
        expect(hint.style.lineHeight).toBe('1.5px');
    });
});
