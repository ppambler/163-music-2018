window.eventHub = {
    // 定义一个hash表
    events:{

    },
    // 发布
    emit(eventName,data) {
        for(let key in this.events) {
            if(key === eventName) {
                let fnList = this.events[key]
                // 推使用map，因为相较于forEach有返回值哈
                fnList.map((fn)=>{
                    fn.call(undefined,data)
                })
                
            }
        }
    },
    // 订阅
    on(eventName,fn) {
        if(this.events[eventName] === undefined) {
            this.events[eventName] = []
        }
        this.events[eventName].push(fn)
    }
}