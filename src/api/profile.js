import request from '@/utils/request.js'

export function getUserProfile() {
    return request({
        url: '/sys/user/profile',
        method: 'get'
    })
}

export function updateUserProfile(sysUser) {
    return request({
        url: '/sys/user/profile/edit',
        method: 'put',
        data: sysUser
    })
}

export function updateUserPassword(oldPassword, newPassword) {
    return request({
        url: '/sys/user/profile/edit/pwd',
        method: 'put',
        data: {
            oldPassword: oldPassword,
            newPassword: newPassword
        }
    })
}

