import * as Vue from './vue.js';
// console.log('Vue', Vue);

const app = Vue.createApp({
    data() {
        return {
            title: "",
            description: "",
            username: "",
            file: null,
            images: []
        }
    },

    mounted: function () {

        fetch("/getImages")
            .then(resp => resp.json())
            .then(data => {
                console.log('data from /getImages', data);
                // console.log('this: ', this);
                this.images = data;
            }).catch(err => console.log('err', err))
    },

    methods: {
        selectFile: function (e) {
            // console.log('user selected a file')
            // console.log('e.target.files', e.target.files[0])
            this.file = e.target.files[0]
        },
        upload: function (e) {
            // e.preventDefault(); unless you prevent default in the html 
            //directly using vue SyntaxError, 
            //you would need to do it here, 
            //otherwise we will see the refresh 
            //that gets truggered from btn clicks inside forms
            // console.log('this.title', this.title);
            // console.log('this.description', this.description);
            // console.log('this.username', this.username);
            // console.log('this.file', this.file);
            //before wr are sending a file, we cannot jest make a json post request so we are using FormData
            const fd = new FormData();
            // console.log('fd', fd)
            fd.append("file", this.file);
            fd.append("title", this.title);
            fd.append("username", this.username);
            fd.append("description", this.description);
            // console.log('fd', fd) // after append it seems still empty object it is wierd
            // for (let value of fd.values()) {
            //     console.log('value', value) // after this loop you can obtain and see the values on console
            // }

            // we want to now send all this info over to the server

            fetch("/upload", {
                method: "POST",
                body: fd,
            })
                .then(resp => resp.json())
                .then((resp) => {
                    console.log('resp in fetch / upload', resp)
                    this.images.unshift(resp[0])

                })
                .catch(err => console.log('err in upload', err))


        },

    }


});

app.mount("#main");