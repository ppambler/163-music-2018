{
    let view = {
        el: '#songList-container',
        template: `
            <ul class="songList">
                <li>歌曲111</li>
                <li>歌曲2</li>
                <li>歌曲3333</li>
                <li>歌曲4</li>
                <li>歌曲5</li>
                <li class="active">歌曲666666</li>
                <li>歌曲7</li>
                <li>歌曲8888</li>
                <li>歌曲99</li>
                <li>歌曲10</li>
            </ul>
        `,
        render(data) {
            $(this.el).html(this.template)
        }
    }
    let model = {}
    // 当我写到第3遍的时候发现，我只是把引用给你了
    // 表面上看是Controller在render,其实是自身的view在render
    // 说白了就是请了枪手view……
    let controller = {
        init(view,model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
        }
    }
    controller.init(view,model)
}