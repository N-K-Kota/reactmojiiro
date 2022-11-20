import React, { useState, useRef } from 'react';
import './App.css';
import DrawCanvas from './DrawCanvas';

export default function App() {
    const canvas = useRef();
    const [timer, setTimer] = useState(null);
    const [maskText, setMaskText] = useState('');
    const [checkClass, setCheckClass] = useState('default');
    const [checkLabel, setCheckLabel] = useState('開始');

    function startCircle(event) {
        if (event.target.checked) {
            setTimer(canvas.current.draw());
        } else {
            clearInterval(timer);
        }
        setCheckClass(event.target.checked ? 'pushed' : 'default');
        setCheckLabel(event.target.checked ? '終了' : '開始');
    }

    const doMask = () => {
        canvas.current.doMask();
    }

    const undo = () => {
        canvas.current.undo();
    }

    const handleMaskText = (event) => {
        setMaskText(event.target.value);
        canvas.current.handleMaskText(event);
    }

    const download = () => {
        canvas.current.download(maskText);
    }

    const clear = () => {
        canvas.current.clear();
    }

    return (
        <div className="content-box">
            <div className="wrapper bg-white">
                <main className="mainitem px-1">
                    <DrawCanvas ref={canvas} />
                </main>
                <aside className="side1 d-flex justify-content-center justify-content-lg-end">
                    <div className="input-container">
                        <section className="">
                            <div className="col-12 text-center text-lg-start">
                                <label htmlFor="text" className="col-form-label">色を塗って文字の形に切り抜けるアプリです</label>
                            </div>
                            <div className="col-auto">
                                <input type="text" id="text" value={maskText} onChange={handleMaskText} placeholder="文字" className="form-control" />
                            </div>
                        </section>
                        <div className="d-flex flex-lg-column align-items-start justify-content-center mt-2 gap-2">
                            <div className="">
                                <input id="draw-check" type="checkbox" onChange={startCircle} value="1" className="btn-check d-block" /><label htmlFor="draw-check" className="btn btn-outline-primary ctr-btn">色塗{checkLabel}</label>
                            </div>
                            <div>
                                <button onClick={doMask} className="btn btn-primary ctr-btn">切り抜き</button>
                            </div>
                            <button onClick={undo} className="btn btn-primary ctr-btn">戻る</button>
                        </div>
                    </div>
                </aside>
                <aside id="tools" className="side2 container mt-2">
                    <div className="d-flex gap-1 justify-content-center justify-content-lg-start">
                        <button id="clear" onClick={clear} className="btn btn-secondary" href="#">消去</button>
                        <button id="download" onClick={download} className="btn btn-success">ダウンロード</button>
                    </div>
                </aside>
            </div>
        </div>
    );
};