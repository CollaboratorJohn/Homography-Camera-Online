interface template {
    camera:string,
    camera_list:Array<string>,
    code_page_state: {
        codeonedit:string,
        codeupload:string,
        title:string
    }
}

const State: template = {
    camera: '',
    camera_list: [],
    code_page_state: {
        codeonedit:'',
        codeupload:'',
        title:'1'
    }
}

export default State