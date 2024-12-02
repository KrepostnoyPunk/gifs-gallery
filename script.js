const linksEls = document.querySelectorAll('.gallery__link')
const previewEl = document.querySelector('.preview')
const searchBtnsEls = document.querySelectorAll('.field-btn')
const searchInputEl = document.querySelector('.field__input')
const searchForm = document.querySelector('.gallery__field')
const moreBtnEl = document.querySelector('.gallery__more-btn')
const preloaderEl = document.querySelector('.preloader')

window.addEventListener('load', e => {
    preloaderEl.style.display = 'none'
})

let ulEl; // будущий элемент списка в который будут добавляться элементы созданные на основе данных из объекта, объявлен глобально чтобы впоследствии очищать

let skipStep = 0; // счетчик шага пагинации, т.е. то, сколько при последующем запросе пропустить элементов с начала
const limitPerPage = 9; // лимит отображаемых на "страницу" гифок

moreBtnEl.style.display = 'none' // начальный дисплей кнопки "показать больше"

function createElements(dataObj){ // функция создающая элементы

    if(!document.querySelector('.preview-list')){
        ulEl = document.createElement('ul') // создаем элемент ul в который будут добавляться элементы созданные на основе данных из объекта
        ulEl.classList.add('preview-list') // добавляем класс для стилей

        previewEl.append(ulEl) // добавляем в контейнер созданный раннее ul
    }

    let arr = dataObj.data; // получаем массив объектов из объекта data

    arr.forEach(obj => {
        let liEl = document.createElement('li') // создаем элемент списка для организации элементов изображений
        liEl.classList.add('preview__item') // добавляем класс для стилей
        // получаем каждый из url каждого отдельного объекта и заполняем шаблон разметки
        liEl.innerHTML = `
            <a href="${obj.images.original.url}" class="preview__link" target="_blank">
                <img src="${obj.images.original.url}" alt="${obj.images.original.url}" class="preview__img"> 
            </a>
        `
        ulEl.append(liEl) // добавляем на каждой итерации li в ul
    });
}

function getData(endpoint, searchQuery, skipStep = 0){ // функция для отправки сетевых запросов

    preloaderEl.style.cssText = `
        display: inline-flex;
        background-color: rgba(24, 22, 25, .3);
    `

    let url; // задаем переменную для url-адреса...

    if(endpoint != 'search'){ // ...и в зависимости от условий структура запроса изменяется
        url = `http://api.giphy.com/v1/gifs/${endpoint}?api_key=11T5UhJN8ROnL1ZQbnHDUCdIDDqBwvJh&limit=${limitPerPage}&offset=${skipStep}`;
    } else {
        url = `http://api.giphy.com/v1/gifs/${endpoint}?q=${searchQuery}&api_key=11T5UhJN8ROnL1ZQbnHDUCdIDDqBwvJh&limit=${limitPerPage}&offset=${skipStep}`;
    }

    fetch((url)) // отправляем запрос к выбранному эндпоинту
        .then(response => { // получаем ответ от сервера
            if(!response.ok){ // если не получаем или получаем с ошибкой, то кидаем новую ошибку ответа сети
                throw new Error('Network response gone wrong...')
            }

            return response.json() // в случае получения успешного результата возвращаем преобразованный из JSON в JS объект
        })
        .then(dataObj => { // получаем JS объект с данными которые можно использовать
            if(dataObj && dataObj.data){ // если получаем объект и если в объекте есть нужное свойство, то
                console.log(dataObj);
                console.log('Data received');

                createElements(dataObj) // вызываем функцию создания элементов передавая аргументом объект с необходимыми данными

                moreBtnEl.style.display = 'block'  
                
                preloaderEl.style.display = 'none'
            } else {
                throw new Error('No received data from the source...') // если не получаем иили получаем с ошибкой, то кидаем ошибку о том что данные не получены
            }
        })
        .catch(error => {
            console.log('Network Error', error); // ловим и выводим ошибку
        })
}

function clearResult(){
    if(ulEl){
        ulEl.remove()
    }
}

linksEls.forEach(linkEl => {
    linkEl.addEventListener('click', e => { // по нажатию на элемент раздела...

        linksEls.forEach(removable => { // ...создаем цикл который удаляет у всех элементов группы класс active...
            removable.classList.remove('active')
        })

        e.target.classList.add('active') // ...и добавляет его только цели события

        if(document.querySelector('.preview-list')){ // если при переключении вкладки элемент присутствует на странице, то удалить его
            clearResult()
        }

        moreBtnEl.style.display = 'none'

        searchInputEl.value = ''

        if (linkEl.id === 'random' || linkEl.id === 'trending' && linkEl.classList.contains('active')) {
            searchForm.style.display = 'none'
            getData(linkEl.id)
        } else {
            searchForm.style.display = 'flex'
        }
    })
})

searchBtnsEls.forEach(fieldBtn => {
    fieldBtn.addEventListener('click', e => {
        e.preventDefault()

        if(searchInputEl.value){
            if(e.target.classList.contains('btn--search') || e.target.closest('.btn--search')){
                let searchValue = searchInputEl.value
                skipStep = 0
                getData('search', searchValue, skipStep)
                clearResult()
            } else {
                searchInputEl.value = ''
                moreBtnEl.style.display = 'none'
                clearResult()
            }
        }
    })
})

moreBtnEl.addEventListener('click', e => {
    if(e.target.classList.contains('btn--more') || e.target.closest('.btn--more')){

        skipStep += limitPerPage // при каждом нажатии увеличивать шаг пропуска для получения следующих значений

        let activeLink = document.querySelector('.gallery__link.active')

        if(activeLink){
            let endpoint = activeLink.id;
            let searchQuery = searchInputEl.value;

            getData(endpoint != 'search' ? endpoint : 'search', searchQuery, skipStep)
        }
    }
})

searchInputEl.addEventListener('keypress', e => {
    if(e.code === 'Enter' && e.target === document.activeElement && searchInputEl.value){
        getData('search', searchInputEl.value, skipStep)
    }
})