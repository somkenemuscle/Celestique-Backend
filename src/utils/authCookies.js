//SET COOKIES
export function setRefreshToken(res, refreshToken) {
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/'
    });
}


export function setAccessToken(res, accessToken) {
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict',
        maxAge: 15 * 60 * 1000, // 15 minutes
        path: '/'
    });
}


//REMOVE COOKIES
export function removeRefreshToken(res) {
    res.cookie('refreshToken', '', {
        httpOnly: true, secure: false, sameSite: 'Strict', maxAge: 0, path: '/'
    });
}


export function removeAccessToken(res) {
    res.cookie('accessToken', '', {
        httpOnly: true, secure: false, sameSite: 'Strict', maxAge: 0, path: '/'
    });
}




