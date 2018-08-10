{
    let view = {
        el: '.newSong',
        template: `
            新建歌曲
        `,
        render(data) {
            $(this.el).html(this.template)
        } 
    }
    let model = {}
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.active()
            // 有种按钮点击后就执行这个回到函数的个感觉，只不过
            // 在这里咩有用到this
            // 当你想忽视细节原理的时候，请把这里当做是click吧！
            // 即使data此时没有用到，也要添加形参
            window.eventHub.on('upload',(data)=>{
                // this的值会往上找，所以这是controller
                this.active()
            })
            window.eventHub.on('select',(data)=>{
                this.deactive()
            })
            $(this.view.el).on('click',this.active.bind(this))
        },
        active() {
            $(this.view.el).addClass('active')
            window.eventHub.emit('new')
        },
        deactive() {
            $(this.view.el).removeClass('active')
        }
    }
    controller.init(view,model)    

}