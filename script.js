const linksEls = document.querySelectorAll('.gallery__link')
const previewEl = document.querySelector('.preview')
const searchBtnsEls = document.querySelectorAll('.field-btn')
const searchInputEl = document.querySelector('.field__input')
const moreBtnEl = document.querySelector('.gallery__more-btn')
const searchForm = document.querySelector('.gallery__field')

moreBtnEl.style.display = 'none'

let ulEl = document.createElement('ul')
ulEl.classList.add('preview-list')

function createElements(dataObj){

    previewEl.append(ulEl)

    let arr = dataObj.data; // получаем массив объектов из объекта data

    arr.forEach(obj => {
        let liEl = document.createElement('li')
        liEl.classList.add('preview__item')
        // поулчаем каждый из url отдельного объекта который будет разным на каждой итерации
        liEl.innerHTML = `
            <a href="${obj.images.original.url}" class="preview__link" target="_blank">
                <img src="${obj.images.original.url}" alt="${obj.images.original.url}" class="preview__img"> 
            </a>
        `
        ulEl.append(liEl)

        console.log(obj.images.original.url);
    });
}


function getData(endpoint, searchQuery){

    if(endpoint != 'search'){

        fetch((`http://api.giphy.com/v1/gifs/${endpoint}?api_key=11T5UhJN8ROnL1ZQbnHDUCdIDDqBwvJh&limit=9`)) // отправляем запрос к выбранному эндпоинту
        .then(response => { // получаем ответ от сервера
            if(!response.ok){ // если не получаем или получаем с ошибкой, то кидаем новую ошибку ответа сети
                throw new Error('Network response gone wrong...')
            }

            return response.json() // в случае получения успешного результата возвращаем преобразованный из JSON в JS объект
        })
        .then(dataObj => { // получаем JS объект с данными которые можно использовать
            if(dataObj && dataObj.data){ // если получаем объект и если в объекте есть нужное свойство, то
                console.log(dataObj);

                createElements(dataObj) // вызываем функцию создания элементов передавая аргументом объект с необходимыми данными
            } else {
                throw new Error('No received data from the source...') // если не получаем иили получаем с ошибкой, то кидаем ошибку о том что данные не получены
            }
        })
        .catch(error => {
            console.log('Network Error', error); // ловим и выводим ошибку
        })

    } else {

        fetch((`http://api.giphy.com/v1/gifs/${endpoint}?q=${searchQuery}&api_key=11T5UhJN8ROnL1ZQbnHDUCdIDDqBwvJh&limit=9`)) // отправляем запрос полученный из поля ввода к выбранному эндпоинту
        .then(response => { // получаем ответ от сервера
            if(!response.ok){ // если не получаем или получаем с ошибкой, то кидаем новую ошибку ответа сети
                throw new Error('Network response gone wrong...')
            }

            return response.json() // в случае получения успешного результата возвращаем преобразованный из JSON в JS объект
        })
        .then(dataObj => { // получаем JS объект с данными которые можно использовать
            if(dataObj && dataObj.data){ // если получаем объект и если в объекте есть нужное свойство, то
                console.log(dataObj);

                createElements(dataObj) // вызываем функцию создания элементов передавая аргументом объект с необходимыми данными
            } else {
                throw new Error('No received data from the source...') // если не получаем иили получаем с ошибкой, то кидаем ошибку о том что данные не получены
            }
        })
        .catch(error => {
            console.log('Network Error', error); // ловим и выводим ошибку
        })

    }
}


function clearResult(){
    ulEl.remove()
}


linksEls.forEach(linkEl => {
    linkEl.addEventListener('click', e => { // по нажатию на элемент раздела...

        linksEls.forEach(removable => { // ...создаем цикл который удаляет у всех элементов группы класс active...
            removable.classList.remove('active')
        })

        e.target.classList.add('active') // ...и добавляет его только нажатому 

        if(linkEl.id != 'search'){
            searchForm.style.display = 'none'
            getData(linkEl.id)
        } else{
            searchForm.style.display = 'flex'
        }
    })
})


searchBtnsEls.forEach(fieldBtn => {
    fieldBtn.addEventListener('click', e => {
        e.preventDefault()

        if(e.target.classList.contains('btn--search') || e.target.closest('.btn--search')){
            let searchValue = searchInputEl.value
            getData('search', searchValue)
            moreBtnEl.style.display = 'block'
        } else {
            searchInputEl.value = ''
            clearResult()
        }
    })
})