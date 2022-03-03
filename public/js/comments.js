const comments = {
    data() {
        return {
            comments: [],
            comment: "",
            username: "",
        }
    },
    props: ["imgchild"],

    mounted() {
        // console.log("comments_props...", this.imgchild);
        fetch(`/getComments/${this.imgchild}`)
            .then(resp => resp.json())
            .then(data => {
                console.log('data from /getCommentsFromImgId', data);
                this.comments = data;


            }).catch(err => console.log('err', err))

    },


    methods: {

        submit: function () {
            console.log('submit function running');

            fetch("/postComment", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    comment: this.comment,
                    username: this.username,
                    img_id: this.imgchild
                })
            })
                .then(resp => resp.json())
                .then((resp) => {
                    console.log('resp in fetch / postComment in commnets component', resp)
                    this.comments.unshift(resp)

                })
                .catch(err => console.log('err in upload', err))



        }
    },

    template: `

     <div class='comments_component'>
           <h1>Add a Comment! </h1>
          
            <input  v-model="comment" type="text" name="comment" placeholder="comment">
            <input  v-model="username" type="text" name="username" placeholder="username">
            <button @click.prevent.default="submit">SUBMIT</button>
            <div class="comments_area" v-for="comment in comments">
                <p>{{comment.comment_text}}</p>
            </div>
       
           
        </div>
    `
};

export default comments;