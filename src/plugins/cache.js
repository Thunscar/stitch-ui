/**
 * 浏览器本地缓存
 */
const sessionCache = {
    set(key, value) {
        if (!sessionStorage) {
            return
        }
        if (key != null && value != null) {
            sessionStorage.setItem(key, value)
        }
    }, get(key) {
        if (!sessionStorage) {
            return
        }
        if (key == null) {
            return null
        }
        return sessionStorage.getItem(key)
    }, setJSON(key, jsonValue) {
        if (jsonValue != null) {
            this.set(key, JSON.stringify(jsonValue))
        }
    }, getJSON(key) {
        const value = this.get(key);
        if (value != null) {
            return JSON.parse(value)
        }
    }, remove(key) {
        sessionStorage.removeItem(key)
    }
}

const localCache = {
    set(key, value) {
        if (!localStorage) {
            return
        }
        if (key != null && value != null) {
            localStorage.setItem(key, value)
        }
    }, get(key) {
        if (!localStorage) {
            return
        }
        if (key == null) {
            return null
        }
        return localStorage.getItem(key)
    }, setJSON(key, jsonValue) {
        if (key != null && jsonValue != null) {
            this.set(key, JSON.stringify(jsonValue))
        }
    }, getJSON(key) {
        const value = this.get(key)
        if (value != null) {
            return JSON.parse(value)
        }
    }, remove(key) {
        localStorage.removeItem(key)
    }
}

export default {
    localCache,
    sessionCache
}