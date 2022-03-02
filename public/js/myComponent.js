const myComponent = {
    data() {
        return {
            image: {},
            num: 0
        }
    },
    props: ["img"],

    mounted() {
        // console.log('myComponent rendered');
        // console.log("props...", this.img);

        fetch(`/getImageFromId/${this.img}`)
            .then(resp => resp.json())
            .then(data => {
                //console.log('data from /getImageFromId', data);
                this.image = data[0];
                //console.log('data', data[0])

            }).catch(err => console.log('err', err))


    },

    methods: {

        closeModal: function () {
            console.log('closeModal function running');
            this.$emit("xclicked")
        }
    },

    template: `

     <div class='img_component'>
             <div id="close" @click='closeModal'> ❌</div>
             <img :src="image.url" />
             <div class="description_text">
             <h3>{{image.title}}</h3>
             <p>{{image.description}}</p>
             </div>
             

           
        </div>
    `
};

export default myComponent;