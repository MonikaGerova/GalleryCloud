(function () {
    var addPanel =  document.getElementById("addPhoto-panel");

    //open Add panel
    var postBtns = document.getElementById("post-button").addEventListener("click", function () {

            addPanel.style.display = "block";

    });
    // Close Add panel
    var closeButtons = document.getElementsByClassName("close-button");

    for (var i = 0; i < closeButtons.length; i++) {

        closeButtons[i].addEventListener("click",function () {
               clearPanel(this.parentNode,this.getAttribute("number"));
        });
    }


    //menu on add panel
    var menu = document.getElementById("menu").children;

    for (var i = 0; i < menu.length; i++) {
        menu[i].addEventListener("click",function () {
            var id = this.getAttribute("id");
            var visible = document.getElementsByClassName("visible")[0];
            var selected = document.getElementsByClassName("selected")[0];

            if(visible) document.getElementsByClassName("visible")[0].className = "";
            if(selected) document.getElementsByClassName("selected")[0].className = "";
            document.getElementById(id+"-box").className="visible";
            this.className = "selected";

            var previewBox= document.getElementById("preview-box");
            var responseBox= document.getElementById("response");

            previewBox.style.display = "block";
            responseBox.style.display = "block";
            previewBox.children[0].setAttribute("src","#");
            responseBox.innerHTML = "";

        });
    }

    //submit form

    var forms = document.forms;
    for (var i = 0; i < forms.length; i++) {
        forms[i].addEventListener("submit",function (event) {
            var response = document.getElementById("response");

            uploadRequest(this,response);

            event.preventDefault();
        }, false);
    }

    previewImage();
    getArticles();


    window.addEventListener("resize",function () {
        getArticles();
    })

})();


function previewImage() {

    var fileInput = document.getElementsByClassName("photo");

    for (var i = 0; i < fileInput.length; i++) {
        fileInput[i].addEventListener("change",function () {
            var box = document.getElementById("preview");

            var reader = new FileReader();
            reader.onload = function (e) {
                box.setAttribute("src", e.target.result);
            };
            reader.readAsDataURL(this.files[0]);
        });
    }

}

function uploadRequest(form,response) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.open("POST", "upload.php", true);
    var formData = new FormData(form);

    httpRequest.onload = function() {

        if (httpRequest.status == 200) {
            clearPanel(document.getElementById("addPhoto-panel"),1);
            getArticles();
        } else {
            response.innerHTML = "Error occurred when trying to upload your file.<br \/>";

        }
       console.log(httpRequest.response);
    };

    httpRequest.send(formData);
}

function clearPanel(panel, id) {

    panel.style.display = "none";

    if(id){
        document.getElementById("preview").removeAttribute("src");

        var selected = document.getElementsByClassName("selected")[0];
        var visible = document.getElementsByClassName("visible")[0];

        if(selected && visible){
            selected.className = "";
            visible.className = "";
        }
    }




}

function getRequest(url) {

    return new Promise(function(resolve, reject) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.open('GET', url);
        httpRequest.send();
        httpRequest.onload = function () {

            if (httpRequest.status == 200) {
                resolve(httpRequest.responseText);
            }else{
                reject("false");
            }
        };
    }, 250);
}

function getArticles() {

    return getRequest("uploads/photos.txt").then(function(successMessage,rejectMessage) {
        var arr = [];
        arr.push.apply(arr, successMessage.split("\n"));

            var content  = document.getElementById('content');
            content.innerHTML = "";
            var fragment = document.createDocumentFragment();


            for (var i = arr.length-1; i >=0; i--) {

                if(arr[i]){
                    var imageDiv = document.createElement('div');
                    imageDiv.className = "image";
                    var imgEl = document.createElement("img");
                    imgEl.setAttribute("src","uploads/"+arr[i]);
                    imageDiv.appendChild(imgEl);

                    fragment.appendChild(imageDiv);
                }
            }

            if(arr.length ==1){
                var div = document.createElement('div');
                div.setAttribute("id", "noPhotosYet");
                div.innerHTML = "<h3>No photos yet</h3>" +
                    "<div id=\"uploadPhoto\">Upload Photo</div>";
                fragment.appendChild(div);

                content.appendChild(fragment);

                document.getElementById("uploadPhoto").addEventListener("click",function () {
                    document.getElementById("addPhoto-panel").style.display = "block";
                });
            }else{
                content.appendChild(fragment);
            }

            resizeImages(content.children);
        });
}

function resizeImages(parentsDivs) {


    for (var i = 0; i < parentsDivs.length; i++) {

        var childElem = parentsDivs[i].children[0];

        var img = new Image();
        img.src = childElem.getAttribute("src");
        img.parent = parentsDivs[i];
        img.element = childElem;
        img.onload =function () {
            if(screen.width >490 && window.innerWidth > 680){
                if(this.width>this.height){
                    this.parent.style.width = "50vh";
                }else{
                    this.parent.style.width = "30vh";
                }
            }
        };

        img.element.addEventListener("click",function () {
            console.log(this.src + " was clicked");


            var moreAboutPhotoDiv = document.getElementById("moreAboutPhoto");
            moreAboutPhotoDiv.style.display = "block";
            var imageDiv = moreAboutPhotoDiv.children[1];
            imageDiv.innerHTML = "";
            var imgEl = this.cloneNode(true);
			
			if(screen.width <=490){
				if(imgEl.width > imgEl.height){
					imgEl.style.width = "98%";
					imgEl.style.height = "auto";
					imageDiv.style.margin = "17vh auto";
				}else{
					imgEl.style.height = "98%";
					imgEl.style.width = "auto";
					imageDiv.style.margin = "1vh auto";
				}
			}/* else{
				if(imgEl.width > imgEl.height){
					imgEl.style.width = "98%";
					imgEl.style.height = "auto";
					imageDiv.style.margin = "17vh auto";
				}else{
					imgEl.style.height = "98%";
					imgEl.style.width = "auto";
					imageDiv.style.margin = "1vh auto";
				}
			} */
			
		
            imageDiv.appendChild(imgEl);

        })

    }


}