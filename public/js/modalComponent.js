import comments from './comments.js';
const modalComponent = {
    data() {
        return {
            image: {},
            num: 0,
            imageId: this.img,
            previousImgId: 0,
            nextImgId: 0,
            isPreviousHidden: false,
            isNextHidden: false
        }
    },
    props: ["img"],

    mounted() {

        this.fetchMethod();



    },
    components: {
        "comments": comments
    },

    watch: {
        img: function () {
            this.fetchMethod();
        },
    },
    methods: {
        fetchMethod: function () {
            fetch(`/getImageFromId/${this.img}`)
                .then(resp => resp.json())
                .then(data => {
                    console.log('data from /getImageFromId', data);

                    if (data.length == 0) {
                        console.log('close the modal')
                        this.$emit("xclicked");

                    } else {
                        const date = new Date(data[0].created_at);

                        if (!data[0].prevImgId) {
                            this.isPreviousHidden = true;
                        }

                        if (!data[0].nextImgId) {
                            this.isNextHidden = true;
                        }

                        const cleanDate = new Intl.DateTimeFormat("en-GB", {
                            dateStyle: "long",
                            timeStyle: "short",
                        }).format(date);
                        data[0].created_at = cleanDate;
                        this.image = data[0];
                        console.log('data', data[0])
                    }

                }).catch((err) => {
                    console.log('err', err);


                })
        },
        closeModal: function () {

            this.$emit("xclicked");


        },
        previous: function () {
            this.previousImgId = this.image.prevImgId;
            console.log(this.previousImgId);
            if (this.previousImgId) {
                this.isNextHidden = false;
                this.$emit("update", this.previousImgId);

            } else {
                this.isPreviousHidden = true;
            }
        },
        next: function () {
            this.nextImgId = this.image.nextImgId;
            console.log(this.nextImgId);
            if (this.nextImgId) {
                this.isPreviousHidden = false;
                this.$emit("update", this.nextImgId)


            } else {
                this.isNextHidden = true;
            }
        }
    },

    template: `

     <div class='img_component'>
            
             <div id="close" @click='closeModal'> ❌ </div>
             <div class="img_block">
             <div class="back_arrow" v-if="!isPreviousHidden" @click="previous"> <p> &lt </p> </div>
             <img  :src="image.url" />
              <div class="forward_arrow" v-if="!isNextHidden" @click="next"> <p> > </p> </div> 
             </div>
             
             <div class="description_text">
             <h3>{{image.title}}</h3>
             <p>{{image.description}}</p>
             <p>{{image.created_at}}</p>
             </div>

             <comments :imgchild="imageId"></comments>
           
        </div>

       
    `
};

export default modalComponent;