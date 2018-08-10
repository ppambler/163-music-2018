{
    let view = {
        el: '#songList-container',
        // 歌单列表需要动态生成了，然而没有v-for
        template: `
            <ul class="songList">
            </ul>
        `,
        render(data) {
            let $el = $(this.el)
            $el.html(this.template)
            // **？：**我拿到的data是什么？
            console.log(`song-list-view-render:${data}`)
            let {
                songs
            } = data
            console.log(songs)
            let liList = songs.map((song) =>
                // **？：**可以这样用选择器吗？哪里来的li啊！
                $('<li></li>').text(song.name).attr('data-song-id',song.id)
            )
            // **？：**这为何意？清空？为何要这样做
            $el.find('ul').empty()
            liList.map((domLi) => {
                // 难道之前的是创建个游离的li
                $el.find('ul').append(domLi)
            })
        },
        activeItem(li) {
            let $li = $(li)
            $li.addClass('active')
                .siblings('.active').removeClass('active')
        },
        clearActive() {
            $(this.el).find('.active').removeClass('active')
        }
    }
    let model = {
        data: {
            // **？：**这个也叫songs的名字，和那个{songs}的联系？
            songs: []
        },
        find() {
            var query = new AV.Query('Song');
            console.log(query)
            return query.find().then((songs) => {
                this.data.songs = songs.map((song) => {
                    // 这个id可是很重要的，当然在这里的find是批量获取,而不是get！id是用于获取单个对象实例了
                    // 「...」你要的全拿走
                    return {id: song.id, ...song.attributes}
                })

                // 拿到什么就返回什么，Promise的特点
                return songs
            })
        }
    }
    // 当我写到第3遍的时候发现，我只是把引用给你了
    // 表面上看是Controller在render,其实是自身的view在render
    // 说白了就是请了枪手view……
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.bindEventHub()
            this.bindEvents()
            this.getAllSongs()
        },
        getAllSongs() {
            return  this.model.find().then(() =>{
                this.view.render(this.model.data)
            })
        },
        bindEvents() {
            //**？：**关于这个事件委托，我会认为是冒泡后执行的，当然事件处理函数
            // 是作用到li元素身上的
            $(this.view.el).on('click','li',(e)=>{
                // 能不要用this就不要用了！
                this.view.activeItem(e.currentTarget)
                console.log(e.currentTarget)
                console.log(e)
                let songId = e.currentTarget.getAttribute('data-song-id')
                //在这里数据都是用hash解决啊
                window.eventHub.emit('select',{id:songId})
            })
        },
        bindEventHub() {
            window.eventHub.on('upload', () => {
                this.view.clearActive()
            })
            window.eventHub.on('create', (songData) => {
                // **？：**我拿到的数据是什么？其数据结构呢？
                // console.log(`song-list-create:${songData}`)
                console.log(songData)
                this.model.data.songs.push(songData)
                // **？：**现用现拿？
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view, model)
}