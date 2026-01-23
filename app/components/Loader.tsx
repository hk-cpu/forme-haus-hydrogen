import React from 'react';
import './Loader.css';

export default function Loader() {
    return (
        <div className="loader-wrapper relative w-full h-full min-h-[300px] flex items-center justify-center">
            <div className="loop cubes">
                <div className="item cubes" />
                <div className="item cubes" />
                <div className="item cubes" />
                <div className="item cubes" />
                <div className="item cubes" />
                <div className="item cubes" />
            </div>
        </div>
    );
}
