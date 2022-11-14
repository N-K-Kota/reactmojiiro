import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import './DrawCanvas.css';

export default forwardRef((props, ref) => {
    const mainCanvas = useRef();
    const circleCanvas = useRef();
    const circleCanvasHistory = useRef([]);
    const textCanvas = useRef();
    const canvasSize = {
        width: 1800,
        height: 1200,
    };
    let fontSize = 900;
    const currentIndex = useRef(0);

    useImperativeHandle(ref, () => ({
        draw: () => {
            return drawCircle();
        },
        undo: () => {
            undo();
        },
        doMask: () => {
            doMask();
        },
        handleMaskText: (event) => {
            handleMaskText(event);
        },
        download: () => {
            download();
        },
        clear: () => {
            clear();
        }
    }));

    function drawCircle() {
        const timer = setInterval(() => {
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
            circleCanvas.current.getContext('2d').fillStyle = textrgba;
            circleCanvas.current.getContext('2d').beginPath();
            circleCanvas.current.getContext('2d').arc(x, y, r, 0, 2 * Math.PI, false);
            circleCanvas.current.getContext('2d').fill();

            const newHistory = circleCanvasHistory.current.slice(0, currentIndex.current + 1);
            newHistory.push(
                circleCanvas.current.getContext('2d').getImageData(0, 0, canvasSize.width, canvasSize.height)
            );
            // 保存できる最大値をこえている場合、先頭のデータを削除
            if (newHistory.length > 100) {
                newHistory.shift();
            }
            circleCanvasHistory.current = newHistory;
            currentIndex.current += 1;
        }, 100);
        return timer;
    }

    function doMask() {
        const imageData = circleCanvasHistory.current[currentIndex.current - 1];
        const textData = textCanvas.current.getContext('2d').getImageData(0, 0, canvasSize.width, canvasSize.height);
        for (let i = 0, len = canvasSize.width * canvasSize.height; i < len; i++) {
            const d = textData.data[i * 4 + 3];
            imageData.data[i * 4 + 3] = (d > 0) ? imageData.data[i * 4 + 3] : 0;
        }
        circleCanvas.current.getContext('2d').putImageData(imageData, 0, 0);
        // textCanvas.current.getContext('2d').clearRect(0, 0, canvasSize.width, canvasSize.height);
    };

    function undo() {
        const newIndex = currentIndex.current - 1;
        if (newIndex < 0) {
            circleCanvas.current.getContext('2d').clearRect(0, 0, canvasSize.width, canvasSize.height);
            circleCanvasHistory.current = [];
            return;
        }
        currentIndex.current = newIndex;
        const imageData = circleCanvasHistory.current[currentIndex.current];
        circleCanvas.current.getContext('2d').putImageData(imageData, 0, 0);
    };

    const handleMaskText = (event) => {
        const context = textCanvas.current.getContext('2d');
        context.clearRect(0, 0, canvasSize.width, canvasSize.height);
        context.font = `normal ${fontSize}px arial`;
        context.fillStyle = 'rgba(0,0,0,0.1)';
        let measureText = context.measureText(event.target.value)
        let textWidth = measureText.width;
        while(textWidth > canvasSize.width) {
            fontSize = fontSize - 1;
            context.font = `normal ${fontSize}px arial`;
            measureText = context.measureText(event.target.value);
            textWidth = measureText.width;
        }
        const textHeight = measureText.actualBoundingBoxAscent + measureText.actualBoundingBoxDescent;
        context.fillText(event.target.value, (canvasSize.width - textWidth) / 2, (canvasSize.height + textHeight) / 2);
    };

    function download() {
        const dataURL = circleCanvas.current.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "test.png";
        link.click();
    }

    function clear() {
        circleCanvas.current.getContext('2d').clearRect(0, 0, canvasSize.width, canvasSize.height);
        textCanvas.current.getContext('2d').clearRect(0, 0, canvasSize.width, canvasSize.height);
    }

    return (
        <div className="layer-wrapper mx-auto">
            <canvas id="mainCanvas" className="layer" ref={mainCanvas} width={canvasSize.width} height={canvasSize.height} />
            <canvas id="circleCanvas" className="layer" ref={circleCanvas} width={canvasSize.width} height={canvasSize.height} />
            <canvas id="textCanvas" className="layer" ref={textCanvas} width={canvasSize.width} height={canvasSize.height} />
        </div>
    );
});