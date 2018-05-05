import request from 'superagent';

window.onload = ()=>{
    document.getElementById('files').addEventListener('change', handleFileSelect, false);
    document.getElementById('submit').addEventListener('click', uploadAll, false);
    document.getElementById('messagePanel').addEventListener('click', closeMessagePanel, false);
}

async function handleFileSelect(e) {
    const files = e.target.files;

    for (let i = 0, f; f = files[i]; i++) {

        if (!f.type.match('image.*')) {
            continue;
        }

        var reader = new FileReader();

        reader.onload = ((theFile)=>{
            return (e)=>{
                addPhoto(e.target.result, theFile.name);
            };
        })(f);

        reader.readAsDataURL(f);
    }
    e.target.value = null;
}

function addPhoto(file, name){
    const box = document.createElement('div');
    box.classList.add('thumb');
    box.innerHTML = `<img src="${file}" title="${ escape(name)}" onload=" this.parentNode.classList.add('show');window.scrollTo(0, 10000000);"/>`;

    const removeButton = document.createElement('div');
    removeButton.classList.add('removePhoto');
    removeButton.innerHTML = `
<span class="fa-layers fa-fw">
    <i class="fas fa-circle"></i>
    <i class="fa-inverse fas fa-times" data-fa-transform="shrink-6"></i>
</span>
`;
    removeButton.addEventListener('click', removePhoto, false);

    box.insertBefore(removeButton, null);
    document.getElementById('list').insertBefore(box, null);
    updateCount();
}

function removePhoto(e){
    // thumb div tag
    const thumb = getParentThumb(e.target);
    thumb.classList.remove('show');
    setTimeout((dom)=>{
        dom.remove();
        updateCount();
    },500, thumb)
}

function getParentThumb(child){
    const parent = child.parentNode;
    if(parent.classList.contains('thumb')){
        return parent;
    }else{
        return getParentThumb(parent);
    }
}

function updateCount(){
    const thumbCount = document.getElementsByClassName('thumb').length;
    document.getElementById('photoCount').innerHTML = thumbCount;

    const upfile = document.getElementsByClassName('upfile')[0];
    const addButton = document.getElementsByClassName('addButton')[0];
    const explain = document.getElementsByClassName('explain')[0];
    const submit = document.getElementsByClassName('submit')[0];
    if(thumbCount === 0){
        upfile.classList.add('empty');
        addButton.classList.remove('border');
        explain.classList.remove('hidden');
        submit.classList.remove('show');
    }else{
        upfile.classList.remove('empty');
        addButton.classList.add('border');
        explain.classList.add('hidden');
        submit.classList.add('show');
    }
}

async function uploadAll(){
    const messagePanel = document.getElementById('messagePanel');
    messagePanel.classList.add('show');

    const thumbs = Array.from(document.getElementsByClassName('thumb'));
    const responses = await Promise.all(thumbs.map((dom)=>{
        const img = dom.firstElementChild;
        return postPhoto(img.src).catch(()=>{
            return false;
        });
    }))

    thumbs.forEach((dom)=>{
        dom.remove();
    })

    await new Promise(resolve => setTimeout(resolve, 2000));
    updateCount();
    const uploading = document.getElementsByClassName('uploading')[0];
    uploading.classList.remove('show');
    await new Promise(resolve => setTimeout(resolve, 200));

    if(responses.some((response)=>{
        return response
    })){
        const thank = document.getElementsByClassName('thank')[0];
        thank.classList.add('show');
    }else{
        const errorMessage = document.getElementsByClassName('error')[0];
        errorMessage.classList.add('show');
    }

}

async function postPhoto(file){
    const result = await request
        .post(`/api/photo`)
        .set('Content-Type', 'application/json')
        .withCredentials()
        .send({
            file
        })
        .catch((error)=>{
            console.error({
                error,
                message: 'failed to post image'
            });
            throw error;
        })
    return result.status === 204;
}

async function closeMessagePanel(){
    const messagePanel = document.getElementById('messagePanel');
    const uploading = document.getElementsByClassName('uploading')[0];
    const thank = document.getElementsByClassName('thank')[0];
    const error = document.getElementsByClassName('error')[0];

    if(thank.classList.contains('show') || error.classList.contains('show')){
        messagePanel.classList.remove('show');
        await new Promise(resolve => setTimeout(resolve, 200));
        uploading.classList.add('show');
        thank.classList.remove('show');
        error.classList.remove('show');
    }
}
