{
    let view = {
        el: '#app',
        // 由于我的歌曲地址有空格所有得要加个「」
        template:`
        <audio src='{{url}}'></audio>
        <div>
            <button id='play'>播放</button>
            <button id='pause'>暂停</button>
        </div>
        `,
        render(data) {
            $(this.el).html(this.template.replace('{{url}}',data.url))
        },
        play() {
            let audio = $(this.el).find('audio')[0]
            // 没想到这个audio元素有play方法
            audio.play()
        },
        pause() {
            let audio = $(this.el).find('audio')[0]
            audio.pause()
        }
    }
    let model = {
        data: {
            id: '', 
            name: '',
            singer: '',
            url: ''
        },
        get(id) {
            var query = new AV.Query('Song');
            return query.get(id).then((song)=> {
                Object.assign(this.data,{id:song.id,...song.attributes})
                // 作为下个then的回调函数的参数
                return song
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            let id = this.getSongId()
            this.model.get(id).then((song)=>{
                this.view.render(this.model.data)
            })
            this.bindEvents()
        },
        bindEvents(){
            $(this.view.el).on('click','#play',(e)=>{
                this.view.play()
            })
            $(this.view.el).on('click','#pause',(e)=>{
                this.view.pause()
            })
        },
        getSongId() {
            // 拿到当前页面的地址，?id=5b6fbefefe88c2005b68f34e
            let search = window.location.search
            // 去掉?号
            if (search.indexOf('?') === 0) {
                search = search.substring(1)
            }
            // 过滤空字符串的元素，如查询参数还有id=5b6fbefefe88c2005b68f34e&&a=5
            // 拿到元素为truly的值
            let array = search.split('&').filter(v => v)
            let id = ''

            // 很多地方都是通过等于号（=）来分割的
            for (let i = 0; i < array.length; i++) {
                const kv = array[i].split('=')
                let key = kv[0]
                let value = kv[1]
                if (key === 'id') {
                    id = value
                    break
                }
            }
            return id
        }
    }
    controller.init(view, model)
}