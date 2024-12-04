const preloaderEl = document.querySelector('.preloader')
const galleryEl = document.querySelector('.gallery__inner')
const linksEls = document.querySelectorAll('.gallery__link')
const searchForm = document.querySelector('.gallery__field')
const searchInputEl = document.querySelector('.field__input')
const searchBtnsEls = document.querySelectorAll('.field-btn')
const previewEl = document.querySelector('.preview')
const moreBtnEl = document.querySelector('.gallery__more-btn')
const errorEl = document.querySelector('.error')
const anchorEl = document.querySelector('.anchor')

function createGallery(dataObj){
    if(!document.querySelector('.preview-list')){ // если нету элемента галереи, то
        ulEl = document.createElement('ul') // создаем элемент ul в который будут добавляться элементы созданные на основе данных из объекта
        ulEl.classList.add('preview-list') // добавляем класс для стилей

        previewEl.append(ulEl) // добавляем в контейнер созданный раннее ul
    }

    let arr = dataObj.data; // получаем массив объектов из объекта dataObj

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

            ulEl.scrollIntoView({ // при создании элемента будет автодоскролл до определенной точки
                behavior: "smooth",
                block: "end",
            })

            anchorEl.style.display = 'flex' // после создания элемента изменить видимость якоря-лифта
        });
}

function createRandom(dataObj){
    if(!document.querySelector('.random')){
        linkEl = document.createElement('a') // создаем элемент a в который будет добавляться элемент на основе данных из объекта
        linkEl.classList.add('random') // добавляем класс для стилей
        linkEl.target = "_blank"

        galleryEl.insertBefore(linkEl, moreBtnEl) // вставить элемент перед кнопкой More
    }
    
    let imgEl = document.createElement('img') // создаем сам элемент изображения
    imgEl.classList.add('random__img') 
    imgEl.src = `${dataObj.data.images.original.url}` // устанавливаем источник изображения
    linkEl.href = `${dataObj.data.images.original.url}`

    linkEl.append(imgEl) // добавить в ссылку элемент изображения
}

function getData(endpoint, searchQuery, skipStep = 0){ // функция для отправки сетевых запросов

    // в начале функции "запускается" прелоадер
    preloaderEl.style.cssText = `
        display: inline-flex;
        background-color: rgba(24, 22, 25, .3);
    `

    let url; // задаем переменную для url-адреса...

    if(endpoint === 'trending'){ // ...и в зависимости от условий структура запроса изменяется
        url = `http://api.giphy.com/v1/gifs/${endpoint}?api_key=11T5UhJN8ROnL1ZQbnHDUCdIDDqBwvJh&limit=${limitPerPage}&offset=${skipStep}`;
    } else if (endpoint === 'search') {
        url = `http://api.giphy.com/v1/gifs/${endpoint}?q=${searchQuery}&api_key=11T5UhJN8ROnL1ZQbnHDUCdIDDqBwvJh&limit=${limitPerPage}&offset=${skipStep}`;
    } else {
        url = `http://api.giphy.com/v1/gifs/${endpoint}?api_key=11T5UhJN8ROnL1ZQbnHDUCdIDDqBwvJh`;
    }

    fetch((url)) // отправляем запрос к выбранному эндпоинту
        .then(response => { // получаем ответ от сервера
            if(!response.ok){ // если не получаем или получаем с ошибкой, то кидаем новую ошибку ответа сети
                throw new Error('Network response gone wrong...')
            }

            return response.json() // в случае получения успешного результата возвращаем преобразованный из JSON в JS объект
        })
        .then(dataObj => { // получаем JS объект с данными которые можно использовать
            if(dataObj && dataObj.data && Array.isArray(dataObj.data)){ // если получаем объект и если в объекте есть нужное свойство и если значение этого свойства - массив, то

                createGallery(dataObj) // вызываем функцию создания галереи передавая аргументом объект с необходимыми данными

                moreBtnEl.style.display = 'block' // после выполнения функции создания элементов делаем видимой кнопку More
                
                 // и убираем прелоадер 

                if(dataObj.data.length === 0){ // если длина полученного массива объектов === 0, т.е. нет результата по такому запросу, то...
                    moreBtnEl.style.display = 'none'
                    errorEl.style.display = 'block' // делаем видимой иллюстрацию об ошибке 404
                }
            }  else if(typeof dataObj.data === 'object'){ // если свойство по ключу - объект, то это значит что мы получили random, потому что в этом случае возвращается единичная гифка в виде объекта, а не массив объектов

                // поворачиваем кнопку на 90 градусов чтобы не добавлять новые элементы
                moreBtnEl.style.cssText = `
                    display: block;
                    rotate: -90deg;
                ` 

                createRandom(dataObj) // вызываем функцию создания слайдера для random передавая аргументом объект с необходимыми данными
            } else {
                throw new Error('No received data from the source...') // если получаем пустой объект, то кидаем ошибку о том что данные отсутствуют
            }

            preloaderEl.style.display = 'none'
        })
        .catch(error => {
            console.log('Network Error', error); // ловим и выводим ошибку
        })
}

