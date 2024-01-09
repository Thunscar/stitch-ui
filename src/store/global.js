import {defineStore} from "pinia";
import {getUserTheme, setUserTheme, useTheme} from "@/utils/theme.js";
import {getDefaultLayout} from "@/utils/layout.js";

export const useGlobalStore = defineStore('global', {
    state: () => ({
        theme: getUserTheme(),
        layout: getDefaultLayout(),
        homeEnable: true
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
        }
    }
})