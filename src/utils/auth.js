export const userStorageKey = 'user'

export function getToken() {
    const user = localStorage.getItem(userStorageKey)
    if (!user) {
        return undefined
    }
    return JSON.parse(user).token
}

export function removeToken() {
    localStorage.clear()
    // localStorage.removeItem(userStorageKey)
}


