const logoutEl = document.querySelector('#logout');
const closeModalEl = document.querySelector('#closeModal');
const izmeniNalogEl = document.querySelector('#editAccount');
const prikazEl = document.querySelector('.custom_modal');
const editFormEl = document.querySelector('#editForm');
const obrisiProfilEl = document.querySelector('#obrisiProfil');
const postFormEl = document.querySelector('#postForm');
// let korisnicko_imeEl = document.querySelector('#korisnicko_ime').value;
// let edit_mailEl = document.querySelector('#edit_email').value;


let session = new Session();
session_id = session.getSession();

if (session_id !== "") {

    async function praviPodatakKorisnika() {
        let user = new User();
        user = await user.get(session_id);

        document.querySelector('#username').innerText = user['username'];
        document.querySelector('#email').innerText = user['email'];

        document.querySelector('#korisnicko_ime').value = user['username'];
        document.querySelector('#edit_email').value = user['email'];
    }

    praviPodatakKorisnika();

} else {
    //ova kosa crta (/) oznacava pocetnu stranu
    window.location.href = "/";
}


logoutEl.addEventListener('click', e => {
    e.preventDefault();

    session.destroySession();
    window.location.href = '/';
})


izmeniNalogEl.addEventListener('click', () => {
    prikazEl.style.display = 'block';
});

closeModalEl.addEventListener('click', () => {
    prikazEl.style.display = 'none';
})

editFormEl.addEventListener('submit', e => {
    e.preventDefault();

    let user = new User();

    user.username = document.querySelector('#korisnicko_ime').value;
    user.email = document.querySelector('#edit_email').value;
    user.edit();
})

obrisiProfilEl.addEventListener('click', e => {
    e.preventDefault();

    let potvrdaBrisanja = 'Da li ste sigurni da zelite da obrisete profil?';

    if (confirm(potvrdaBrisanja) === true) {
        let user = new User();
        user.delete();
        console.log('ode nalog');
    }
});

postFormEl.addEventListener('submit', w => {
    w.preventDefault();

    async function createPost() {
        let content = document.querySelector('#postContent').value;
        document.querySelector('#postContent').value = '';
        let post = new Post();
        post.post_content = content;
        post = await post.create();

        let trenutni_korisnik = new User();
        trenutni_korisnik = await trenutni_korisnik.get(session_id);

        let delete_post_html = '';
        if (session_id === post.user_id) {
            delete_post_html = '<button class="remove-btn" onclick="removeMyPost(this)">Remove</button>';
        }

        let html = document.querySelector('#allPostWrapper').innerHTML;
        document.querySelector('#allPostWrapper').innerHTML =
            `
            <div class="single-post" data-post_id="${post.id}">
                <div class="post-content">${post.content}</div>

                <div class="post-actions">
                    <p><b>Author:</b> ${trenutni_korisnik.username}</p>
                    <div>
                        <button onclick="likePost(this)" class="likePostJS like-btn like_comment"><span>${post.likes}</span> Likes</button>
                        <button class="comment-btn like_comment" onclick="commentPost(this)">Comments</button>
                        ${delete_post_html}
                    </div>
                </div>

                <div class="post-comments">
                    <form action="">
                        <input type="text" placeholder="Napisi komentar..." name="" id="">
                        <button onclick="commentPostSubmit(event)">Comment</button>
                    </form>
                </div>
            </div>
        ` + html;
    }

    createPost();
});


async function getAllPosts() {
    let all_posts = new Post();
    all_posts = await all_posts.getAllPosts();
    /**
     * ova ovde getAllPosts() nije naziv ove ovde 
     * asinhrone f-je, vec je iz Post.js
     */

    all_posts.forEach(post => {
        async function getPostUser() {
            let user = new User();
            user = await user.get(post.user_id);
            //get od User.js

            let komentari = new Comment();
            komentari = await komentari.get(post.id)
            //get od Comment.js

            //napraviti da se vidi ko je komentarisao

            let komentari_html = '';
            if (komentari.length > 0) {
                komentari.forEach(komentar => {

                    // let user = new User();

                    // let zika = user.user_id;



                    async function komentator() {
                        let user = new User();
                        user = await user.get(session_id);

                        let komentariSvi = document.querySelectorAll('.desno');
                        komentariSvi.forEach(element => {
                            // let pomocni = user['username'];
                            // let brojTogCoveka = user['user_id'];
                            element.innerText = user['username'];
                            // console.log(brojTogCoveka);
                        });


                        // document.querySelector('.desno').innerText = user['username'];

                        // covekKomentator = user['username'];
                        // console.log(covekKomentator);
                    }

                    komentator();











                    komentari_html +=
                        `
                        <div class="single-comment">
                            <div class="levo">${komentar.content}</div> by:
                            <div class="desno"></div>
                        </div>
                    `
                });
            }

            let delete_post_html = '';
            if (session_id === post.user_id) {
                delete_post_html = '<button class="remove-btn" onclick="removeMyPost(this)">Remove</button>';
            }

            let html = document.querySelector('#allPostWrapper').innerHTML;
            document.querySelector('#allPostWrapper').innerHTML =
                `
                <div class="single-post" data-post_id="${post.id}">
                    <div class="post-content">${post.content}</div>

                    <div class="post-actions">
                        <p><b>Author:</b> ${user.username}</p>
                        <div>
                            <button onclick="likePost(this)" class="likePostJS like-btn like_comment"><span>${post.likes}</span> Likes</button>
                            <button class="comment-btn like_comment" onclick="commentPost(this)">Comments</button>
                            ${delete_post_html}
                        </div>
                    </div>

                    <div class="post-comments">
                        <form action="">
                            <input type="text" placeholder="Napisi komentar..." name="" id="">
                            <button onclick="commentPostSubmit(event)">Comment</button>
                        </form>
                        ${komentari_html}
                    </div>
                </div>
            ` + html;
        }

        getPostUser();
    });
}

getAllPosts();

const commentPostSubmit = e => {
    e.preventDefault();

    let btn = e.target;
    btn.setAttribute('disabled', 'true');
    btn.style.cursor = 'not-allowed';

    let main_post_el = btn.closest('.single-post');
    let post_id = main_post_el.getAttribute('data-post_id');

    // let html = main_post_el.querySelector('.post-comments').innerHTML;

    let comment_value = main_post_el.querySelector('input').value;
    main_post_el.querySelector('input').value = '';

    main_post_el.querySelector('.post-comments').innerHTML +=
        `
        <div class="single-comment">${comment_value}</div>
    `;

    let komentar = new Comment();
    komentar.content = comment_value;
    komentar.user_id = session_id;
    komentar.post_id = post_id;
    komentar.create();
}

const removeMyPost = btn => {
    let post_id = btn.closest('.single-post').getAttribute('data-post_id');

    btn.closest('.single-post').remove();

    let post = new Post();
    post.delete(post_id);
}

const likePost = btn => {
    let post_id = btn.closest('.single-post').getAttribute('data-post_id');
    let number_of_likes = parseInt(btn.querySelector('span').innerText);

    btn.querySelector('span').innerText = number_of_likes + 1;
    btn.setAttribute('disabled', 'true');
    btn.style.cursor = 'not-allowed';

    let post = new Post();
    post.like(post_id, number_of_likes + 1);
}

const commentPost = btn => {
    let main_post_el = btn.closest('.single-post');
    // let post_id = main_post_el.getAttribute('data-post_id');

    main_post_el.querySelector('.post-comments').style.display = 'block';
}