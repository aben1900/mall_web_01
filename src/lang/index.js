import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enLocale from './en'
import zhLocale from './zh'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN' // element-ui lang
import Cookies from 'js-cookie'
import merge from 'deepmerge'

const i18nMessages = {
    en: {
        ...enLocale,
        ...elementEnLocale
    },
    zh: {
        ...zhLocale,
        ...elementZhLocale
    }
}


Vue.use(VueI18n)

const enMerge = merge(merge(enLocale, elementEnLocale), i18nMessages.en)
const zhMerge = merge(merge(zhLocale, elementZhLocale), i18nMessages.zh)

const messages = {
    en: enMerge,
    zh: zhMerge
}

const i18n = new VueI18n({
    locale: Cookies.get('language') || 'zh', // set locale
    messages // set locale messages
})

export default i18n
