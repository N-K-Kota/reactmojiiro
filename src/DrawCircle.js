import React from 'react';

function DrawCircle(props) {
    return (
        <button onClick={() => props.onClick()} className={props.isClicked ? 'default' : 'pushed'}>丸描画{props.isClicked ? '押された' : '初期'}</button>
    );
}

export default DrawCircle;