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

<Hint options={["orange", "banana", "apple"]}>
    <input
        value={text}
        onChange={e => setText(e.target.value)} />
</Hint>

```

Click on the hint or use your keyboard **Right** key or **Tab** key(if `allowTabFill` is set to true) to fill your input with the suggested hint.


## Props

#### options (required): `Array<string>`

#### disableHint (optional): `Boolean`

#### allowTabFill (optional):`Boolean`


## License
[MIT](LICENSE)

Inspired by [React Bootstrap Typeahead](https://github.com/ericgio/react-bootstrap-typeahead).
