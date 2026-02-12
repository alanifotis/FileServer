
const CONFIG = {
    CHUNK_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_PARALLEL_UPLOADS: 4,
    MAX_RETRIES: 5,
    RETRY_DELAY: 2000,
    ENDPOINTS: {
        UPLOAD: '/api/files',
        CREATE_FOLDER: '/api/files/folder'
    }
};

export default CONFIG;