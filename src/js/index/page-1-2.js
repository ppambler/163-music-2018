{
    let view = {
        el: 'section.songs',
        // **？：**这里的xmlns加不加都是一样的效果啊！
        template:`
        <li>
        <h3>{{song.name}}</h3>
        <p>
          <svg class="icon icon-sq">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-sq"></use>
          </svg>
          {{song.singer}}
        </p>
        <a class="playButton" href="./song.html?id={{song.id}}">
          <svg class="icon icon-play">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-play"></use>
          </svg> 
        </a>
      </li>
        `,
        init() {
          this.$el = $(this.el)
        },
        render(data) {
          let {songs} = data
          songs.map((song)=> {
            // 你知道的我是可以这样创建一个DOM元素的
            let $li = $(this.template
              .replace('{{song.name}}',song.name)
              .replace('{{song.singer}}',song.singer)
              .replace('{{song.id}}',song.id)
            )
            this.$el.find('ol.list').append($li)
          })
        }
    }

    let model = {
      data: {
        songs:[]
      },
      find() {
        var query = new AV.Query('Song');        
        return query.find().then((songs) => {
            this.data.songs = songs.map((song) => {
                // 这个id可是很重要的，当然在这里的find是批量获取,而不是get！id是用于获取单个对象实例了
                // 「...」你要的全拿走
                return {id: song.id, ...song.attributes}
            })
            // 拿到什么就返回什么，Promise的特点
            return songs
        })
      }
    }

    let controller = {
      init(view, model) {
        this.view = view
        this.view.init()
        this.model = model
        this.model.find().then(()=>{
          this.view.render(this.model.data)
        })
      }
    }

    controller.init(view,model)
}