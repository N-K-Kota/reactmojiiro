import React, { useState, useRef } from 'react';
import './App.css';
import DrawCanvas from './DrawCanvas';

export default function App() {
    const circleCanvas = useRef();
    const [timer, setTimer] = useState(null);
    const [maskText, setMaskText] = useState('');
    const [checkClass, setCheckClass] = useState('default');
    const [checkLabel, setCheckLabel] = useState('開始');

    function startCircle(event) {
        if (event.target.checked) {
            setTimer(circleCanvas.current.draw());
        } else {
            clearInterval(timer);
        }
        setCheckClass(event.target.checked ? 'pushed' : 'default');
        setCheckLabel(event.target.checked ? '終了' : '開始');
    }

    const doMask = () => {
        circleCanvas.current.doMask();
    }

    const undo = () => {
        circleCanvas.current.undo();
    }

    const handleMaskText = (event) => {
        setMaskText(event.target.value);
        circleCanvas.current.handleMaskText(event);
    }

    const download = () => {
        circleCanvas.current.download();
    }

    const clear = () => {
        circleCanvas.current.clear();
    }

    return (
        <div className="wrapper">
            <main className="mainitem px-1">
                <DrawCanvas ref={circleCanvas} />
            </main>
            <aside className="side1 container">
                <div className="">
                    <section className="">
                        <input type="text" id="text" value={maskText} onChange={handleMaskText} />
                    </section>
                    <div className="d-flex flex-lg-column mt-2 gap-2">
                        <input id="draw-check" type="checkbox" onChange={startCircle} value="1" className="btn-check d-block" /><label htmlFor="draw-check" className="btn btn-outline-primary ctr-btn">{checkLabel}</label>
                        <button onClick={doMask} className="btn btn-primary ctr-btn">マスク</button>
                        <button onClick={undo} className="btn btn-primary ctr-btn">戻る</button>
                    </div>
                </div>
            </aside>
            <aside id="tools" className="side2 container mt-2">
                <div className="d-flex gap-1">
                    <button id="clear" onClick={clear} className="btn btn-secondary" href="#">消去</button>
                    <button id="download" onClick={download} className="btn btn-success">ダウンロード</button>
                </div>
            </aside>
        </div>
    );
};