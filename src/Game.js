import React, { useState, useEffect, useRef } from 'react';
import './Game.css';
import DrawCircle from './DrawCircle';
import BackBtn from './BackBtn';

const Game = () => {
    const [canvasList, setCanvasList] = useState({});
    const [mainCanvasHistory, setMainCanvasHistory] = useState([]);
    const [textCanvasHistory, settextCanvasHistory] = useState([]);
    const [canvasSize, setCanvasSize] = useState({ width: 1800, height: 900 });
    const [isClicked, setisClicked] = useState(false);
    const [textX, setTextX] = useState(900);
    const [textY, setTextY] = useState(400);
    const [size, setSize] = useState(20);
    const [maskText, setMaskText] = useState('');
    const circleCanvasHistory = useRef([]);
    const currentIndex = useRef(0);
    const mainCanvas = useRef(null);
    const circleCanvas = useRef(null);
    const textCanvas = useRef(null);
    const [timer, setTimer] = useState(null);
    const handleTextX = (event) => {
        setTextX(event.target.value);
        canvasList.textCanvasCtx.clearRect(0, 0, canvasSize.width, canvasSize.height);
        canvasList.textCanvasCtx.font = "900 " + size + "px arial";
        canvasList.textCanvasCtx.fillText(maskText, event.target.value, textY);
    };
    const handleTextY = (event) => {
        setTextY(event.target.value);
        canvasList.textCanvasCtx.clearRect(0, 0, canvasSize.width, canvasSize.height);
        canvasList.textCanvasCtx.font = "900 " + size + "px arial";
        canvasList.textCanvasCtx.fillText(maskText, textX, event.target.value);
    };
    const handleSize = (event) => {
        setSize(event.target.value);
        canvasList.textCanvasCtx.clearRect(0, 0, canvasSize.width, canvasSize.height);
        canvasList.textCanvasCtx.font = "900 " + event.target.value + "px arial";
        canvasList.textCanvasCtx.fillText(maskText, textX, textY);
    };
    const handleMaskText = (event) => {
        setMaskText(event.target.value);
        canvasList.textCanvasCtx.clearRect(0, 0, canvasSize.width, canvasSize.height);
        canvasList.textCanvasCtx.font = "900 " + size + "px arial";
        canvasList.textCanvasCtx.fillText(event.target.value, textX, textY);
    };
    // 円を描画するメソッド
    const drawCircle = () => {
        const newIsClicked = !isClicked;
        setisClicked(newIsClicked);
        if (newIsClicked) {
            setTimer(setInterval(() => {
                // 円の位置、半径をランダムに算出
                const x = Math.random() * canvasSize.width;
                const y = Math.random() * canvasSize.height;
                const r = Math.random() * canvasSize.height;

                // rgbaの各値をランダムに算出
                const redVal = Math.floor(Math.random() * 255);
                const blueVal = Math.floor(Math.random() * 255);
                const greenVal = Math.floor(Math.random() * 255);
                const aVal = Math.floor(Math.random() * 10) / 10;
                const textrgba = "rgba(" + redVal + "," + greenVal + "," + blueVal + "," + aVal + ")";
                canvasList.circleCanvasCtx.fillStyle = textrgba;
                canvasList.circleCanvasCtx.beginPath();
                canvasList.circleCanvasCtx.arc(x, y, r, 0, 2 * Math.PI, false);
                canvasList.circleCanvasCtx.fill();
                const newHistory = circleCanvasHistory.current.slice(0, currentIndex.current + 1);
                newHistory.push(
                    canvasList.circleCanvasCtx.getImageData(0, 0, canvasSize.width, canvasSize.height)
                );
                // 保存できる最大値をこえている場合、先頭のデータを削除
                if (newHistory.length > 100) {
                    newHistory.shift();
                }
                circleCanvasHistory.current = newHistory;
                currentIndex.current += 1;
            }, 100));
        } else {
            clearInterval(timer);
        }
    }

    const doMask = () => {
        const imageData = circleCanvasHistory.current[currentIndex.current];
        const textData = canvasList.textCanvasCtx.getImageData(0, 0, canvasSize.width, canvasSize.height);
        for (let i = 0, len = canvasSize.width * canvasSize.height; i < len; i++) {
            const d = textData.data[i * 4 + 3];
            imageData.data[i * 4 + 3] = (d > 0 && imageData.data[i * 4 + 3] > 0) ? d : 0;
        }
        canvasList.circleCanvasCtx.putImageData(imageData, 0, 0);
        canvasList.textCanvasCtx.clearRect(0, 0, canvasSize.width, canvasSize.height);
    };

    const undo = () => {
        const newIndex = currentIndex.current - 1;
        console.log(newIndex);
        if (newIndex < 0) {
            canvasList.circleCanvasCtx.clearRect(0, 0, canvasSize.width, canvasSize.height);
            circleCanvasHistory.current = [];
            return;
        }
        console.log(circleCanvasHistory);
        currentIndex.current = newIndex;
        const imageData = circleCanvasHistory.current[currentIndex.current];
        console.log(imageData);
        canvasList.circleCanvasCtx.putImageData(imageData, 0, 0);
    };

    useEffect(() => {
        setCanvasList({
            mainCanvasCtx: mainCanvas.current.getContext('2d'),
            circleCanvasCtx: circleCanvas.current.getContext('2d'),
            textCanvasCtx: textCanvas.current.getContext('2d'),
        });
    }, []);
    return (
        <div className="wrapper">
            <main className="mainitem">
                <canvas id="mainCanvas" className="layer" width={canvasSize.width} height={canvasSize.height} ref={mainCanvas} />
                <canvas id="circleCanvas" className="layer" width={canvasSize.width} height={canvasSize.height} ref={circleCanvas} />
                <canvas id="textCanvas" className="layer" width={canvasSize.width} height={canvasSize.height} ref={textCanvas} />
            </main>
            <aside className="side1">
                <button onClick={doMask}>マスク</button>
                <DrawCircle onClick={drawCircle} isClicked={isClicked} />
                <BackBtn onClick={undo} />
            </aside>
            <aside id="tools" className="side2">
                <section className="textzone underbar">
                    <input type="text" id="text" value={maskText} onChange={handleMaskText} />
                    <label>x:<input type="number" id="tx" min="0" max="1800" value={textX} onChange={handleTextX} /></label>
                    <label>y:<input type="number" id="ty" min="0" max="900" value={textY} onChange={handleTextY} /></label>
                    <label>size<input type="number" id="tsize" min="1" max="800" value={size} onChange={handleSize} /></label><br />
                </section>
                <button id="pen">ペン</button>
                <input type="color" id="colorpicker" />
                <button id="clear">消去</button>
                <button id="eraser">消しゴム</button>
                <button id="insertimg">画像読み込み</button>
            </aside>
        </div>
    );
}

export default Game;