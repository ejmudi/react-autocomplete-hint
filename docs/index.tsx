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
                Try typing any of the words in the array below:
            </p>
            <code>
                ["Papaya", "Persimmon", "Pear", "Peach", "Apples", "Apricots", "Avocados"]
            </code>
            <div className='input-wrapper'>
                <Hint options={options}>
                    <input
                        className='input-with-hint'
                        value={text}
                        onChange={e => setText(e.target.value)} />
                </Hint>
            </div>
        </div>
    );
}

ReactDOM.render(
    <Demo />,
    document.getElementById("root")
);