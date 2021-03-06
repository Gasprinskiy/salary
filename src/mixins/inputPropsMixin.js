import appInputTemplate from '../components/templates/appInputTemplate.vue'

export default {
    components: {appInputTemplate},
    props: {
        icon: {
            type: Object,
            default: null
        },
        label: {
            type: String,
            default: ''
        },
        invalid: {
            type: Boolean,
            default: false
        },
        flat: {
            type: Boolean,
            default: false
        },
        align: {
            type: String,
            default: ''
        },
        value: [String, Number],
        itemId: {
            type: Number,
            required: false,
            default: 0
        }
    },

    computed: {
        computedStyle(){
            return {
                'text-align': this.align
            }
        }
    },
}   