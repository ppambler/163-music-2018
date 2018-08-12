{
    let view = {
        el: '#siteLoading',
        show() {
            $(this.el).addClass('active')
        },
        hide() {
            // 只有一个，可没有兄弟啊！
            $(this.el).removeClass('active')
        },
    }
    let controller = {
        init(view) {
            this.view = view
            this.bindEventHub()
        },
        bindEventHub() {
            window.eventHub.on('beforeUpload',()=>{
                this.view.show()
            })
            window.eventHub.on('afterUpload',()=>{
                this.view.hide()
            })
        }
    }
    controller.init(view)

}