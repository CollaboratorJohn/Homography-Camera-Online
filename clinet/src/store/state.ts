interface template {
    camera:string,
    camera_list:Array<string>,
    code_page_state: {
        codeonedit:string,
        codeupload:string,
        title:string
    } | null
}

const State: template = {
    camera: '',
    camera_list: [],
    code_page_state: null
}

export default State