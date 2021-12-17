import React from 'react';

export default function Preview(props){

    const text = props.text.split('')

    return (
        <div className="content" onCopy={() => {return false}} onCut={() => {return false}} onPaste={() => {return false}} onContextMenu={() => {return false}}>
            <blockquote className='has-text-white' style={{backgroundColor: '#36234a'}}>
                {
                    text.map((s, i) => {
                        let color

                        if(i < props.userInput.length){
                            color = s === props.userInput[i] ? '#234a24' : '#4a2323'
                        }

                        return <span key={i} style={{backgroundColor: color}}>{s}</span>
                    })
                }
            </blockquote>
        </div>
    )
}