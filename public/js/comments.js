const comments = {
    data() {
        return {
            error: "",
            comments: [],
            comment: "",
            username: "",
        }
    },
    props: ["imgchild"],

    mounted() {

        this.getCommits();

    },

    watch: {
        imgchild: function () {
            this.getCommits();
        }
    },


    methods: {

        getCommits: function () {
            fetch(`/getComments/${this.imgchild}`)
                .then(resp => resp.json())
                .then(data => {
                    console.log('data from /getComments', data);
                    this.comments = data;


                }).catch(err => console.log('err', err))
        },

        submit: function () {
            console.log('submit function running');
            if (this.comment === "" || this.username === "") {
                this.error = "You must fill the comment and username area";
                return;
            }
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
                    const date = new Date(resp.created_at);
                    const cleanDate = new Intl.DateTimeFormat("en-GB", {
                        dateStyle: "long",
                        timeStyle: "short",
                    }).format(date);
                    resp.created_at = cleanDate;
                    this.comments.unshift(resp);
                    this.comment = "";
                    this.username = "";

                })
                .catch(err => console.log('err in upload', err))

        }
    },

    template: `

     <div class='comments_component'>
           <h3>Add a Comment! </h3>
          
            <input  v-model="comment" type="text" name="comment" placeholder="comment">
            <input  v-model="username" type="text" name="username" placeholder="username">
            <button @click.prevent.default="submit">SUBMIT</button>
            <div v-if="error">{{error}}</div>
            <h4 class="commits_title">Commits</h4>
            <div class="comments_area" v-for="comment in comments">
            
              <ul>
                <li>{{comment.comment_text}} - {{comment.created_at}} </li>
              </ul>

            </div>
       
           
        </div>
    `
};

export default comments;