import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Hint } from '../src';
import './index.scss';

const Demo: React.FC = () => {
    const [text, setText] = useState('');
    const options = ['Papaya', 'Persimmon', 'Pear', 'Peach', 'Apples', 'Apricots', 'Avocados'];

    return (
        <div className='demo'>
            <p>
                Try typing any of the words in the list below:
            </p>
            <code>
                ["Papaya", "Persimmon", "Pear", "Peach", "Apples", "Apricots", "Avocados"]
            </code>
            <div className='input-wrapper'>
                <Hint options={options} allowTabFill>
                    <input
                        className='input-with-hint'
                        value={text}
                        onChange={e => setText(e.target.value)} />
                </Hint>
            </div>
            <p>
                Github Repo: <a href="https://github.com/ejmudi/react-autocomplete-hint">https://github.com/ejmudi/react-autocomplete-hint</a>
            </p>
        </div>
    );
}

ReactDOM.render(
    <Demo />,
    document.getElementById("root")
);