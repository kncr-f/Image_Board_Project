import * as Vue from './vue.js';
import modalComponent from './modalComponent.js';
// console.log('Vue', Vue);

const app = Vue.createApp({
    data() {
        return {
            error: false,
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

        addEventListener("popstate", (e) => {

            this.imageId = location.pathname.slice(1);

        });


        fetch("/getImages")
            .then(resp => resp.json())
            .then(data => {


                this.images = data;


            }).catch(err => console.log('err', err))

    },

    components: {
        "modal-component": modalComponent,

    },

    methods: {
        selectFile: function (e) {

            this.file = e.target.files[0]
        },
        upload: function (e) {

            if (
                this.title === "" ||
                this.username === "" ||
                this.description === ""
            ) {
                this.error = true;

                return;
            }
            const fd = new FormData();

            fd.append("file", this.file);
            fd.append("title", this.title);
            fd.append("username", this.username);
            fd.append("description", this.description);


            fetch("/upload", {
                method: "POST",
                body: fd,
            })
                .then(resp => resp.json())
                .then((resp) => {
                    console.log('resp in fetch / upload', resp)
                    this.images.unshift(resp);
                    this.title = "";
                    this.description = "";
                    this.username = "";

                })
                .catch(err => console.log('err in upload', err))


        },

        moreImage: function (lowestId) {

            fetch(`/getMoreImages/${lowestId}`)
                .then(resp => resp.json())
                .then(data => {


                    if (data[data.length - 1].id == data[data.length - 1].lowestId) {
                        this.isHidden = true
                    }
                    this.images = [...this.images, ...data]


                }).catch(err => console.log('err', err))
        },

        toggle: function () {
            this.imageId = !this.imageId;
            history.pushState({}, "", "/");


        },

        updated: function (arg) {

            history.pushState({}, "", this.imageId);
            this.imageId = arg;

        },

        open: function (clickedImg) {

            history.pushState({}, "", clickedImg)
            this.imageId = clickedImg;

        },

        disappear_error: function () {
            this.error = !this.error;
        }
    }


});

app.mount("#main");