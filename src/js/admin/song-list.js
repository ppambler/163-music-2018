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
            console.log('song-list-view-render-data:')
            console.log(data.songs)
            let selectedSongId = data.selectedSongId
            let songs = data.songs
            console.log(songs)
            let liList = songs.map((song) =>{
                    let $li = $('<li></li>').text(song.name).attr('data-song-id',song.id)
                    if(song.id === selectedSongId) {
                        $li.addClass('active')
                    }
                    return $li
                }
            )
            console.log(liList)
            // **？：**这为何意？清空？为何要这样做
            $el.find('ul').empty()

            liList.map((domLi) => {
                // 难道之前的是创建个游离的li
                
                $el.find('ul').append(domLi)
            })
        },
        clearActive() {
            $(this.el).find('.active').removeClass('active')
        }
    }
    let model = {
        data: {
            // **？：**这个也叫songs的名字，和那个{songs}的联系？
            songs: [],
            selectedSongId: undefined
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
                console.log(songs)
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
            this.bindEvents()
            this.bindEventHub()
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
                console.log(e.currentTarget)
                console.log(e)
                let songId = e.currentTarget.getAttribute('data-song-id')
                
                this.model.data.selectedSongId = songId
                this.view.render(this.model.data)
                // 一个临时变量,用于装载当前选中的这首歌的所有信息
                let data
                // 拿到当前model所有的数据，用来和选中的id搞事情
                let songs = this.model.data.songs
                for(let i = 0; i < songs.length; i++) {
                    if(songs[i].id === songId) {
                        data = songs[i]
                        break
                    }
                }
                //在这里数据都是用hash解决啊
                //做了深拷贝——序列化与反序列化的使用，对面的女孩，我们的数据保证是纯天然的
                console.log(data)
                window.eventHub.emit('select',JSON.parse(JSON.stringify(data)))
            })
        },
        bindEventHub() {
            window.eventHub.on('create', (songData) => {
                // **？：**我拿到的数据是什么？其数据结构呢？
                // console.log(`song-list-create:${songData}`)
                console.log(songData)
                this.model.data.songs.push(songData)
                // **？：**现用现拿？
                this.view.render(this.model.data)
            })
            window.eventHub.on('new',()=>{
                this.view.clearActive()
            })
            window.eventHub.on('update',(song)=> {
                // 注意数据是更新了，可是id是唯一的
                // 如果id一致则更新一首歌曲的信息
                let songs = this.model.data.songs
                for (let i = 0; i < songs.length; i++) {
                    if(songs[i].id === song.id) {
                        Object.assign(songs[i],song)
                    }
                }
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view, model)
}