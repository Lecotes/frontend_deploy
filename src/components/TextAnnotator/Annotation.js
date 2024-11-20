import React, { useState } from 'react';

const Annotation = ({ annotation, replies, userId, deleteAnnotation }) => {
    const [replyText, setReplyText] = useState('');

    const addReply = async () => {
        try {
            await fetch(`${process.env.REACT_APP_API_BASE_URL}/annotations/${annotation.id}/reply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, content: replyText }),
            });
            setReplyText('');
        } catch (err) {
            console.error('Error adding reply:', err);
        }
    };

    return (
        <div className="mb-4 p-4 bg-white border rounded shadow">
            <p className="font-semibold text-gray-900">{annotation.content}</p>
            <p className="text-sm italic text-gray-500">
                Annotated Text: "{annotation.content}"
            </p>
            <small className="text-gray-500">By: {annotation.username}</small>
            <div className="flex items-center mt-2 space-x-2">
                {/* Delete button */}
                {(annotation.userId === userId || annotation.text_owner_id === userId) && (
                    <button
                        onClick={() => deleteAnnotation(annotation.id)}
                        className="text-red-700 hover:text-red-900 ml-2"
                    >
                        Delete
                    </button>
                )}
            </div>
            {replies.map((reply) => (
                <div key={reply.id} style={{ marginLeft: '20px' }}>
                    {reply.content}
                </div>
            ))}
            <textarea
                placeholder="Add reply"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full p-2 mt-2 border rounded"
            ></textarea>
            <button onClick={addReply} className="text-blue-600 hover:text-blue-800 mt-2">
                Submit
            </button>
        </div>
    );
};

export default Annotation;
