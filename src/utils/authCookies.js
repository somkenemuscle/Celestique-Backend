//SET COOKIES
export function setRefreshToken(res, refreshToken) {
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    const bufferTimeInMs = 60 * 60 * 1000; // Subtract 1 hour (3600000 ms)

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: sevenDaysInMs - bufferTimeInMs, // Slightly less than 7 days
        path: '/'
    });
}



export function setAccessToken(res, accessToken) {
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 14 * 60 * 1000, // 14 minutes
        path: '/'
    });
}


//REMOVE COOKIES
export function removeRefreshToken(res) {
    res.cookie('refreshToken', '', {
        httpOnly: true, secure: true, sameSite: 'None', maxAge: 0, path: '/'
    });
}


export function removeAccessToken(res) {
    res.cookie('accessToken', '', {
        httpOnly: true, secure: true, sameSite: 'None', maxAge: 0, path: '/'
    });
}




