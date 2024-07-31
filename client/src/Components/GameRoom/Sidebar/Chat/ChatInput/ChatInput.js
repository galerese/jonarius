
    import React from 'react';
    import './ChatInput.css';

    
    
    const Input = ({message, setMessage, sendMessage}) => (


        <div className='chat-form'>
            <input 
                className='input'
                type='text'
                placeholder='Diz aí...'
                value={message}
                onChange={(event) => setMessage(event.target.value)} 
                onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null} />
            <button className="sendButton" onClick={(event) => sendMessage(event)}><i class="fa fa-paper-plane"></i></button>
        </div>
    );
    
    export default React.memo(Input);
