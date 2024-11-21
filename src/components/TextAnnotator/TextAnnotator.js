import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TrashIcon, ThumbUpIcon, ThumbDownIcon } from '@heroicons/react/outline'; // Heroicons import

const TextAnnotator = ({ user }) => {
    const { id: textId } = useParams();
    const navigate = useNavigate(); // Use the hook to navigate
    const [text, setText] = useState('');
    const [annotations, setAnnotations] = useState([]);
    const [replies, setReplies] = useState([]);
    const [selectedText, setSelectedText] = useState('');
    const [selectedRange, setSelectedRange] = useState(null);
    const [title, setTitle] = useState('');
    const [expandedReplies, setExpandedReplies] = useState({});
    const [replyContent, setReplyContent] = useState('');
    const [editingAnnotationId, setEditingAnnotationId] = useState(null);
    const [editingReplyId, setEditingReplyId] = useState(null);
    const [editContent, setEditContent] = useState('');


    // Fetch text, annotations, and replies
    const fetchAnnotations = async () => {
        if (!textId) return;

        try {
            const response = await fetch(`https://lecotes-backend.onrender.com/api/texts/${textId}`, {
                credentials: 'include',
              });
            if (!response.ok) throw new Error(`Failed to fetch text or annotations: ${response.statusText}`);

            const data = await response.json();
            setTitle(data.text.title);
            setText(data.text.content);
            setAnnotations(data.annotations);
            setReplies(data.replies);
        } catch (err) {
            console.error('Error fetching text or annotations:', err);
        }
    };

    useEffect(() => {
        fetchAnnotations();
    }, [textId]);

    const handleTextSelection = () => {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        if (selection.toString().length > 0) {
            const container = document.querySelector('.prose');
            const preSelectionRange = range.cloneRange();
            preSelectionRange.selectNodeContents(container);
            preSelectionRange.setEnd(range.startContainer, range.startOffset);
            const start = preSelectionRange.toString().length;
            const end = start + selection.toString().length;

            setSelectedText(selection.toString());
            setSelectedRange({ start, end });
        }
    };

    const addAnnotation = async (comment) => {
        if (selectedText && selectedRange) {
            try {
                await fetch('https://lecotes-backend.onrender.com/api/annotations/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        textId,
                        userId: user.userId,
                        content: comment,
                        rangeStart: selectedRange.start,
                        rangeEnd: selectedRange.end,
                    }),
                });
                setSelectedText('');
                setSelectedRange(null);
                fetchAnnotations();
            } catch (err) {
                console.error('Error adding annotation:', err);
            }
        }
    };

    const addReplyToAnnotation = async (annotationId, replyContent) => {
        try {
            await fetch('https://lecotes-backend.onrender.com/api/annotations/reply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.userId,
                    annotationId,
                    content: replyContent,
                }),
            });
            setReplyContent(''); // Clear reply input
            fetchAnnotations(); // Refresh data
        } catch (err) {
            console.error('Error adding reply:', err);
        }
    };

    const deleteAnnotation = async (annotationId) => {
        try {
            const isOwner = annotations.some((annotation) => annotation.id === annotationId && annotation.user_id === user.userId);
            const isTextOwner = text.owner_id === user.userId;

            if (isOwner || isTextOwner) {
                await fetch(`/api/annotations/${annotationId}/delete`, { method: 'DELETE' });
                fetchAnnotations();
            } else {
                alert("You can only delete your own annotations.");
            }
        } catch (err) {
            console.error('Error deleting annotation:', err);
        }
    };

    const deleteReply = async (replyId) => {
        try {
            const response = await fetch(`https://lecotes-backend.onrender.com/api/annotations/reply/${replyId}/delete`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.userId }),
            });

            if (!response.ok) {
                throw new Error('Error deleting reply');
            }

            fetchAnnotations(); // Refresh data after deletion
        } catch (err) {
            console.error('Error deleting reply:', err);
        }
    };

    const voteAnnotation = async (id, voteValue) => {
        try {
            const response = await fetch(`https://lecotes-backend.onrender.com/api/annotations/${id}/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.userId, voteValue }),
            });
            if (!response.ok) {
                throw new Error('You can only vote once per annotation.');
            }
            fetchAnnotations();
        } catch (err) {
            console.error('Error voting on annotation:', err);
        }
    };

    const voteReply = async (replyId, voteValue) => {
        try {
            const response = await fetch(`https://lecotes-backend.onrender.com/api/annotations/${replyId}/reply-vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.userId, voteValue }),
            });
            if (!response.ok) {
                throw new Error('You can only vote once per reply.');
            }
            fetchAnnotations();
        } catch (err) {
            console.error('Error voting on reply:', err);
        }
    };

    const toggleReplies = (annotationId) => {
        setExpandedReplies((prevState) => ({
            ...prevState,
            [annotationId]: !prevState[annotationId],
        }));
    };

    const editAnnotation = async (annotationId) => {
        try {
            await fetch(`https://lecotes-backend.onrender.com/api/annotations/${annotationId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: editContent }),
            });
            setEditingAnnotationId(null); // Exit edit mode
            fetchAnnotations(); // Refresh data
        } catch (err) {
            console.error('Error editing annotation:', err);
        }
    };
    
    const editReply = async (replyId) => {
        try {
            await fetch(`https://lecotes-backend.onrender.com/api/annotations/reply/${replyId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: editContent }),
            });
            setEditingReplyId(null); // Exit edit mode
            fetchAnnotations(); // Refresh data
        } catch (err) {
            console.error('Error editing reply:', err);
        }
    };
    


    const renderHighlightedText = () => {
        if (!text) return null;

        const elements = [];
        let lastIndex = 0;

        const sortedAnnotations = [...annotations].sort((a, b) => a.range_start - b.range_start);

        sortedAnnotations.forEach((annotation) => {
            if (lastIndex < annotation.range_start) {
                elements.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex, annotation.range_start)}</span>);
            }

            elements.push(
                <span
                    key={`highlight-${annotation.id}`}
                    className={`px-1 rounded cursor-pointer ${
                        annotation.isMerged ? 'bg-green-200' : 'bg-yellow-200'
                    }`}
                    title={`${annotation.content} - by ${annotation.username}`}
                >
                    {text.slice(annotation.range_start, annotation.range_end)}
                </span>
            );

            lastIndex = annotation.range_end;
        });

        if (lastIndex < text.length) {
            elements.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex)}</span>);
        }

        return elements;
    };

    const renderReplies = (annotationId) => {
        const annotationReplies = replies
            .filter((reply) => reply.annotation_id === annotationId)
            .sort((a, b) => b.votes - a.votes);
    
        const areRepliesExpanded = expandedReplies[annotationId];
    
        return (
            <div>
                <button
                    onClick={() => toggleReplies(annotationId)}
                    className="text-blue-600 hover:text-blue-800 text-sm mb-2"
                >
                    {areRepliesExpanded ? 'Collapse Replies' : 'Expand Replies'}
                </button>
    
                {areRepliesExpanded &&
                    annotationReplies.map((reply) => (
                        <div
                            key={reply.id}
                            className="p-2 mt-2 border rounded bg-gray-50"
                        >
                            {editingReplyId === reply.id ? (
                                <textarea
                                    className="w-full p-2 border rounded"
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                />
                            ) : (
                                <p>{reply.content}</p>
                            )}
                            <small className="text-gray-500">By: {reply.username}</small>
                            <div className="flex items-center mt-2 space-x-2">
                                <button
                                    className="text-green-600 hover:text-green-800"
                                    onClick={() => voteReply(reply.id, 1)}
                                >
                                    <ThumbUpIcon className="w-5 h-5" />
                                </button>
                                <span>{reply.votes}</span>
                                <button
                                    className="text-red-600 hover:text-red-800"
                                    onClick={() => voteReply(reply.id, -1)}
                                >
                                    <ThumbDownIcon className="w-5 h-5" />
                                </button>
                                {(reply.user_id === user.userId || text.owner_id === user.userId) && (
                                    <>
                                        <button
                                            onClick={() => {
                                                setEditingReplyId(reply.id);
                                                setEditContent(reply.content);
                                            }}
                                            className="text-blue-600 hover:text-blue-800 ml-2"
                                        >
                                            Edit
                                        </button>
                                        {editingReplyId === reply.id && (
                                            <button
                                                onClick={() => editReply(reply.id)}
                                                className="bg-green-500 text-white px-2 py-1 rounded ml-2"
                                            >
                                                Save
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteReply(reply.id)}
                                            className="text-red-700 hover:text-red-900 ml-2"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
            </div>
        );
    };
    

    // Navigate back to the dashboard
    const handleBackToDashboard = () => {
        navigate('/dashboard'); // Adjust the path as necessary
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="bg-purple-500 text-white p-4 text-xl font-bold">
                {title}
                {/* Back to Dashboard Button */}
                <button
                    onClick={handleBackToDashboard}
                    className="bg-red-500 text-white px-3 py-1 text-sm rounded-lg hover:bg-red-600 transition-transform duration-300 hover:scale-105 float-right"
                >
                    Dashboard
                </button>
            </div>

            <div className="flex h-full">
                <div
                    className="w-2/3 p-4 bg-white overflow-y-auto prose border-r"
                    onMouseUp={handleTextSelection}
                >
                    {renderHighlightedText()}
                </div>

                <div className="w-1/3 p-4 bg-gray-100 overflow-y-auto">
                    {selectedText && (
                        <div className="mb-4 p-4 bg-white border rounded shadow">
                            <p className="font-bold">Selected Text:</p>
                            <p className="italic text-gray-700">{selectedText}</p>
                            <textarea
                                className="w-full mt-2 p-2 border rounded"
                                placeholder="Add annotation..."
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addAnnotation(e.target.value);
                                        e.target.value = '';
                                    }
                                }}
                            ></textarea>
                        </div>
                    )}

                    {annotations.map((annotation) => (
                        <div key={annotation.id} className="mb-4 p-4 bg-white border rounded shadow">
                            {editingAnnotationId === annotation.id ? (
                                <textarea
                                    className="w-full p-2 border rounded"
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                />
                            ) : (
                                <p className="font-semibold text-gray-900">{annotation.content}</p>
                            )}
                            <p className="text-sm italic text-gray-500">
                                Annotated Text: "{text.slice(annotation.range_start, annotation.range_end)}"
                            </p>
                            <small className="text-gray-500">By: {annotation.username}</small>
                            <div className="flex items-center mt-2 space-x-2">
                                <button
                                    className="text-green-600 hover:text-green-800"
                                    onClick={() => voteAnnotation(annotation.id, 1)}
                                >
                                    <ThumbUpIcon className="w-5 h-5" />
                                </button>
                                <span>{annotation.votes}</span>
                                <button
                                    className="text-red-600 hover:text-red-800"
                                    onClick={() => voteAnnotation(annotation.id, -1)}
                                >
                                    <ThumbDownIcon className="w-5 h-5" />
                                </button>
                                {(annotation.user_id === user.userId || text.owner_id === user.userId) && (
                                    <>
                                        <button
                                            onClick={() => {
                                                setEditingAnnotationId(annotation.id);
                                                setEditContent(annotation.content);
                                            }}
                                            className="text-blue-600 hover:text-blue-800 ml-2"
                                        >
                                            Edit
                                        </button>
                                        {editingAnnotationId === annotation.id && (
                                            <button
                                                onClick={() => editAnnotation(annotation.id)}
                                                className="bg-green-500 text-white px-2 py-1 rounded ml-2"
                                            >
                                                Save
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteAnnotation(annotation.id)}
                                            className="text-red-700 hover:text-red-900 ml-2"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </>
                                )}
                            </div>
                            {renderReplies(annotation.id)}

                            <textarea
                                className="w-full mt-4 p-2 border rounded"
                                placeholder="Reply to this annotation"
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                            />
                            <button
                                onClick={() => addReplyToAnnotation(annotation.id, replyContent)}
                                className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
                            >
                                Reply
                            </button>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
};

export default TextAnnotator;
