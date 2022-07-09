import {NIcon} from 'naive-ui'
import appButton from '../components/btns/appButton.vue'

export default {
    components: {NIcon, appButton},
    data(){
        return {
            routes: [
                {icon: 'HomeOutline', path: '/main', title: 'Главная'},
                {icon: 'PersonCircleOutline', path: '/user-data', title: 'Данные'},
                {icon: 'CalculatorOutline', path: '/calculations', title: 'Расчеты'},
                {icon: 'CashOutline', path: '/record/current-month', title: 'Отчет'},
                {icon: 'ArchiveOutline', path: '/arhive', title: 'Архив'},
            ]
        }
    },
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
}