import React, { useState } from 'react';

const Annotation = ({ annotation, replies, userId, deleteAnnotation }) => {
    const [replyText, setReplyText] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(annotation.content);
    const [replyEditId, setReplyEditId] = useState(null);
    const [editedReplyText, setEditedReplyText] = useState('');

    const addReply = async () => {
        try {
            await fetch(`https://lecotes-backend.onrender.com/api/annotations/${annotation.id}/reply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, content: replyText }),
                credentials: 'include'
            });
            setReplyText('');
        } catch (err) {
            console.error('Error adding reply:', err);
        }
    };

    const updateAnnotation = async () => {
        try {
            await fetch(`https://lecotes-backend.onrender.com/api/annotations/${annotation.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: editedContent }),
                credentials: 'include'
            });
            setIsEditing(false);
        } catch (err) {
            console.error('Error updating annotation:', err);
        }
    };

    const updateReply = async (replyId) => {
        try {
            await fetch(`https://lecotes-backend.onrender.com/api/annotations/reply/${replyId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: editedReplyText }),
                credentials: 'include'
            });
            setReplyEditId(null);
            setEditedReplyText('');
        } catch (err) {
            console.error('Error updating reply:', err);
        }
    };

    return (
        <div className="mb-4 p-4 bg-white border rounded shadow">
            {isEditing ? (
                <>
                    <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                    <button onClick={updateAnnotation} className="text-blue-600 hover:text-blue-800 mt-2">
                        Save
                    </button>
                </>
            ) : (
                <>
                    <p className="font-semibold text-gray-900">{annotation.content}</p>
                    <button onClick={() => setIsEditing(true)} className="text-blue-600 hover:text-blue-800 mt-2">
                        Edit
                    </button>
                </>
            )}
            {replies.map((reply) => (
                <div key={reply.id} style={{ marginLeft: '20px' }}>
                    {replyEditId === reply.id ? (
                        <>
                            <textarea
                                value={editedReplyText}
                                onChange={(e) => setEditedReplyText(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                            <button onClick={() => updateReply(reply.id)} className="text-blue-600 hover:text-blue-800 mt-2">
                                Save
                            </button>
                        </>
                    ) : (
                        <>
                            <p>{reply.content}</p>
                            <button onClick={() => { setReplyEditId(reply.id); setEditedReplyText(reply.content); }} className="text-blue-600 hover:text-blue-800 mt-2">
                                Edit
                            </button>
                        </>
                    )}
                </div>
            ))}
            <textarea
                placeholder="Add reply"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full p-2 mt-2 border rounded"
            />
            <button onClick={addReply} className="text-blue-600 hover:text-blue-800 mt-2">
                Submit
            </button>
        </div>
    );
};

export default Annotation;
