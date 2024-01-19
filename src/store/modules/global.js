import {defineStore} from "pinia";
import {getDefaultLayout, getSize, getUserTheme, setSize, setUserTheme, useTheme} from "@/utils/preference.js";
import {zhCn} from "element-plus/es/locale/index";

export const useGlobalStore = defineStore('global', {
    state: () => ({
        theme: getUserTheme(),
        layout: getDefaultLayout(),
        homeEnable: true,
        size: getSize(),
        locale: zhCn
    }),
    actions: {
        //切换用户主题为当前
        ChangeUserTheme() {
            setUserTheme(this.theme)
            useTheme(this.theme)
        },
        //设置当前用户主题并保存到Cookie
        SetUserTheme(theme) {
            this.theme = theme
            this.ChangeUserTheme()
        },
        //修改系统布局
        SetLayout(layout) {
            this.layout = layout
        },
        SetUserSize(size) {
            this.size = size
            //修改Cookie size值
            setSize(this.size)
        }
    }
})