{
    let view = {
        el: '#tabs',
        init() {
            this.$el = $(this.el)
        }
    }
    let model = {}
    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            this.bindEvents()
        },
        bindEvents(){
            this.view.$el.on('click','.tabs-nav > li',(e)=>{
                // 知道用户点了哪个元素
                let $li = $(e.currentTarget)
                let tabName = $li.attr('data-tab-name')
                $li.addClass('active')
                    .siblings().removeClass('active')
                // 通知各模块说，我被点击了
                window.eventHub.emit('selectTab',tabName)
            })
        }
    }
    controller.init(view,model)
}