function clearResult(){
    // если есть какой либо из элементов то при вызове функции - удаляем его

    if(ulEl){
        ulEl.remove()
    }

    if(linkEl){
        linkEl.remove() 
    }
}

let ulEl; // будущий элемент списка в который будут добавляться элементы созданные на основе данных из объекта, объявлен глобально чтобы впоследствии очищать

let linkEl; // будущий элемент ссылки в который будет добавляться элемент созданный на основе данных из объекта, объявлен глобально чтобы впоследствии очищать

let skipStep = 0; // счетчик шага пагинации, т.е. то, сколько при последующем запросе пропустить элементов с начала
const limitPerPage = 9; // лимит отображаемых на "страницу" гифок

moreBtnEl.style.display = 'none' // начальный дисплей кнопки "показать больше"

errorEl.style.display = 'none' // начальный дисплей иллюстрации ошибки

window.addEventListener('load', e => { // по загрузке страницы уберет прелоадер
    preloaderEl.style.display = 'none'
})

linksEls.forEach(linkEl => {
    linkEl.addEventListener('click', e => { // при переключении раздела...

        linksEls.forEach(removable => { // ...создаем цикл который удаляет у всех элементов группы класс active...
            removable.classList.remove('active')
        })

        e.target.classList.add('active') // ...и добавляет его только цели события

        if(document.querySelector('.preview-list') || document.querySelector('.random')){ // если при переключении вкладки элемент присутствует на странице, то вызвать функцию очистки
            clearResult()
        }

        moreBtnEl.style.display = 'none'

        searchInputEl.value = ''

        moreBtnEl.style.rotate = "-360deg"

        anchorEl.style.display = 'none'

        if (linkEl.id === 'random' || linkEl.id === 'trending' && linkEl.classList.contains('active')) {
            searchForm.style.display = 'none'
            getData(linkEl.id)
        } else {
            searchForm.style.display = 'flex'
        }
    })
})

searchBtnsEls.forEach(fieldBtn => { // при нажатии на кнопки поля ввода...
    fieldBtn.addEventListener('click', e => {
        e.preventDefault()

        if(searchInputEl.value){
            if(e.target.classList.contains('btn--search') || e.target.closest('.btn--search')){
                skipStep = 0 // обнуляем счетчик шагов пагинации чтобы при новом поисковом запросе результаты показывались с начала, а не с предыдщуей сохраненной "страницы"
                getData('search', searchInputEl.value, skipStep)
                clearResult()
            } else {
                searchInputEl.value = ''
                moreBtnEl.style.display = 'none'
                errorEl.style.display = 'none'
                anchorEl.style.display = 'none'
                clearResult()
            }
        }
    })
})

moreBtnEl.addEventListener('click', e => {
    if(e.target.classList.contains('btn--more') || e.target.closest('.btn--more')){

        skipStep += limitPerPage // при каждом нажатии увеличивать шаг пропуска для получения следующих значений

        let activeLink = document.querySelector('.gallery__link.active')
        let endpoint = activeLink.id;
        let searchQuery = searchInputEl.value;

        if(endpoint === 'search' || endpoint === 'trending'){
            getData(endpoint != 'search' ? endpoint : 'search', searchQuery, skipStep)
        } else {
            clearResult()
            moreBtnEl.style.display = 'none'
            getData(endpoint, searchQuery, skipStep)
        }
    }
})

document.addEventListener('keydown', e => {
    if(e.code === 'Enter' && e.target === searchInputEl && searchInputEl.value){
        e.preventDefault()

        skipStep += limitPerPage 

        getData('search', searchInputEl.value, skipStep)
    }
})