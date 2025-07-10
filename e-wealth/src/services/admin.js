// admin.js
// Service for admin content management and analytics logic. 

// TODO: Admin upload features are not implemented. Implement with MySQL backend or another service as needed.
export async function uploadAdminVideo(videoFile) {
  // TODO: Implement actual upload logic (e.g., Firebase Storage, S3, etc.)
  throw new Error('uploadAdminVideo not implemented');
} 

// uploadAdminTopicWithVideo: Uploads a topic with video to Firestore and Storage.
// @param {string} title - Topic title
// @param {string} description - Topic description
// @param {object} videoFile - Video file object from DocumentPicker
// @returns {Promise<string>} - Resolves with the topic document ID
export async function uploadAdminTopicWithVideo(title, description, videoFile, topicId = 1, duration = 0, type = 'video') {
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
      // Do NOT set Content-Type manually! Let the browser set it.
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Upload failed');
    return await res.json();
  } catch (error) {
    throw error;
  }
} 