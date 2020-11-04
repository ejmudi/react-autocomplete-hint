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

#### onAutoComplete (optional): `(value: string | object)=> void`


## object option

#### id: `string | number`;
#### label: `string`;


## Duplicate data
If you are using objects for your options, You may have unexpected results if your data options contain objects with duplicate labels. For this reason, it is highly recommended that you pass in objects with unique labels if possible.

For example, if you pass in `optionsWithDuplicateLabels` as seen below and you then fill the input with the *orange* hint, the orange will be the first orange object found in the array as can be seen in the `onAutoComplete` prop:

//TODO rename onAutoComplete and label

```jsx
const optionsWithDuplicateLabels = [
    {id: "1", label: "orange"},
    {id: "2", label: "orange"},
    {id: "3", label: "banana"}
];

<Hint options={optionsWithDuplicateLabels} onAutoComplete={value=> {
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
