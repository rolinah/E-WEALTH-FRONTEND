// admin.js
// Service for admin content management and analytics logic. 

// TODO: Admin upload features are not implemented. Implement with MySQL backend or another service as needed.
export async function uploadAdminVideo(videoFile) {
  // TODO: Implement actual upload logic (e.g., Firebase Storage, S3, etc.)
  throw new Error('uploadAdminVideo not implemented');
} 

// createTopicWithVideo: Creates a topic and uploads a video in one step.
// @param {string} title - Topic title
// @param {string} description - Topic description
// @param {object} videoFile - Video file object from DocumentPicker
// @returns {Promise<object>} - Resolves with the topic and video info
export async function createTopicWithVideo(title, description, videoFile, duration = 0, type = 'video') {
  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('duration', duration);
    formData.append('type', type);
    formData.append('video', {
      uri: videoFile.uri,
      name: videoFile.name || 'video.mp4',
      type: videoFile.mimeType || 'video/mp4',
    });
    // Ensure the backend server is running and accessible at http://localhost:3000
    const res = await fetch('http://localhost:3000/admin/create-topic-with-video', {
      method: 'POST',
      body: formData,
      // Do NOT set Content-Type manually! Let the browser set it.
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Upload failed');
    return await res.json();
  } catch (error) {
    throw error;
  }
}

// uploadAdminTopicWithVideo: Uploads a topic with video to Firestore and Storage.
// @param {string} title - Topic title
// @param {string} description - Topic description
// @param {object} videoFile - Video file object from DocumentPicker
// @returns {Promise<string>} - Resolves with the topic document ID
export async function uploadAdminTopicWithVideo(title, description, videoFile, topicId = null, duration = 0, type = 'video') {
  if (!topicId) {
    // New topic: use combined endpoint
    return createTopicWithVideo(title, description, videoFile, duration, type);
  }
  // Existing topic: upload video to topic
  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('topicId', topicId);
    formData.append('duration', duration);
    formData.append('type', type);
    formData.append('video', {
      uri: videoFile.uri,
      name: videoFile.name || 'video.mp4',
      type: videoFile.mimeType || 'video/mp4',
    });
    const res = await fetch('http://localhost:3000/admin/upload-module', {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Upload failed');
    return await res.json();
  } catch (error) {
    throw error;
  }
} 

export async function deleteModuleById(moduleId) {
  try {
    const res = await fetch(`http://localhost:3000/admin/module/${moduleId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Delete failed');
    return await res.json();
  } catch (error) {
    throw error;
  }
} 

// Upload video to existing topic using /upload endpoint
export async function uploadVideoToTopic(topicId, videoFile) {
  try {
    const formData = new FormData();
    formData.append('topicId', topicId);
    formData.append('video', {
      uri: videoFile.uri,
      name: videoFile.name || 'video.mp4',
      type: videoFile.mimeType || 'video/mp4',
    });
    const res = await fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Upload failed');
    return await res.json();
  } catch (error) {
    throw error;
  }
} 