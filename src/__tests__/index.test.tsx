import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Hint } from '..';

const options = ['Persimmon', 'Pear', 'Papaya', 'Peach', 'Apples', 'Apricots', 'Avocados'];
const handleChange = jest.fn();
let input: HTMLInputElement;
let hint: HTMLInputElement;

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
        expect(hint.value).toBe('Papaya');

        fireEvent.change(input, { target: { value: 'Pe' } });
        expect(hint.value).toBe('Peach');
    });

    it(`should preserve user's casing while suggesting hint`, () => {
        fireEvent.change(input, { target: { value: 'pEA' } });
        expect(hint.value).toBe('pEAch');
    });

    it('should autofill the input correctly on press of right button', async () => {
        fireEvent.change(input, { target: { value: 'ap' } });
        fireEvent.keyDown(input, { key: 'ArrowRight' });

        expect(input.value).toBe('apples');
        expect(hint.value).toBe('');
    });

    it('should not allow Tab button to autocomplete input with hint', () => {
        fireEvent.change(input, { target: { value: 'ap' } });
        fireEvent.keyDown(input, { key: 'Tab' });

        expect(input.value).toBe('ap');
        expect(hint.value).toBe('apples');
    });

    it(`should not autocomplete input with hint when caret is not at the end of text`, () => {
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

    it(`should not clash with other hint input instances`, () => {
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
        hint1 = inputs[1],
        input2 = inputs[2],
        hint2 = inputs[3];

        fireEvent.change(input1, { target: { value: 'Pe' } });
        expect(hint2.value).toBe('');

        fireEvent.keyDown(input1, { key: 'ArrowRight' });
        expect(input2.value).toBe('');
        expect(hint2.value).toBe('');
    });
});

describe('Hint input with allowTabFill prop set to true', () => {
    beforeEach(() => {
        const { container } = render(
            <Hint options={options} allowTabFill>
                <input onChange={handleChange} />
            </Hint>
        );

        input = container.getElementsByTagName('input')[0];
        hint = container.getElementsByTagName('input')[1];
    });

    it('should autofill the input correctly on press of tab button', async () => {
        fireEvent.change(input, { target: { value: 'ap' } });
        fireEvent.keyDown(input, { key: 'Tab' });

        expect(input.value).toBe('apples');
        expect(hint.value).toBe('');
    });

    it('should autofill the input correctly on press of right button', async () => {
        fireEvent.change(input, { target: { value: 'ap' } });
        fireEvent.keyDown(input, { key: 'ArrowRight' });

        expect(input.value).toBe('apples');
        expect(hint.value).toBe('');
    });

    it(`should not autocomplete input with hint when caret is not at the end of text`, () => {
        fireEvent.change(input, { target: { value: 'Pe', selectionEnd: 1 } });
        fireEvent.keyDown(input, { key: 'Tab' });
        fireEvent.keyDown(input, { key: 'ArrowRight' });

        expect(input.value).toBe('Pe');
    });
});