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
                $('<li></li>').text(song.name)
            )
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
            songs: []
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
            window.eventHub.on('upload', () => {
                this.view.clearActive()
            })
            window.eventHub.on('create', (songData) => {
                // **？：**我拿到的数据是什么？其数据结构呢？
                // console.log(`song-list-create:${songData}`)
                this.model.data.songs.push(songData)
                // **？：**现用现拿？
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view, model)
}