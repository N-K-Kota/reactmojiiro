import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import './DrawCanvas.css';

export default forwardRef((props, ref) => {
    // canvasのDOM
    const mainCanvas = useRef();
    const circleCanvas = useRef();
    const textCanvas = useRef();

    /** 描画履歴 */
    const circleCanvasHistory = useRef([]);

    /** canvasのサイズ(ピクセル数) */
    const canvasSize = {
        width: 1800,
        height: 1200,
    };

    // マスクする文字のデフォルトフォントサイズ
    let fontSize = 900;

    /** 描画履歴のインデックス 履歴がない場合は0 */
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
        download: (maskText) => {
            download(maskText);
        },
        clear: () => {
            clear();
        }
    }));

    /**
     * ランダムサイズの円を描画する
     * 
     */
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
            const rgba = "rgba(" + redVal + "," + greenVal + "," + blueVal + "," + aVal + ")";

            // 円を描画
            circleCanvas.current.getContext('2d').fillStyle = rgba;
            circleCanvas.current.getContext('2d').beginPath();
            circleCanvas.current.getContext('2d').arc(x, y, r, 0, 2 * Math.PI, false);
            circleCanvas.current.getContext('2d').fill();

            // 描画履歴を作成
            const imageData =  circleCanvas.current.getContext('2d').getImageData(0, 0, canvasSize.width, canvasSize.height);
            let newHistory = [];
            if (currentIndex.current > 0) {
                newHistory = circleCanvasHistory.current.slice(0, currentIndex.current + 1);
            }
            newHistory.push(
               imageData
            );

            // 保存できる最大値をこえている場合、先頭のデータを削除
            if (newHistory.length > 100) {
                newHistory.shift();
                currentIndex.current -= 1;
            }

            circleCanvasHistory.current = newHistory;
            currentIndex.current += 1;
        }, 100);
        return timer;
    }

    /**
     * マスクをする
     */
    function doMask() {
        // 描画がされていない場合
        if (currentIndex.current == 0) {
            return;
        }
        const imageData = circleCanvasHistory.current[currentIndex.current - 1];
        const textData = textCanvas.current.getContext('2d').getImageData(0, 0, canvasSize.width, canvasSize.height);
        for (let i = 0, len = canvasSize.width * canvasSize.height; i < len; i++) {
            // 文字キャンバスの透明度の値を取得
            const d = textData.data[i * 4 + 3];

            // 文字キャンバスの透明度でイメージキャンバスをマスクする
            imageData.data[i * 4 + 3] = (d > 0) ? imageData.data[i * 4 + 3] : 0;
        }
        circleCanvas.current.getContext('2d').putImageData(imageData, 0, 0);
        // textCanvas.current.getContext('2d').clearRect(0, 0, canvasSize.width, canvasSize.height);
    };

    /**
     * 戻る
     */
    function undo() {
        const newIndex = currentIndex.current - 1;
        if (newIndex <= 0) {
            circleCanvas.current.getContext('2d').clearRect(0, 0, canvasSize.width, canvasSize.height);
            circleCanvasHistory.current = [];
            currentIndex.current = 0;
            return;
        }
        currentIndex.current = newIndex;
        const imageData = circleCanvasHistory.current[currentIndex.current - 1];
        circleCanvas.current.getContext('2d').putImageData(imageData, 0, 0);
    };

    /**
     * 文字の描画 
     */
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

    function download(maskText) {
        const dataURL = circleCanvas.current.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = maskText + ".png";
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