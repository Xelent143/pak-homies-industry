import React from 'react';

export const BottomBar: React.FC = () => {
    return (
        <div className="mobile-bottom-bar">
            <div className="price-info">
                <span className="price-label">TOTAL PRICE</span>
                <span className="price-value">$45.00</span>
            </div>
            <button className="apply-btn">
                Apply Changes →
            </button>
        </div>
    );
};
