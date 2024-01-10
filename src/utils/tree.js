/**
 * 获取树形父级ID
 * @param data 数据列表
 * @returns {*|number}
 */
function getTreeParent(data) {
    if (data == null || data[0] == null) {
        return 0
    }
    let parentId = data[0].parentId
    for (let i = 0; i < data.length; i++) {
        if (data[i].parentId < parentId) {
            parentId = data[i].parentId
        }
    }
    return parentId
}

/**
 * 构建树形数据
 * @param data 数据列表
 * @param parentId 父ID
 * @param primaryKey 主键名称
 * @returns {null|*[]}
 */
function buildTreeData(data, parentId, primaryKey) {
    let menuData = []
    for (let i = 0; i < data.length; i++) {
        if (data[i].parentId === parentId) {
            data[i].children = buildTreeData(data, data[i][`${primaryKey}`], primaryKey)
            data[i].inTree = 1
            menuData.push(data[i])
        }
    }
    return menuData.length === 0 ? null : menuData
}

/**
 * 构建树形选择框数据
 * @param data 数据
 * @param primaryKey 主键ID键
 * @param titleKey label键
 * @param parentId 父级ID
 * @returns {*[]}
 */
function buildSelectTree(data, primaryKey, titleKey, parentId) {
    let menuList = []
    for (let i = 0; i < data.length; i++) {
        if (data[i].parentId === parentId) {
            data[i].children = buildSelectTree(data, primaryKey, titleKey, data[i][`${primaryKey}`])
            data[i].label = data[i][`${titleKey}`]
            data[i].value = data[i][`${primaryKey}`]
            menuList.push(data[i])
        }
    }
    return menuList
}

/**
 * 初始化树形列表数据
 * @param data 列表数据
 * @param primaryKey 主键名称
 * @returns {*[]|null}
 */
export function initTreeData(data, primaryKey) {
    const parentId = getTreeParent(data)
    const buildMenu = buildTreeData(data, parentId, primaryKey)
    for (let i = 0; i < data.length; i++) {
        if (data[i] && data[i].inTree !== 1) {
            const newBuildMenu = buildTreeData(data, data[i].parentId, primaryKey)
            buildMenu.push(...newBuildMenu)
        }
    }
    return buildMenu
}

/**
 * 初始化选择框数据
 * @param data 数据
 * @param primaryKey 主键ID键
 * @param titleKey label键
 * @returns {*[]}
 */
export function initSelectTree(data, primaryKey, titleKey) {
    return buildSelectTree(data, primaryKey, titleKey, 0)
}

