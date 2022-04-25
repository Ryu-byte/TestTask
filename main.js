let postsList = document.querySelector('#postsList');
let pagination = document.querySelector('#pagination');
let addButton = document.querySelector('#addButton')
let createPost = document.querySelector('#createPost');
let cancelButton = document.querySelector('#cancelButton');
let addForm = document.querySelector('.addForm');

async function getData() {
    const response = await fetch('http://localhost:3000/posts');
    const data = response.json();
    const posts = await data;

    let postsOnPage = 10;
    let pages = Math.ceil(posts.length / 10);
    let paginationItems = [];

    for (let i = 1; i <= pages; i++) {
        let li = document.createElement('li');
        li.innerHTML = i;
        pagination.appendChild(li);
        paginationItems.push(li);
    }
    showPage(paginationItems[0]);

    for (let paginationItem of paginationItems) {
        paginationItem.addEventListener('click', function () {
            showPage(this);
        })
    }

    function showPage(page) {
        let active = document.querySelector('#pagination li.active');
        if (active) {
            active.classList.remove('active');
        }
        page.classList.add('active');

        let pageNum = +page.innerHTML;
        let start = (pageNum - 1) * postsOnPage;
        let end = start + postsOnPage;
        let list = posts.slice(start, end);

        postsList.innerHTML = '';

        for (let post of list) {
            postsList.innerHTML += `
        <div class="post">
            <li id=${post.id}>
                <div class="post_title">
                    ${post.title}
                </div>
                <div class="post_body">
                    ${post.body}                                    
                </div>
                <button id="deleteButton" onclick=deletePost(parentElement)>&#10008;</button>
            </li>
        </div>
        `
        }
    }

}

function showAddForm() {
    addForm.classList.add('open');
    addButton.classList.add('hide');
}

function closeAddForm() {
    addForm.classList.remove('open');
    addButton.classList.remove('hide');
}

createPost.onsubmit = async (e) => {
    e.preventDefault();

    let form = new FormData(document.querySelector('#createPost'));
    await fetch('http://localhost:3000/posts/', {
        method: 'POST',
        body: JSON.stringify({
            title: form.get('title'),
            body: form.get('body'),
            userId: 1,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })

    addForm.classList.remove('open');
    addButton.classList.remove('hide');
    location.reload();
}

function deletePost(element) {
    fetch(`http://localhost:3000/posts/${element.id}`, {
        method: 'DELETE',
    });
    element.remove();
    location.reload();
}

getData();
addButton.addEventListener('click', showAddForm);
cancelButton.addEventListener('click', closeAddForm);

window.onload = () => {
    let input = document.querySelector('#input');
    input.oninput = function () {
        let value = this.value.trim();
        let list = document.querySelectorAll('#postsList li, #postBody');
        list.forEach(elem => {
            elem.classList.remove('hide');
        })
        if (value) {
            list.forEach(elem => {
                if (elem.innerText.toLowerCase().search(value) == -1) {
                    elem.classList.add('hide');
                }
            })
        }
    }
}






