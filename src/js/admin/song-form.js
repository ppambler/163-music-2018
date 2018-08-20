{
    let view = {
        el: '.page > main',
        init() {
            this.$el = $(this.el)
        },
        template: `
            <form class="form">
                <div class="row">
                    <label>歌名
                    </label>
                    <input type="text" name="name" value='__name__'>
                </div>
                <div class="row">
                    <label>歌手
                    </label>
                    <input type="text" name="singer" value='__singer__'>
                </div>
                <div class="row">
                    <label>外链
                    </label>
                    <input type="text" name="url" value='__url__'> 
                </div>
                <div class="row">
                    <label>封面
                    </label>
                    <input type="text" name="cover" value='__cover__'> 
                </div>
                <div class="row actions">
                    <button type="submit">保存</button>
                </div>
            </form>
                `,
        // 这个形参：ES6语法，若没有传data或者data为undefined，就默认执行data为一个空对象
        render(data = {}) {
            // **？：**这里的id
            let placeholders = ['name', 'url', 'singer', 'id', 'cover']
            let html = this.template
            placeholders.map((string) => {
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
            if (data.id) {
                $(this.el).prepend("<h1>编辑歌曲</h1>")
            } else {
                $(this.el).prepend("<h1>新建歌曲</h1>")
            }
        },
        // **？：**这函数的作用？
        reset() {
            this.render({})
        }
    }
    let model = {
        data: {
            name: '',
            singer: '',
            url: '',
            id: '',
            cover: ''
        },
        update(data) {
            // debugger
            // 第一个参数是 className，第二个参数是 objectId
            var song = AV.Object.createWithoutData('Song', this.data.id);
            // 修改属性
            song.set('name', data.name);
            song.set('singer', data.singer);
            song.set('url', data.url);
            song.set('cover', data.cover);
            // 保存到云端
            return song.save().then((response)=>{
                Object.assign(this.data,data)
                return response
            })
        },
        create(data) {
            // 声明类型
            var Song = AV.Object.extend('Song');
            // 新建对象
            var song = new Song();
            // 设置名称
            song.set('name', data.name);
            song.set('singer', data.singer);
            song.set('url', data.url);
            song.set('cover', data.cover);
            // **？：**为啥要返回呢？
            return song.save().then((newSong) => {
                // **？：**我then回来的参数是啥？
                console.log(newSong)
                // **？：**这个解析赋值是怎样的呢？
                let {
                    id,
                    attributes
                } = newSong
                // **？：**这个assign的用法，和 「...」这个操作符？
                Object.assign(this.data, {
                    id,
                    ...attributes
                })
            }, (error) => {
                console.error(error);
            });
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
            window.eventHub.on('select', (data) => {
                this.model.data = data
                console.log(this.model.data)
                this.view.render(this.model.data)
            })
            window.eventHub.on('new', (data) => {
                // 数据库已存在该数据，所以在表单有数据且该数据是有id的，那么就
                // 清空
                if (this.model.data.id) {
                    // 清空表单数据
                    this.model.data = {
                        name: '',
                        url: '',
                        id: '',
                        singer: ''
                    }
                } else {
                    // 直接丢个空值，啥事也没干
                    Object.assign(this.model.data, data)
                }

                // 老实说，Vue就不用自己render,一旦数据有变化，自己搞事情
                this.view.render(this.model.data)
            })
        },
        create(){
            let needs = 'name singer url cover'.split(' ')
            let data = {}
            needs.map((string) => {
                // find()基于调用它的DOM对象找到其后代
                data[string] = this.view.$el.find(`[name="${string}"]`).val()
            })
            // **？：**这里是更新到数据库的吧！
            this.model.create(data).then(() => {
                // 更新往数据，然后就把form里的数据给刷了
                this.view.reset()
                // 深拷贝的做法——对data深拷贝
                let string = JSON.stringify(this.model.data)
                let object = JSON.parse(string)
                // 这个时候data才可以作为发布的data
                window.eventHub.emit('create', object)
            })
        },
        update(){
            let needs = 'name singer url cover'.split(' ')
            let data = {}
            needs.map((string) => {
                // find()基于调用它的DOM对象找到其后代
                data[string] = this.view.$el.find(`[name="${string}"]`).val()
            })
            // **？：**这里是更新到数据库的吧！
            this.model.update(data).then(() => {
                window.eventHub.emit('update', JSON.parse(JSON.stringify(this.model.data)))
            })
        },
        bindEvents() {
            this.view.$el.on('submit', 'form', (e) => {
                e.preventDefault()
                if(this.model.data.id) {
                    this.update()
                }else {
                    this.create()
                }
            })
        }
    }
    controller.init(view, model)
}