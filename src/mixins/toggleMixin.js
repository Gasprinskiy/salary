export default {
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },

    methods: {
        openModal(){
            this.$emit('update:show', true)
        },
        closeModal(){
            this.$emit('update:show', false)
        }
    }
}