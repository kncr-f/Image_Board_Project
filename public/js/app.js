import * as Vue from './vue.js';
import modalComponent from './modalComponent.js';
// console.log('Vue', Vue);

const app = Vue.createApp({
    data() {
        return {
            error: "",
            title: "",
            description: "",
            username: "",
            file: null,
            images: [],
            imageId: location.pathname.slice(1),
            isHidden: false

        }
    },


    mounted: function () {

        // console.log(location.pathname.slice(1));
        addEventListener("popstate", (e) => {
            console.log("e.state", e.state);
            console.log('location.pathname.slice(1)', location.pathname.slice(1))
            this.imageId = location.pathname.slice(1);

        });


        fetch("/getImages")
            .then(resp => resp.json())
            .then(data => {
                //console.log('data from /getImages', data);

                this.images = data;


            }).catch(err => console.log('err', err))

    },

    components: {
        "modal-component": modalComponent,

    },

    methods: {
        selectFile: function (e) {
            // console.log('user selected a file')
            // console.log('e.target.files', e.target.files[0])
            this.file = e.target.files[0]
        },
        upload: function (e) {

            if (
                this.title === "" ||
                this.username === "" ||
                this.description === ""
            ) {
                this.error = "You must fill the all fields";

                return;
            }
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
                    this.images.unshift(resp)

                })
                .catch(err => console.log('err in upload', err))


        },

        moreImage: function (lowestId) {
            console.log('arg', lowestId)
            // if (this.imageId == this.lowestId) {
            //     console.log('first id ler esit')
            // }
            fetch(`/getMoreImages/${lowestId}`)
                .then(resp => resp.json())
                .then(data => {
                    console.log('getMoreImages...', data);
                    console.log('getMoreImages...id', data[data.length - 1].id);
                    // console.log('this.images...', this.images);
                    if (data[data.length - 1].id == data[data.length - 1].lowestId) {
                        this.isHidden = true
                    }
                    this.images = [...this.images, ...data]


                }).catch(err => console.log('err', err))
        },

        close: function () {
            this.imageId = false;
            history.pushState({}, "", "/");


        },

        open: function (clickedImg) {
            //console.log("arg", arg);
            history.pushState({}, "", clickedImg)
            this.imageId = clickedImg;

        }
    }


});

app.mount("#main");