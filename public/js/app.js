import * as Vue from './vue.js';
// console.log('Vue', Vue);

const app = Vue.createApp({
    data() {
        return {
            images: []
        }
    },
    mounted: function () {

        fetch("/getImages")
            .then(resp => resp.json())
            .then(data => {
                console.log('data from /getImages', data);
                console.log('this: ', this);
                this.images = data;
            }).catch(err => console.log('err', err))
    }


});

app.mount("#main");