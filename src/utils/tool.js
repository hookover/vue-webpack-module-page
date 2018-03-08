import store from '../vuex/store'

export function convertVeeTag (key){

    return '[ ' + key + ' ]'
}
export function deepCheckVeeValidate(vm) {
    if(vm.hasOwnProperty('$validator')) {
        vm.$validator.validateAll().then(
            res=>{
                if(!res) {
                    store.dispatch('updateData', {errors: vm.errors.all()});
                }
            },
        );
        if (vm.hasOwnProperty('$children')) {
            if (vm.$children instanceof Array) {
                for (let i in vm.$children) {
                    deepCheckVeeValidate(vm.$children[i])
                }
            }
        }
    }
}
export function checkVeeValidate(vm) {
    //重置数据中的错误
    store.dispatch('updateData', {errors: []});
    deepCheckVeeValidate(vm);
}