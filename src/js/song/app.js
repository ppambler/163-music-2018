{
    let view = {
        el: '#app',
        init() {
            this.$el = $(this.el)
        },
        render(data) {
            let {
                song,
                status
            } = data
            console.log(song)
            console.log(status)
            console.log(data)
            this.$el.css('background-image', `url(${song.cover})`)
            this.$el.find('img.cover').attr('src', song.cover)
            // 暂停后再播放，歌曲还是连续的！
            if (this.$el.find('audio').attr('src') !== song.url) {
                let audio = this.$el.find('audio').attr('src', song.url).get(0)
                audio.onended = () => {
                    window.eventHub.emit('songEnd')
                }
                audio.ontimeupdate = () => {
                    this.showLyric(audio.currentTime)
                }
            }
            if (status === 'playing') {
                this.$el.find('.disc-container').addClass('playing')
            } else {
                this.$el.find('.disc-container').removeClass('playing')
            }
            this.$el.find('.song-description > h1').text(song.name)
            let {lyrics} = song
            console.log(lyrics)
            if(lyrics !== '纯音乐，请您欣赏') {
                lyrics.split('\n').map((string) => {
                    console.log('666')
                    let p = document.createElement('p')
                    console.log(p)
                    let regex = /\[([\d:.]+)\](.+)/
                    console.log(regex)
                    console.log(string)
                    let matches = string.match(regex)
                    console.log(matches)
                    if(matches) {
                        p.textContent = matches[2]
                        let time = matches[1]
                        let parts = time.split(':')
                        let minutes = parts[0]
                        let seconds = parts[1]
                        let newTime = parseInt(minutes,10) * 60 + parseFloat(seconds,10)
                        p.setAttribute('data-time', newTime)
                    } else {
                        p.textContent = string
                    }
                    this.$el.find('.lyric > .lines').append(p)
                })
            } else {
                let p = document.createElement('p')
                p.textContent = lyrics
                this.$el.find('.lyric > .lines').append(p)
                console.log(p)
            }
            
        },
        showLyric(time) {
            let allP = this.$el.find('.lyric > .lines > p')
            console.log(allP)
            let p
            if(allP[0].innerText !== '纯音乐，请您欣赏') {
                for(let i = 0; i < allP.length; i++){
                    if(i===allP.length-1) {
                        p = allP[i]
                        break
                    } else {
                        let currentTime = allP.eq(i).attr('data-time')
                        let nextTime = allP.eq(i+1).attr('data-time')
                        if(currentTime <= time && time < nextTime) {
                            p = allP[i]
                            break
                        }
                    }
                }
                console.log(p)
                let pHeight = p.getBoundingClientRect().top
                let linesHeight = this.$el.find('.lyric>.lines')[0].getBoundingClientRect().top
                let height = pHeight - linesHeight
                this.$el.find('.lyric > .lines').css({
                    transform: `translateY(${- (height - 25)}px)`
                })
                $(p).addClass('active').siblings('.active').removeClass('active')
            } else {
                console.log('555')
                console.log(allP[0])
                $(allP[0]).addClass('active').css({
                    lineHeight: '72px'
                })
            }
            
        },
        play() {
            console.log(this.$el.find('audio')[0])
            this.$el.find('audio')[0].play()
        },
        pause() {
            this.$el.find('audio')[0].pause()
        }
    }
    let model = {
        data: {
            song: {
                id: '',
                name: '',
                singer: '',
                url: ''
            },
            status: 'paused'
        },
        get(id) {
            var query = new AV.Query('Song');
            return query.get(id).then((song) => {
                Object.assign(
                    this.data.song,
                    Object.assign({id: song.id},song.attributes)
                )
                // 作为下个then的回调函数的参数
                return song
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            let id = this.getSongId()
            this.model.get(id).then((song) => {
                console.log(this.model.data)
                this.view.render(this.model.data)
            })
            this.bindEvents()
        },
        bindEvents() {
            $(this.view.el).on('click', '.icon-play', (e) => {
                this.model.data.status = 'playing'
                this.view.render(this.model.data)
                this.view.play()
            })
            $(this.view.el).on('click', '.icon-pause', (e) => {
                this.model.data.status = 'paused'
                this.view.render(this.model.data)
                this.view.pause()
            })
            window.eventHub.on('songEnd',()=>{
                this.model.data.status = 'paused'
                this.view.render(this.model.data)
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