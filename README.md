# react-autocomplete-hint
A React component for Autocomplete Hint.

![NPM](https://img.shields.io/npm/l/react-autocomplete-hint)
![npm](https://img.shields.io/npm/v/react-autocomplete-hint)
[![Build Status](https://travis-ci.com/ejmudi/react-autocomplete-hint.svg?branch=master)](https://travis-ci.com/ejmudi/react-autocomplete-hint)
[![codecov](https://codecov.io/gh/ejmudi/react-autocomplete-hint/graph/badge.svg)](https://codecov.io/gh/ejmudi/react-autocomplete-hint)

![](demo/demo.gif)


## Demo

Demo can be found here: [https://ejmudi.github.io/react-autocomplete-hint/](https://ejmudi.github.io/react-autocomplete-hint/)


## Installation
```
npm install --save react-autocomplete-hint
```
or
```
yarn add react-autocomplete-hint
```


## Usage
```jsx
import { Hint } from 'react-autocomplete-hint';

const options = ["orange", "banana", "apple"];

// OR

const options = [
    {id: 1, label: "orange"}, 
    {id: '2', label: "banana"}, 
    {id: 3, label: "apple"}
];

<Hint options={options}>
    <input
        value={text}
        onChange={e => setText(e.target.value)} />
</Hint>

```

Click on the hint or use your keyboard **Right** key or **Tab** key(if `allowTabFill` is set to true) to fill your input with the suggested hint.


## Props

#### options (required): `Array<string> | Array<object>`

#### disableHint (optional): `Boolean`

#### allowTabFill (optional): `Boolean`

#### onFill (optional): `(value: string | object)=> void`

#### valueModifier (optional): `(value: string)=> string`


## object option
If you're using objects for your options. object schema is as follows:

#### id: `string | number`
#### label: `string`


## onFill
Returns the option selected immediately the input is filled with the suggested hint. 

Note that it won't return the selected option with the casing the user typed, rather it returns the option with the casing specified in your options prop. For example, if the options are specified like this:...

```jsx
const options = ["orange", "banana", "apple"];
```
...and the input gets filled with *"ORange"*, onFill will still return *"orange"*.


## valueModifier
This prop accepts a function that modifies your input value before it is saved in state.

It is typically useful when you are not setting `e.target.value` directly in state and need to modify the target value to 
some other value first before setting it in state.

Example: A case where you need to set the input value to uppercase irrespective of the casing the user types in:

```jsx
const options = ["orange", "banana", "apple"];

const modifyValue = (value: string) => value.toUpperCase();

<Hint options={options} valueModifier={modifyValue}>
    <input
        value={text}
        onChange={e => setText(modifyValue(e.target.value))} />
</Hint>
```
Note: Not setting the `valueModifier` prop in cases like this might result to a malformed hint.


## Duplicate data
If you are using objects for your options, You may have unexpected results if your data options contain objects with duplicate labels. For this reason, it is highly recommended that you pass in objects with unique labels if possible.

For example, if you pass in `optionsWithDuplicateLabels` as seen below and you then fill the input with the *orange* hint, the orange will be the first orange object found in the array as can be seen in the `onFill` prop:

```jsx
const optionsWithDuplicateLabels = [
    {id: "1", label: "orange"},
    {id: "2", label: "orange"},
    {id: "3", label: "banana"}
];

<Hint options={optionsWithDuplicateLabels} onFill={value=> {
    // will always log {id: "1", label: "orange"} when orange is selected
    // {id: "2", label: "orange"} will never be logged.
    console.log(value);
}}>
    <input
        value={text}
        onChange={e => setText(e.target.value)} />
</Hint>

```


## License
[MIT](LICENSE)

Inspired by [React Bootstrap Typeahead](https://github.com/ericgio/react-bootstrap-typeahead).
