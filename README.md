# react-autocomplete-hint
A React component for Autocomplete Hint.

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

Use your keyboard **Right key** to fill your input with the suggested hint.


## Props

#### options (required): `Array<string>`

List of options for autocomplete.

#### disableHint (optional): `Boolean`


## License
[MIT](LICENSE)

Inspired by [React Bootstrap Typeahead](https://github.com/ericgio/react-bootstrap-typeahead).
