import React from 'react';

const IntroPopup = ({ onChoice }) => {
    return (
        <div className="popup">
            <div className="popup-content">
                <h2>Погрузиться глубже?</h2>
                <h3>Песня была изменена</h3>
                <p className="warning">
                    ⚠️ Внимание: при нажатии на кнопку "Да", Вы автоматически соглашаетесь с тем, что сейчас может быть воспроизведена ненормативная лексика!
                </p>
                <button onClick={() => onChoice(true)}>Да (убавьте звук, если он на максимуме)</button>
                <button onClick={() => onChoice(false)}>Нет (очень жаль)</button>
            </div>
        </div>
    );
};

export default IntroPopup;