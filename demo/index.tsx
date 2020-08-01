import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Hint } from '../src';
import './index.scss';

const Demo: React.FC = () => {
    const [text, setText] = useState('');
    const options = ["mai", "ma", "manicure", "mandible", "man", "woman", "worm", "men", "must"];

    return (
        <div>
            <p>
                Try typing any of the words in the array below:
            </p>
            <p>
                ["mai", "ma", "manicure", "mandible", "man", "woman", "worm", "men", "must"]
            </p>
            <div className="input-wrapper">
                <Hint options={options} disableHint={false}>
                    <input
                        className="input-with-hint"
                        value={text}
                        type="text"
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