import Cookies from "js-cookie";
import {useStore} from "@/store/index.js";

// 水平布局
export const VerticalLayout = "vertical"
// 垂直布局
export const HorizontalLayout = "horizontal"
// 列布局
export const ColumnlarLayout = "columnlar"

/*Cookie主题保存Key*/
const ThemeKey = "Stitch-Theme"
/*主题枚举*/
/*默认主题*/
export const DefaultTheme = "default"
/*暗黑主题*/
export const DarkTheme = "dark"

/*Cookie布局大小Key*/
export const SizeKey = "Stitch-Size"
/*默认大小*/
export const DefaultSize = 'default'
/*大布局*/
export const LargeSize = 'large'
/*小布局*/
export const SmallSize = 'small'

/**
 * 获取系统默认主题
 */
export function getDefaultLayout() {
    return VerticalLayout
}


/**
 * 获取系统主题
 * dark 暗黑主题
 * default 默认主题
 * @returns {*}
 */
export function getUserTheme() {
    let theme = Cookies.get(ThemeKey)
    if (theme !== DefaultTheme && theme !== DarkTheme) {
        theme = getSystemTheme()
        setUserTheme(theme)
    }
    return theme
}

/**
 * 保存用户选择的系统主题
 * @param theme
 */
export function setUserTheme(theme) {
    Cookies.set(ThemeKey, theme)
}

/**
 * 是否为暗黑主题
 * @returns true 暗黑主题 false 其他主题
 */
function isDark() {
    return media.matches;
}

/**
 * 获取系统主题
 * @returns {string} default(默认主题) or dark(暗黑主题)
 */
export function getSystemTheme() {
    if (isDark()) {
        return DarkTheme;
    } else {
        return DefaultTheme;
    }
}


/**
 * 使用主题
 * 若无参数：根据系统当前主题，黑色或默认主题
 * 若有参数：使用参数主题
 */
export function useTheme(theme) {
    const html = document.getElementById("root");
    if (theme === undefined || theme === null) {
        //直接应用系统主题
        theme = getSystemTheme()
    }
    html.setAttribute("class", theme);
}


/**
 * 系统暗黑模式切换变化监听事件
 */
const media = window.matchMedia("(prefers-color-scheme: dark)")
media.addEventListener('change', changeThemeListener)

/**
 * 监听系统主题变化
 */
function changeThemeListener() {
    const globalStore = useStore().global
    //修改用户状态
    globalStore.SetUserTheme(getSystemTheme())
}


/**
 * 获取布局大小
 */
export function getSize() {
    let size = Cookies.get(SizeKey);
    if (size) {
        return size;
    } else {
        setSize(DefaultSize)
        return DefaultSize
    }
}

/**
 * 设置布局大小到Cookie
 * @param size
 */
export function setSize(size) {
    Cookies.set(SizeKey, size);
}


