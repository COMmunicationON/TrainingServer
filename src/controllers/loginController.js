const MongoStore = require('connect-mongo')

const sessionStore = MongoStore.create({
    mongoUrl: process.env.SESSION_DB_URI,
    collectionName: 'sessions'
});


/**
 * 세션 ID를 이용해 해당 세션이 존재하는지 확인하는 함수
 * @param {string} sessionId - 검사할 세션 ID
 * @returns {Promise<boolean>} 세션 존재 여부 (true/false)
 */
async function isSessionValid(sessionId) {
    try {
        const session = await sessionStore.get(sessionId);
        // 세션 객체가 존재하고, 사용자 정보를 포함하고 있으면 세션은 유효함
        return !!session && !!session.user;
    } catch (error) {
        console.error('Error accessing session store:', error);
        return false;  // 에러 발생 시 세션 무효 처리
    }
}

module.exports = isSessionValid;