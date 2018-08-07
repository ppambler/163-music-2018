{
    let view = {
        el: '.page > main',
        init() {
            this.$el = $(this.el)
        },
        template: `
            <h1>新建歌曲</h1>
            <form class="form">
                <div class="row">
                    <label>歌名
                    </label>
                    <input type="text" name="name" value='__key__'>
                </div>
                <div class="row">
                    <label>歌手
                    </label>
                    <input type="text" name="singer">
                </div>
                <div class="row">
                    <label>外链
                    </label>
                    <input type="text" name="url" value='__link__'> 
                </div>
                <div class="row actions">
                    <button type="submit">保存</button>
                </div>
            </form>
                `,
        // 这个形参：ES6语法，若没有传data或者data为undefined，就默认执行data为一个空对象
        render(data = {}) {
            let placeholders = ['key', 'link']
            let html = this.template
            placeholders.map((string)=>{
                html = html.replace(`__${string}__`,data[string] || '')
            })
            $(this.el).html(html)
        }
    }
    let model = {}
    let controller = {
        init(view,model) {
            this.view = view
            this.view.init()
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
            window.eventHub.on('upload',(data)=>{
                this.view.render(data)
            })
        },
        bindEvents() {
            this.view.$el.on('submit','form',(e)=>{
                e.preventDefault()
                let needs = 'name singer url'.split(' ')
                let data = {}
                needs.map((string)=>{
                    // find()基于调用它的DOM对象找到其后代
                    data[string] = this.view.$el.find(`[name="${string}"]`).val()
                })
                console.log(data)
            })
        }
    }
    controller.init(view,model)
}