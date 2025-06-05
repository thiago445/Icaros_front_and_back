import React, { useState } from 'react';
import './ProfileVideo.css';

function ProfileVideo({ initialVideoId }) {
  const [videoId, setVideoId] = useState(initialVideoId);
  const [isEditing, setIsEditing] = useState(false);
  const [newVideoId, setNewVideoId] = useState(videoId);

  const handleEditClick = () => setIsEditing(true);

  const handleSaveClick = () => {
    setVideoId(newVideoId);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setNewVideoId(videoId);
    setIsEditing(false);
  };

  return (
    <div className="profile-video-container">
      <iframe
        className="profile-video"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>

      {isEditing ? (
        <div className="edit-container">
          <input
            type="text"
            value={newVideoId}
            onChange={(e) => setNewVideoId(e.target.value)}
            placeholder="Enter new video ID"
          />
          <button onClick={handleSaveClick}>Save</button>
          <button onClick={handleCancelClick}>Cancel</button>
        </div>
      ) : (
        <button onClick={handleEditClick}>Edit Video ID</button>
      )}
    </div>
  );
}

export default ProfileVideo;
