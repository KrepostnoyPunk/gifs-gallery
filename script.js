const moreBtnEl = document.querySelector('.gallery__more-btn')

const inputEl = document.querySelector('.field__input')

const linksEls = document.querySelectorAll('.gallery__link')

const previewListEl = document.querySelector('.preview-list')

const controlsBtnsEls = document.querySelectorAll('.field-btn')



function createElements(dataObj){

    let arr = dataObj.data; // получаем массив объектов из объекта data

    arr.forEach(obj => {
        let liEl = document.createElement('li')
        liEl.classList.add('preview__item')
        // поулчаем каждый из url отдельного объекта который будет разным на каждой итерации
        liEl.innerHTML = `
            <a href="${obj.url}" class="preview__link">
                <img src="${obj.url}" alt="${obj.url}" height="282" class="preview__img"> 
            </a>
        `
        previewListEl.append(liEl)

        console.log(obj.url);
        
    });
}

async function getData(){
    fetch(("http://api.giphy.com/v1/gifs/trending?api_key=11T5UhJN8ROnL1ZQbnHDUCdIDDqBwvJh&limit=9"))
        .then(response => {
            console.log(response);
            
            return response.json()
        })
        .catch(error => {
            console.log(error);
        })
        .then(data => {
            console.log(data);

            return data
        })
        .catch(error => {
            console.log(error);
        })
}

let responseData = getData()

console.log(responseData);
