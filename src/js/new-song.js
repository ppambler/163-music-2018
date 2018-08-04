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
            // 有种按钮点击后就执行这个回到函数的个感觉，只不过
            // 在这里咩有用到this
            // 当你想忽视细节原理的时候，请把这里当做是click吧！
            window.eventHub.on('upload',(data)=>{
                console.log('new-song模块得到了data')
                console.log(data)
            })
        }
    }
    controller.init(view,model)    

}