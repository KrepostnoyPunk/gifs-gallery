*Превью :*
![previewImage](https://github.com/KrepostnoyPunk/gifs-gallery/blob/main/preview.png?raw=true)

*Интро :*
- Данный проект представляет собой галерею GIF изображений использующую GIPHY API для получения данных.

*Технологии* :
- HTML
- SCSS
- JS

*Функционал :*
- получение GIF изображений через GIPHY API
- динамическое создание галереи GIF изображений
- динамическое создание слайдера Random
- поиск определенных GIF изображений в соответствии с поисковым запросом в табе Search
- таб Trending с популярными гифками
- пагинация
- кнопка якорь для возврата наверх
- функционал очистки

*Проблемы с которыми столкнулся :*
- форма отправлялась и стирала данные поискового запроса что не позволяло использовать *More*. Решил отменой поведения по умолчанию.
- последующие запросы возвращали *те же самые результаты*, потому что не добавлялся и не увеличивался шаг пропуска. Решил увеличением шага пропуска на лимит гифок на страницу при каждом запросе.
- при *Random* выводилась *ошибка* из-за того что возвращалась одиночная гифка в виде объекта, а не массив который обрабатывался *forEach*. Решил добавлением дополнительной проверки на тип данных значения свойства data.
- элемент изображения в *Random* добавлялся к концу элемента ссылки что создавало длинный горизонтальный список вместо замены уже существующего изображения. Решил очисткой предыдущего результата перед запросом и отрисовкой нового.
- из-за того что элементы ссылки и списка изначально были объявлены *локально* для функции, их *не получалось очищать* в зависимости от условий. Решил объявлением самих переменных глобально и их последующим заполнением в функциях.
- *класс active у табов не удалялся при их переключении*. Решил добавлением цикла удаления всех классов у элементов группы и добавлением класса только к цели события.
- последующие запросы *возвращали результаты начиная от предыдущего сохраненного значения шага пропуска* (т.е. не с начала, а, условно, с 18). Решил очисткой шага пропуска перед последующим новым поисковым запросом.

*Улучшил :*
- понимание возможностей JS в области `манипулирования содержимым DOM` (добавление, удаление элементов...)
- понимание логики применения аттрибутов как гибких ключей доступа
- понимание логики создания и работы пагинации
- понимание логики работы и использования `объектов`
- понимание логики работы и использования `fetch()`
- понимание логики работы и использования `API`
- понимание логики работы и использования `JSON`
- понимание логики работы и использования `Promises`
- понимание логики совместного использования HTML, SCSS, JS, API
- понимание логики и удобства применения цикла `forEach` для обработки множества элементов без ненужного дублирования
- понимание логики взаимодействия и манипуляции элементами через классы
- понимание возможностей JS в области DOM элементов, манипулирования ими и их значениями
- понимание обработки событий
- понимание верстки и позиционирования элементов
- понимание удобства применения функций как способа логично и чисто распределить код
- понимание логики составления и использования функций
- понимание логики применения условий
- понимание обработки ошибок

Проект завершен.